import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { FileText, Download, Calendar, User as UserIcon, Search, ArrowRight } from 'lucide-react';

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await API.get('/records/my');
      setRecords(data);
    } catch (error) {
      toast.error('Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3 px-md-4">
      <div className="row mb-4 mb-md-5 align-items-end g-4">
        <div className="col-12 col-md-7">
          <h1 className="serif h2 mb-1 text-dark">Medical Archives</h1>
          <p className="text-muted mb-0 fw-medium small">Secure access to your clinical history and prescriptions.</p>
        </div>
        <div className="col-12 col-md-5">
          <div className="position-relative">
            <Search className="position-absolute left-4 top-50 translate-middle-y text-muted" size={20} />
            <input
              type="text"
              className="form-control ps-5 py-3 rounded-2xl border-light bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm transition-all"
              placeholder="Search diagnosis or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-emerald-600"></div></div>
      ) : filteredRecords.length > 0 ? (
        <div className="row g-4">
          {filteredRecords.map((record, index) => (
            <motion.div 
              className="col-12 col-lg-6" 
              key={record._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card h-100 p-4 p-md-5 border-0 shadow-sm hover:shadow-xl transition-all rounded-[40px] bg-white">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="bg-emerald-50 w-14 h-14 rounded-[24px] flex items-center justify-center text-emerald-600 shadow-inner">
                    <FileText size={32} />
                  </div>
                  <button className="btn btn-light rounded-full p-3 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-sm">
                    <Download size={24} />
                  </button>
                </div>
                
                <h3 className="serif h3 mb-2 text-dark">{record.diagnosis}</h3>
                <div className="d-flex align-items-center gap-2 text-muted small mb-4 mb-md-5 fw-medium">
                  <Calendar size={16} className="text-emerald-600" /> {record.date}
                </div>

                <div className="bg-light p-4 rounded-[32px] border border-white shadow-sm">
                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="x-small text-muted fw-bold uppercase tracking-wider mb-1">Prescribing Physician</div>
                      <div className="fw-bold text-dark serif">{record.doctorName}</div>
                    </div>
                  </div>
                  <div className="x-small text-muted mb-2 fw-bold uppercase tracking-widest">Prescription Details</div>
                  <p className="text-dark mb-0 leading-relaxed small fw-medium">
                    {record.prescription}
                  </p>
                </div>
                
                <div className="mt-4 pt-2 d-flex justify-content-end">
                  <button className="btn btn-link text-emerald-700 fw-bold text-decoration-none small d-flex align-items-center gap-2 hover:gap-3 transition-all p-0">
                    View Full Report <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-emerald-600" size={40} />
          </div>
          <h3 className="serif h4 mb-2 text-dark">No records found</h3>
          <p className="text-muted mb-0 small fw-medium">We couldn't find any medical records matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
