import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { CreditCard, Receipt, Download, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const Billing: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      // Simulating fetching bills
      const mockBills = [
        { _id: '1', date: '2026-03-01', description: 'General Consultation', amount: 50, status: 'paid' },
        { _id: '2', date: '2026-02-15', description: 'Blood Test (Lab)', amount: 120, status: 'paid' },
        { _id: '3', date: '2026-03-04', description: 'Dental Cleaning', amount: 80, status: 'pending' },
      ];
      setBills(mockBills);
    } catch (error) {
      toast.error('Failed to fetch billing history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5 px-3">
      <div className="mb-4 mb-md-5">
        <h2 className="serif h2 mb-1">Billing & Payments</h2>
        <p className="text-muted small mb-0">View your invoices, payment history, and pending dues.</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8 order-2 order-lg-1">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : bills.length > 0 ? (
            <div className="card border-0 shadow-sm overflow-hidden rounded-[32px]">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 border-0">Description</th>
                      <th className="py-3 border-0 d-none d-md-table-cell">Date</th>
                      <th className="py-3 border-0">Amount</th>
                      <th className="py-3 border-0">Status</th>
                      <th className="py-3 border-0 text-end px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr key={bill._id}>
                        <td className="px-4 py-3 fw-bold small-md">{bill.description}</td>
                        <td className="py-3 text-muted small d-none d-md-table-cell">{bill.date}</td>
                        <td className="py-3 fw-bold text-primary">${bill.amount}</td>
                        <td className="py-3">
                          <span className={`badge rounded-pill px-3 py-2 ${bill.status === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {bill.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-end px-4">
                          <button className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1 px-3">
                            <Download size={14} /> <span className="d-none d-sm-inline">Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 card border-0 shadow-sm rounded-[32px]">
              <div className="bg-light p-4 rounded-circle d-inline-flex mb-4 mx-auto">
                <Receipt size={48} className="text-muted opacity-20" />
              </div>
              <h4 className="serif">No billing records</h4>
              <p className="text-muted">You have no payment history at the moment.</p>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-4 order-1 order-lg-2">
          <div className="card border-0 shadow-lg p-4 p-md-5 medical-gradient text-white mb-4 rounded-[32px] overflow-hidden relative">
            <div className="relative z-10">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="bg-white/20 p-3 rounded-4 backdrop-blur-md">
                  <CreditCard size={32} />
                </div>
                <span className="badge bg-white/20 text-white backdrop-blur-md px-3 py-2 rounded-pill border border-white/20">Active Account</span>
              </div>
              <div className="mb-4">
                <div className="small opacity-75 mb-1 uppercase tracking-wider fw-bold x-small">Total Outstanding</div>
                <h1 className="serif display-5 mb-0">$80.00</h1>
              </div>
              <button className="btn btn-light w-full fw-bold py-3 rounded-pill shadow-lg transition-transform hover:scale-105">Pay Now</button>
            </div>
            {/* Abstract background shapes */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>

          <div className="card border-0 shadow-sm p-4 p-md-5 rounded-[32px] bg-white">
            <h5 className="serif h5 mb-4">Payment Methods</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center justify-content-between p-3 border rounded-4 bg-light transition-all hover:bg-white hover:shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white p-2 rounded-3 shadow-sm"><CreditCard size={20} className="text-primary" /></div>
                  <div>
                    <div className="small fw-bold">Visa **** 4242</div>
                    <div className="text-muted x-small">Expires 12/28</div>
                  </div>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" checked readOnly />
                </div>
              </div>
              <button className="btn btn-outline-primary btn-sm w-full py-3 rounded-pill border-2 fw-bold mt-2">+ Add New Method</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
