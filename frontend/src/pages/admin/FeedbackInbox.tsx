import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Mail, MessageSquare, CheckCircle, Clock, User as UserIcon, Search } from 'lucide-react';

const FeedbackInbox: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data } = await API.get('/admin/feedback');
      setFeedback(data);
    } catch (error) {
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await API.put(`/admin/feedback/${id}/resolve`);
      setFeedback(feedback.map(f => f._id === id ? { ...f, status: 'resolved' } : f));
      toast.success('Feedback marked as resolved');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredFeedback = feedback.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1 text-dark">Feedback Inbox</h2>
          <p className="text-muted small mb-0 fw-medium">Manage patient inquiries and support requests.</p>
        </div>
        <div className="position-relative" style={{ minWidth: '300px' }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
          <input
            type="text"
            className="form-control ps-5 py-2.5 rounded-pill border-light bg-white shadow-sm focus:border-primary focus:ring-4 focus:ring-primary-subtle transition-all"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : filteredFeedback.length > 0 ? (
        <div className="row g-4">
          {filteredFeedback.map((item) => (
            <div className="col-12" key={item._id}>
              <div className={`card border-0 shadow-sm p-4 p-md-5 rounded-[32px] bg-white border-start border-4 transition-all hover:shadow-md ${item.status === 'resolved' ? 'border-success' : 'border-warning'}`}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
                  <div className="d-flex gap-4 flex-grow-1">
                    <div className={`p-3 rounded-2xl d-none d-md-flex align-items-center justify-content-center flex-shrink-0 h-14 w-14 ${item.status === 'resolved' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      <MessageSquare size={28} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <h5 className="serif fw-bold mb-0 h4 text-dark">{item.subject}</h5>
                        {item.status === 'resolved' ? (
                          <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 x-small fw-bold">RESOLVED</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2 x-small fw-bold">PENDING</span>
                        )}
                      </div>
                      <div className="d-flex flex-wrap align-items-center gap-x-4 gap-y-2 text-muted small mb-4 fw-medium">
                        <span className="d-flex align-items-center gap-1.5"><UserIcon size={14} className="text-primary" /> {item.name}</span>
                        <span className="d-flex align-items-center gap-1.5 text-primary-subtle font-mono x-small">{item.email}</span>
                        <span className="d-flex align-items-center gap-1.5"><Clock size={14} className="text-primary" /> {item.date}</span>
                      </div>
                      <div className="bg-light p-4 rounded-2xl border border-white">
                        <p className="text-dark mb-0 leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  </div>
                  {item.status !== 'resolved' && (
                    <button className="btn btn-success text-white rounded-pill px-4 py-2.5 d-flex align-items-center gap-2 shadow-sm hover:scale-105 transition-all fw-bold small flex-shrink-0" onClick={() => handleResolve(item._id)}>
                      <CheckCircle size={18} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 card border-0 shadow-sm rounded-[32px] bg-white p-5">
          <div className="bg-light p-4 rounded-circle d-inline-flex mb-4">
            <Mail size={64} className="text-muted opacity-20" />
          </div>
          <h4 className="serif h4 text-dark">Inbox is empty</h4>
          <p className="text-muted mb-0">No feedback messages found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackInbox;
