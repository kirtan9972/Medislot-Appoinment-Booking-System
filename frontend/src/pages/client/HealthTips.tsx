import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Lightbulb, Calendar, Tag, ChevronRight, ArrowRight, Mail } from 'lucide-react';

const HealthTips: React.FC = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data } = await API.get('/health-tips');
      setTips(data);
    } catch (error) {
      toast.error('Failed to fetch health tips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3 px-md-4">
      <div className="mb-4 mb-md-5 text-center">
        <h1 className="serif display-4 mb-2 text-dark">Wellness & Vitality</h1>
        <p className="text-muted lead small fw-medium max-w-2xl mx-auto">Expert insights curated for your balanced lifestyle. Stay updated with the latest health trends and medical advice.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-emerald-600"></div></div>
      ) : (
        <div className="row g-4">
          {tips.map((tip, index) => (
            <motion.div 
              className="col-12 col-md-6 col-lg-4" 
              key={tip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card h-100 border-0 shadow-sm hover:shadow-xl transition-all rounded-[40px] overflow-hidden bg-white group">
                <div className="medical-gradient p-5 d-flex justify-content-center position-relative overflow-hidden">
                  <Lightbulb className="text-white position-relative z-10" size={56} />
                  <div className="position-absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full x-small fw-bold uppercase tracking-widest">
                      {tip.category}
                    </span>
                    <span className="text-muted x-small d-flex align-items-center gap-2 fw-medium">
                      <Calendar size={14} className="text-emerald-600" /> {tip.date}
                    </span>
                  </div>
                  <h3 className="serif h4 mb-3 text-dark leading-tight group-hover:text-emerald-700 transition-colors">{tip.title}</h3>
                  <p className="text-muted mb-5 leading-relaxed small fw-medium">{tip.content}</p>
                  <button className="btn btn-link text-emerald-700 p-0 text-decoration-none d-flex align-items-center gap-2 fw-bold hover:gap-3 transition-all small">
                    Read Article <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        className="mt-5 p-4 p-md-5 medical-gradient rounded-[40px] text-white text-center shadow-2xl position-relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="position-relative z-10">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md shadow-inner">
            <Mail size={32} />
          </div>
          <h2 className="serif h2 mb-3">Stay Informed</h2>
          <p className="mb-5 opacity-80 max-w-lg mx-auto small fw-medium">Join our wellness community and receive the latest health insights directly in your inbox.</p>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              className="form-control bg-white/10 border-white/20 text-white placeholder-white/50 rounded-pill px-4 py-3 backdrop-blur-md focus:bg-white/20 focus:border-white/40 shadow-sm transition-all" 
              placeholder="Your email address" 
            />
            <button className="btn btn-light rounded-pill px-5 py-3 fw-bold text-emerald-900 shadow-lg hover:scale-105 transition-all">
              Subscribe
            </button>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className="position-absolute top-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="position-absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </motion.div>
    </div>
  );
};

export default HealthTips;
