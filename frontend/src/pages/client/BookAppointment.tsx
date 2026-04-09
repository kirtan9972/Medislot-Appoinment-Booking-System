import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { UserRound, Calendar, Clock, DollarSign, AlertCircle, CheckCircle2, ArrowLeft, Star, ArrowRight } from 'lucide-react';

const BookAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await API.getDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) {
      return toast.warning('Please fill all fields');
    }
    setShowConfirm(true);
  };

  const executeBooking = async () => {
    setShowConfirm(false);
    setBooking(true);
    try {
      await API.bookAppointment(selectedDoctor._id, date, time);
      toast.success('Appointment booked successfully! Waiting for approval.');
      navigate('/appointments');
    } catch (error: any) {
      toast.error(error.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4 mb-md-5">
        <button onClick={() => navigate(-1)} className="btn btn-light rounded-2xl p-0 w-12 h-12 d-flex align-items-center justify-content-center shadow-sm hover:bg-white hover:shadow-md transition-all">
          <ArrowLeft size={24} className="text-emerald-700" />
        </button>
        <div>
          <h1 className="serif h2 mb-1 text-dark">Book an Appointment</h1>
          <p className="text-muted small mb-0 fw-medium">Select your preferred specialist and schedule your visit in just a few clicks.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-emerald-600"></div></div>
      ) : (
        <div className="row g-4 g-lg-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="serif h4 mb-0 text-dark">Available Specialists</h3>
              <span className="badge bg-emerald-50 text-emerald-700 rounded-pill px-3 py-2 x-small fw-bold">{doctors.length} DOCTORS FOUND</span>
            </div>
            <div className="row g-4">
              {doctors.map((doc) => (
                <motion.div 
                  className="col-12 col-md-6" 
                  key={doc._id}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className={`card h-100 p-4 cursor-pointer border-2 transition-all rounded-[32px] bg-white ${selectedDoctor?._id === doc._id ? 'border-emerald-600 shadow-2xl scale-[1.02]' : 'border-transparent shadow-sm hover:shadow-xl'}`} 
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    <div className="d-flex align-items-center gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        {doc.image ? (
                          <img src={doc.image} alt={doc.name} className="rounded-[24px] object-cover w-16 h-16 w-md-20 h-md-20 shadow-md border-2 border-white" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="bg-emerald-50 w-16 h-16 w-md-20 h-md-20 rounded-[24px] flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
                            <UserRound size={32} />
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                          <div className="bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="serif fw-bold mb-1 text-truncate h5 text-dark">{doc.name}</h5>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <span className="text-emerald-700 small fw-bold uppercase tracking-wider x-small">{doc.specialization}</span>
                          <span className="text-muted px-2 border-start border-gray-200 small d-flex align-items-center gap-1 fw-medium">
                            <Star size={12} className="text-amber-400 fill-amber-400" /> 4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-light p-3 rounded-2xl d-flex justify-content-between align-items-center mb-4 border border-white">
                      <div className="small text-muted d-flex align-items-center gap-2 fw-medium">
                        <DollarSign size={16} className="text-emerald-600" /> Consultation Fee
                      </div>
                      <div className="fw-bold text-emerald-800 h5 mb-0">${doc.fees}</div>
                    </div>

                    <button className={`btn w-full py-3 rounded-pill fw-bold transition-all shadow-sm ${selectedDoctor?._id === doc._id ? 'btn-primary' : 'btn-outline-dark hover:bg-dark hover:text-white'}`}>
                      {selectedDoctor?._id === doc._id ? (
                        <span className="d-flex align-items-center justify-content-center gap-2"><CheckCircle2 size={18} /> Selected</span>
                      ) : 'Select Specialist'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card p-4 p-md-5 sticky-top border-0 shadow-2xl rounded-[32px] bg-white" style={{ top: '100px' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                  <Calendar size={24} />
                </div>
                <h3 className="serif h4 mb-0 text-dark">Schedule Slot</h3>
              </div>
              <form onSubmit={handleBook}>
                <div className="mb-4">
                  <label className="form-label x-small fw-bold text-uppercase tracking-[0.2em] text-muted mb-2 d-block">
                    Appointment Date
                  </label>
                  <div className="position-relative">
                    <Calendar className="position-absolute left-3 top-50 translate-middle-y text-emerald-600" size={20} />
                    <input 
                      type="date" 
                      className="form-control ps-5 py-3 rounded-2xl border-light bg-light focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all shadow-none" 
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4 mb-md-5">
                  <label className="form-label x-small fw-bold text-uppercase tracking-[0.2em] text-muted mb-2 d-block">
                    Available Time
                  </label>
                  <div className="position-relative">
                    <Clock className="position-absolute left-3 top-50 translate-middle-y text-emerald-600" size={20} />
                    <select 
                      className="form-select ps-5 py-3 rounded-2xl border-light bg-light focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all shadow-none" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      disabled={!selectedDoctor}
                      required
                    >
                      <option value="">Choose a time slot</option>
                      {selectedDoctor?.availableSlots?.map((slot: string) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-[24px] mb-4 mb-md-5 border border-emerald-100">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-emerald-800 small fw-medium">Specialist</span>
                    <span className="fw-bold text-emerald-900 serif">{selectedDoctor?.name || '---'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-emerald-800 small fw-medium">Total Amount</span>
                    <span className="fw-bold text-emerald-900 h4 mb-0">${selectedDoctor?.fees || 0}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary rounded-pill w-full py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg hover:translate-y-[-2px] transition-all"
                  disabled={booking || !selectedDoctor || !date || !time}
                >
                  {booking ? (
                    <><div className="spinner-border spinner-border-sm"></div> Processing...</>
                  ) : (
                    <>Confirm Booking <ArrowRight size={20} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-2xl rounded-[40px] overflow-hidden bg-white">
              <div className="modal-body p-4 p-md-5 text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <CheckCircle2 className="text-emerald-600" size={40} />
                </div>
                <h3 className="serif h3 mb-2 text-dark">Confirm Your Visit</h3>
                <p className="text-muted mb-5 small fw-medium">Please review your appointment details before we finalize the booking.</p>
                
                <div className="bg-light p-4 rounded-[32px] text-start mb-5 border border-white shadow-sm">
                  <div className="d-flex align-items-center gap-4 mb-4">
                    {selectedDoctor?.image ? (
                      <img src={selectedDoctor.image} alt={selectedDoctor.name} className="rounded-2xl object-cover w-14 h-14 shadow-md border-2 border-white" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border-2 border-white">
                        <UserRound size={24} />
                      </div>
                    )}
                    <div>
                      <div className="x-small text-muted fw-bold uppercase tracking-wider mb-1">Specialist</div>
                      <div className="fw-bold text-lg text-dark serif">{selectedDoctor?.name}</div>
                    </div>
                  </div>
                  <div className="row g-4">
                    <div className="col-6">
                      <div className="x-small text-muted fw-bold uppercase tracking-wider mb-1">Date</div>
                      <div className="fw-bold d-flex align-items-center gap-2 text-dark serif">
                        <Calendar size={16} className="text-emerald-600" /> {date}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="x-small text-muted fw-bold uppercase tracking-wider mb-1">Time</div>
                      <div className="fw-bold d-flex align-items-center gap-2 text-dark serif">
                        <Clock size={16} className="text-emerald-600" /> {time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3">
                  <button className="btn btn-light flex-grow-1 py-3 rounded-pill fw-bold order-2 order-sm-1 shadow-sm hover:bg-gray-200 transition-all" onClick={() => setShowConfirm(false)}>
                    Go Back
                  </button>
                  <button className="btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold shadow-lg order-1 order-sm-2 hover:scale-105 transition-all" onClick={executeBooking}>
                    Confirm & Book
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

export default BookAppointment;
