import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { HelpCircle, MessageSquare, Phone, Mail, Send, ChevronDown, ChevronUp } from 'lucide-react';

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I cancel an appointment?", a: "Go to 'My Appointments', find the pending appointment, and click the 'Cancel' button." },
    { q: "Can I change my doctor after booking?", a: "Currently, you need to cancel the existing appointment and book a new one with the desired doctor." },
    { q: "How do I view my medical reports?", a: "All your prescriptions and reports are available in the 'Medical Records' section." },
    { q: "What should I do if I'm late?", a: "Please contact the hospital support line at +1 (555) 000-1111 as soon as possible." },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setSubmitting(true);
    try {
      await API.post('/support/feedback', {
        ...formData,
        name: user.name,
        email: user.email,
      });
      toast.success('Your message has been sent. We will get back to you soon!');
      setFormData({ subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3">
      <div className="row g-4 g-lg-5">
        <div className="col-12 col-lg-7">
          <h2 className="serif h2 mb-4">Frequently Asked Questions</h2>
          <div className="d-flex flex-column gap-3 mb-5">
            {faqs.map((faq, index) => (
              <div key={index} className="card border-0 shadow-sm overflow-hidden rounded-4">
                <button 
                  className="btn btn-white text-start p-3 p-md-4 d-flex justify-content-between align-items-center border-0 shadow-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="fw-bold small-md">{faq.q}</span>
                  <div className={`transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-primary" />
                  </div>
                </button>
                {openFaq === index && (
                  <div className="card-body px-4 pb-4 pt-0 text-muted small border-top border-light mt-2 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5">
            <h4 className="serif h4 mb-4">Contact Information</h4>
            <div className="row g-3 g-md-4">
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-4 shadow-sm border">
                  <div className="bg-primary-subtle p-3 rounded-3 text-primary shadow-sm"><Phone size={20} /></div>
                  <div>
                    <div className="small text-muted x-small">Phone Support</div>
                    <div className="fw-bold small">+1 (555) 000-1111</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-4 shadow-sm border">
                  <div className="bg-success-subtle p-3 rounded-3 text-success shadow-sm"><Mail size={20} /></div>
                  <div>
                    <div className="small text-muted x-small">Email Support</div>
                    <div className="fw-bold small">support@medislot.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-lg p-4 p-md-5 rounded-[32px] bg-white sticky-top" style={{ top: '2rem' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-primary p-3 rounded-4 text-white shadow-md">
                <MessageSquare size={24} />
              </div>
              <h4 className="serif h4 mb-0">Send us a Message</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Subject</label>
                <input 
                  type="text" 
                  className="form-control py-3 rounded-3 border-light bg-light focus:bg-white" 
                  placeholder="How can we help?" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Message</label>
                <textarea 
                  className="form-control rounded-3 border-light bg-light focus:bg-white" 
                  rows={5} 
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-lg transition-transform hover:scale-105" disabled={submitting}>
                <Send size={18} /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
