import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Calendar, Clock, User as UserIcon, AlertCircle, XCircle, CheckCircle2, MoreVertical, Video, FileText } from 'lucide-react';

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await API.getMyAppointments();
      setAppointments(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
  };

  const confirmCancel = async () => {
    if (!cancellingId) return;
    try {
      await API.cancelAppointment(cancellingId);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved': return { label: 'Approved', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={14} /> };
      case 'rejected': return { label: 'Rejected', color: 'bg-red-400 text-red-700', icon: <XCircle size={14} /> };
      case 'cancelled': return { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: <XCircle size={14} /> };
      default: return { label: 'Pending Approval', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> };
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-4 mb-md-5">
        <div>
          <h1 className="serif h2 mb-1 text-dark">My Appointments</h1>
          <p className="text-muted small mb-0 fw-medium">Keep track of your upcoming and past medical consultations.</p>
        </div>
        <button 
          onClick={() => navigate('/book-appointment')} 
          className="btn btn-primary rounded-pill px-4 py-3 fw-bold shadow-lg hover:translate-y-[-2px] transition-all d-flex align-items-center justify-content-center gap-2"
        >
          <Calendar size={20} /> Book New Visit
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-emerald-600"></div></div>
      ) : appointments.length > 0 ? (
        <div className="row g-4">
          {appointments.map((apt, index) => {
            const status = getStatusInfo(apt.status);
            return (
              <motion.div 
                className="col-12 col-xl-6" 
                key={apt._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="card border-0 shadow-sm hover:shadow-xl transition-all rounded-[32px] overflow-hidden bg-white h-100">
                  <div className="p-4 p-md-5">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-4 mb-4 mb-md-5">
                      <div className="d-flex align-items-center gap-4">
                        <div className="relative">
                          {apt.doctorId?.image ? (
                            <img src={apt.doctorId.image} alt={apt.doctorId.name} className="rounded-[24px] object-cover w-16 h-16 shadow-md border-2 border-white" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="bg-emerald-50 w-16 h-16 rounded-[24px] flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
                              <UserIcon size={32} />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                            <div className="bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                        <div>
                          <h5 className="serif fw-bold mb-1 text-dark h5">{apt.doctorId?.name || 'Doctor'}</h5>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-emerald-700 small fw-bold uppercase tracking-wider x-small">{apt.doctorId?.specialization || 'Specialist'}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`badge rounded-pill px-4 py-2 fw-bold x-small uppercase tracking-widest ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="row g-4 mb-4 mb-md-5">
                      <div className="col-sm-6">
                        <div className="bg-light p-4 rounded-[24px] border border-white shadow-sm h-100">
                          <div className="x-small text-muted fw-bold uppercase tracking-wider mb-2">Schedule</div>
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark serif">{apt.date}</div>
                              <div className="small text-muted fw-medium">{apt.time}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="bg-light p-4 rounded-[24px] border border-white shadow-sm h-100">
                          <div className="x-small text-muted fw-bold uppercase tracking-wider mb-2">Visit Type</div>
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm">
                              <Video size={18} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark serif">Video Consultation</div>
                              <div className="small text-muted fw-medium">Online Session</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-3">
                      {apt.status === 'approved' && (
                        <button className="btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 hover:scale-105 transition-all">
                          <Video size={20} /> Join Video Call
                        </button>
                      )}
                      {apt.status === 'pending' && (
                        <button 
                          className="btn btn-outline-danger flex-grow-1 py-3 rounded-pill fw-bold border-2 d-flex align-items-center justify-content-center gap-2 hover:bg-danger hover:text-white transition-all"
                          onClick={() => handleCancel(apt._id)}
                        >
                          <XCircle size={20} /> Cancel Appointment
                        </button>
                      )}
                      <button className="btn btn-light flex-grow-1 py-3 rounded-pill fw-bold shadow-sm hover:bg-gray-200 transition-all d-flex align-items-center justify-content-center gap-2">
                        <FileText size={20} className="text-emerald-600" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-emerald-600" size={40} />
          </div>
          <h3 className="serif h4 mb-2 text-dark">No appointments found</h3>
          <p className="text-muted mb-4 small fw-medium">You haven't scheduled any medical visits yet.</p>
          <button onClick={() => navigate('/book-appointment')} className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-md">
            Schedule Your First Visit
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingId && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-2xl rounded-[40px] overflow-hidden bg-white">
              <div className="modal-body p-4 p-md-5 text-center">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-500" size={40} />
                </div>
                <h3 className="serif h3 mb-2 text-dark">Cancel Appointment?</h3>
                <p className="text-muted mb-5 small fw-medium">This action cannot be undone. Are you sure you want to cancel this medical consultation?</p>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button className="btn btn-light flex-grow-1 py-3 rounded-pill fw-bold order-2 order-sm-1 shadow-sm hover:bg-gray-200 transition-all" onClick={() => setCancellingId(null)}>
                    No, Keep It
                  </button>
                  <button 
                    className="btn btn-danger flex-grow-1 py-3 rounded-pill fw-bold shadow-lg order-1 order-sm-2 hover:scale-105 transition-all"
                    onClick={confirmCancel}
                  >
                    Yes, Cancel Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
