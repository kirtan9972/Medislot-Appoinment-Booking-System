import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Bell, Clock, User as UserIcon, CheckCircle } from 'lucide-react';

const DoctorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/admin/notifications/doctors');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch doctor notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="mb-4 mb-md-5">
        <h2 className="serif h2 mb-1 text-dark">Doctor Notifications</h2>
        <p className="text-muted small mb-0 fw-medium">Monitor reminders and alerts sent to medical staff.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : notifications.length > 0 ? (
        <div className="card border-0 shadow-sm overflow-hidden rounded-[32px] bg-white">
          <div className="list-group list-group-flush">
            {notifications.map((notif) => (
              <div key={notif._id} className="list-group-item p-4 p-md-5 border-0 border-start border-4 border-primary bg-white hover:bg-light transition-all">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex gap-4">
                    <div className="bg-primary-subtle p-3 rounded-2xl text-primary h-12 w-12 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm">
                      <Bell size={24} />
                    </div>
                    <div>
                      <h6 className="serif mb-2 fw-bold text-dark h5">{notif.title}</h6>
                      <p className="text-muted mb-3 leading-relaxed">{notif.message}</p>
                      <div className="d-flex flex-wrap align-items-center gap-x-4 gap-y-2 text-muted small fw-medium">
                        <span className="d-flex align-items-center gap-1.5"><Clock size={14} className="text-primary" /> {notif.date}</span>
                        <span className="d-flex align-items-center gap-1.5 text-success fw-bold uppercase tracking-wider x-small">
                          <CheckCircle size={14} /> Email Sent Successfully
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5 card border-0 shadow-sm rounded-[32px] bg-white p-5">
          <div className="bg-light p-4 rounded-circle d-inline-flex mb-4">
            <Bell size={64} className="text-muted opacity-20" />
          </div>
          <h4 className="serif h4 text-dark">No notifications yet</h4>
          <p className="text-muted mb-0">Doctor reminders and alerts will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorNotifications;
