import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Beaker, Download, Calendar, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const LabResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      // Simulating lab results
      const mockResults = [
        { _id: '1', date: '2026-02-28', testName: 'Complete Blood Count (CBC)', status: 'Normal', result: 'All parameters within range' },
        { _id: '2', date: '2026-02-20', testName: 'Lipid Profile', status: 'Attention', result: 'Slightly high cholesterol' },
        { _id: '3', date: '2026-01-15', testName: 'Blood Sugar (Fasting)', status: 'Normal', result: '95 mg/dL' },
      ];
      setResults(mockResults);
    } catch (error) {
      toast.error('Failed to fetch lab results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3">
      <div className="mb-4 mb-md-5">
        <h2 className="serif h2 mb-1">Lab Results</h2>
        <p className="text-muted small mb-0">Access your diagnostic test reports and laboratory findings.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : results.length > 0 ? (
        <div className="row g-4">
          {results.map((res) => (
            <div className="col-12 col-md-6 col-xl-4" key={res._id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden rounded-[32px] transition-transform hover:scale-[1.02] hover:shadow-md">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="bg-primary-subtle p-3 rounded-4 text-primary shadow-sm">
                      <Beaker size={24} />
                    </div>
                    <span className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${res.status === 'Normal' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {res.status === 'Normal' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                      {res.status}
                    </span>
                  </div>
                  <h5 className="serif h5 mb-2">{res.testName}</h5>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-4">
                    <Calendar size={14} className="text-primary" /> {res.date}
                  </div>
                  <div className="bg-light p-4 rounded-4 mb-4 border border-light">
                    <div className="small text-muted uppercase tracking-wider fw-bold x-small mb-2">Clinical Finding:</div>
                    <div className="fw-bold text-dark small-md">{res.result}</div>
                  </div>
                  <button className="btn btn-primary w-full py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all hover:shadow-lg">
                    <Download size={18} /> Download Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 card border-0 shadow-sm rounded-[32px]">
          <div className="bg-light p-4 rounded-circle d-inline-flex mb-4 mx-auto">
            <Activity size={48} className="text-muted opacity-20" />
          </div>
          <h4 className="serif">No results found</h4>
          <p className="text-muted">Your laboratory test results will appear here once available.</p>
        </div>
      )}
    </div>
  );
};

export default LabResults;
