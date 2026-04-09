import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import API from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { Calendar, Clock, User as UserIcon, CheckCircle, XCircle, AlertCircle, ArrowRight, Activity, Heart, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user._id]);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get('/appointments/my');
      if (Array.isArray(data)) {
        setAppointments(data.slice(0, 3)); // Show only last 3 for a cleaner look
      }
    } catch (error) {
      console.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Approved</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Rejected</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Cancelled</span>;
      default: return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Pending</span>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="container mt-4 mt-md-5 pb-5 px-3 px-md-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="row mb-4 mb-md-5">
        <div className="col-12">
          <div className="medical-gradient p-4 p-md-5 rounded-[32px] shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.8, x: 0 }}
                className="text-xs text-md-sm uppercase tracking-[0.2em] fw-bold mb-3 d-block"
              >
                Welcome back
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="serif display-4 display-5-md mb-3 fw-bold"
              >
                Hello, {user.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.4 }}
                className="lead mb-0 d-none d-sm-block max-w-2xl fw-medium"
              >
                Your health journey is our priority. We've updated your records and have new health tips waiting for you.
              </motion.p>
            </div>
            {/* Abstract background shapes */}
            <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-white opacity-10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-50px] left-[10%] w-64 h-64 bg-white opacity-5 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <motion.div className="col-12 col-md-4" variants={itemVariants}>
          <div className="card h-100 p-4 p-md-5 border-0 shadow-sm hover:shadow-xl transition-all group rounded-[32px] bg-white">
            <div className="bg-emerald-50 w-16 h-16 w-md-20 h-md-20 rounded-[24px] flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-3">
              <Calendar className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
            </div>
            <h3 className="serif h4 mb-3 text-dark">Book Appointment</h3>
            <p className="text-muted small mb-4 leading-relaxed">Find the right specialist and secure your time in seconds with our instant booking system.</p>
            <Link to="/book" className="btn btn-primary w-full d-flex align-items-center justify-content-center gap-2 rounded-pill py-3 fw-bold shadow-lg hover:translate-y-[-2px] transition-all mt-auto">
              Book Now <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        <motion.div className="col-12 col-md-4" variants={itemVariants}>
          <div className="card h-100 p-4 p-md-5 border-0 shadow-sm hover:shadow-xl transition-all group rounded-[32px] bg-white">
            <div className="bg-blue-50 w-16 h-16 w-md-20 h-md-20 rounded-[24px] flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:-rotate-3">
              <Activity className="text-blue-600 group-hover:text-white transition-colors" size={32} />
            </div>
            <h3 className="serif h4 mb-3 text-dark">Health Records</h3>
            <p className="text-muted small mb-4 leading-relaxed">Access your complete medical history, digital prescriptions, and lab results securely in one place.</p>
            <Link to="/records" className="btn btn-outline-dark rounded-pill w-full py-3 d-flex align-items-center justify-content-center gap-2 fw-bold hover:bg-dark hover:text-white transition-all mt-auto">
              View Records
            </Link>
          </div>
        </motion.div>

        <motion.div className="col-12 col-md-4" variants={itemVariants}>
          <div className="card h-100 p-4 p-md-5 border-0 shadow-sm hover:shadow-xl transition-all group rounded-[32px] bg-white">
            <div className="bg-rose-50 w-16 h-16 w-md-20 h-md-20 rounded-[24px] flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white group-hover:rotate-3">
              <Heart className="text-rose-600 group-hover:text-white transition-colors" size={32} />
            </div>
            <h3 className="serif h4 mb-3 text-dark">Wellness Tips</h3>
            <p className="text-muted small mb-4 leading-relaxed">Discover personalized advice and articles curated for your specific health needs and lifestyle.</p>
            <Link to="/health-tips" className="btn btn-outline-dark rounded-pill w-full py-3 d-flex align-items-center justify-content-center gap-2 fw-bold hover:bg-dark hover:text-white transition-all mt-auto">
              Explore Tips
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="row mt-4 mt-md-5 pt-2 pt-md-4 g-4">
        <motion.div className="col-lg-8" variants={itemVariants}>
          <div className="card p-4 p-md-5 border-0 shadow-sm rounded-[32px] bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 mb-md-5">
              <div>
                <h3 className="serif h4 mb-1 text-dark">Upcoming Consultations</h3>
                <p className="text-muted small mb-0 fw-medium">Your scheduled visits for the next few days.</p>
              </div>
              <Link to="/appointments" className="btn btn-light rounded-pill px-4 py-2 text-emerald-700 fw-bold text-decoration-none small d-flex align-items-center gap-2 hover:bg-emerald-50 transition-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-emerald-600"></div></div>
            ) : appointments.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {appointments.map((apt) => (
                  <div key={apt._id} className="p-4 bg-light rounded-[24px] d-flex flex-column flex-sm-row align-items-sm-center justify-content-between transition-all hover:bg-white hover:shadow-lg border border-transparent hover:border-emerald-100 gap-4 group">
                    <div className="d-flex align-items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                        <UserIcon className="text-emerald-600" size={24} />
                      </div>
                      <div>
                        <div className="fw-bold text-lg text-dark serif">{apt.doctorId?.name}</div>
                        <div className="text-muted small fw-medium uppercase tracking-wider x-small">{apt.doctorId?.specialization}</div>
                      </div>
                    </div>
                    <div className="text-sm-end border-top border-sm-top-0 pt-3 pt-sm-0 d-flex flex-column align-items-sm-end">
                      <div className="d-flex align-items-center gap-2 text-dark fw-bold mb-1">
                        <Calendar size={16} className="text-emerald-600" /> {apt.date}
                      </div>
                      <div className="d-flex align-items-center gap-2 text-muted small mb-3 fw-medium">
                        <Clock size={16} className="text-emerald-600" /> {apt.time}
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-light rounded-[24px] border border-dashed border-gray-300">
                <div className="bg-white p-4 rounded-circle d-inline-flex mb-4 shadow-sm">
                  <AlertCircle size={48} className="text-muted opacity-20" />
                </div>
                <h5 className="serif text-dark">No upcoming appointments</h5>
                <p className="text-muted small mb-0">Stay healthy! Your schedule is clear for now.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div className="col-lg-4" variants={itemVariants}>
          <div className="card p-4 p-md-5 border-0 medical-gradient text-white h-100 rounded-[32px] shadow-xl relative overflow-hidden">
            <div className="relative z-10 h-100 d-flex flex-column">
              <div className="bg-white/20 w-16 h-16 rounded-2xl d-flex align-items-center justify-content-center mb-4 backdrop-blur-md">
                <Shield size={32} className="text-white" />
              </div>
              <h3 className="serif h3 mb-3">Health Insurance</h3>
              <p className="opacity-80 mb-5 fw-medium leading-relaxed">Your premium plan is active. You have 100% coverage for general consultations and 80% for specialized surgeries.</p>
              
              <div className="mt-auto">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 mb-4">
                  <div className="small opacity-70 mb-1 uppercase tracking-widest x-small fw-bold">Policy Number</div>
                  <div className="fw-bold tracking-widest h4 mb-0 font-mono">MED-8829-XPL</div>
                </div>
                <button className="btn btn-light rounded-pill w-full py-3 text-emerald-800 fw-bold shadow-lg hover:scale-105 transition-all">
                  Manage Policy
                </button>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-[20%] right-[-40px] w-48 h-48 bg-white opacity-5 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
