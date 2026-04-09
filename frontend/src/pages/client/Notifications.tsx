import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Bell, Check, Trash2, Clock, Info } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications/my');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    toast.info('Marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n._id !== id));
    toast.success('Notification deleted');
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1 text-dark">Notifications</h2>
          <p className="text-muted small mb-0 fw-medium">Stay updated with your appointment status and health alerts.</p>
        </div>
        <button 
          className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition-all hover:scale-105 d-flex align-items-center justify-content-center gap-2" 
          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
        >
          <Check size={18} /> Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : notifications.length > 0 ? (
        <div className="card border-0 shadow-sm overflow-hidden rounded-[40px] bg-white">
          <div className="list-group list-group-flush">
            {notifications.map((notif) => (
              <div key={notif._id} className={`list-group-item p-4 p-md-5 border-0 border-start border-4 transition-all ${notif.read ? 'border-transparent opacity-75' : 'border-primary bg-primary-subtle bg-opacity-5'}`}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
                  <div className="d-flex gap-4">
                    <div className={`p-3 rounded-[20px] flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm ${notif.read ? 'bg-light text-muted' : 'bg-primary text-white'}`} style={{ width: '56px', height: '56px' }}>
                      <Bell size={24} />
                    </div>
                    <div>
                      <h6 className={`mb-1 fw-bold h6 ${notif.read ? 'text-muted' : 'text-dark'}`}>{notif.title}</h6>
                      <p className="text-muted small mb-3 leading-relaxed fw-medium">{notif.message}</p>
                      <div className="d-flex align-items-center gap-2 text-muted x-small fw-bold uppercase tracking-widest">
                        <Clock size={14} className="text-primary" /> {notif.date}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 ms-md-auto">
                    {!notif.read && (
                      <button className="btn btn-light rounded-2xl p-3 shadow-sm hover:bg-success-subtle hover:text-success transition-all" onClick={() => markAsRead(notif._id)} title="Mark as read">
                        <Check size={20} />
                      </button>
                    )}
                    <button className="btn btn-light rounded-2xl p-3 shadow-sm hover:bg-danger-subtle hover:text-danger transition-all" onClick={() => deleteNotification(notif._id)} title="Delete">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5 card border-0 shadow-sm rounded-[40px] px-4 bg-white border border-gray-100">
          <div className="bg-light p-5 rounded-full d-inline-flex mb-4 mx-auto shadow-inner">
            <Bell size={64} className="text-muted opacity-20" />
          </div>
          <h3 className="serif h3 mb-2 text-dark">All caught up!</h3>
          <p className="text-muted small fw-medium">You have no new notifications at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
