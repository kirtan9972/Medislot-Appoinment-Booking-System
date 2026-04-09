import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Check, X, Calendar, Clock, User as UserIcon, Search, Trash2 } from 'lucide-react';

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await API.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await API.updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await API.deleteAppointment(id);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="badge bg-emerald-50 text-emerald-700 px-3 py-2 rounded-pill fw-bold small border border-emerald-100 shadow-sm">Approved</span>;
      case 'rejected': return <span className="badge bg-red-400 text-rose-700 px-3 py-2 rounded-pill fw-bold small border border-rose-100 shadow-sm">Rejected</span>;
      case 'cancelled': return <span className="badge bg-slate-50 text-slate-700 px-3 py-2 rounded-pill fw-bold small border border-slate-100 shadow-sm">Cancelled</span>;
      default: return <span className="badge bg-amber-50 text-amber-700 px-3 py-2 rounded-pill fw-bold small border border-amber-100 shadow-sm">Pending</span>;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const search = searchTerm.toLowerCase();
    const patientName = apt.patientId?.name?.toLowerCase() || '';
    const doctorName = apt.doctorId?.name?.toLowerCase() || '';
    return patientName.includes(search) || doctorName.includes(search);
  });

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1">Manage Appointments</h2>
          <p className="text-muted small mb-0">Review and manage patient appointment requests.</p>
        </div>
        <div className="position-relative w-100" style={{ maxWidth: '400px' }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50" size={18} />
          <input
            type="text"
            className="form-control ps-5 py-3 rounded-pill border-0 shadow-sm bg-white focus:shadow-md transition-all"
            placeholder="Search patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden rounded-[32px] bg-white">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold">Patient</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold">Doctor</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold d-none d-md-table-cell">Schedule</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold">Status</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <tr key={apt._id}>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-light p-2.5 rounded-2xl d-flex align-items-center justify-content-center border-2 border-white shadow-sm" style={{ width: '48px', height: '48px' }}>
                            <UserIcon size={20} className="text-muted opacity-50" />
                          </div>
                          <div>
                            <div className="fw-bold text-dark h6 mb-0">{apt.patientId?.name}</div>
                            <div className="small text-muted d-none d-sm-block">{apt.patientId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          {apt.doctorId?.image ? (
                            <img src={apt.doctorId.image} alt={apt.doctorId.name} className="rounded-2xl object-cover shadow-sm border-2 border-white" style={{ width: '48px', height: '48px' }} referrerPolicy="no-referrer" />
                          ) : (
                            <div className="bg-primary-subtle p-2.5 rounded-2xl d-flex align-items-center justify-content-center border-2 border-white shadow-sm" style={{ width: '48px', height: '48px' }}>
                              <UserIcon size={20} className="text-primary opacity-50" />
                            </div>
                          )}
                          <div>
                            <div className="fw-bold text-dark h6 mb-0">{apt.doctorId?.name}</div>
                            <div className="small text-primary d-none d-sm-block fw-medium">{apt.doctorId?.specialization}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 d-none d-md-table-cell">
                        <div className="small d-flex align-items-center gap-2 mb-1 fw-medium text-dark"><Calendar size={14} className="text-primary" /> {apt.date}</div>
                        <div className="small d-flex align-items-center gap-2 text-muted"><Clock size={14} /> {apt.time}</div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(apt.status)}</td>
                      <td className="px-4 py-4 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {apt.status === 'pending' ? (
                            <>
                              <button className="btn btn-emerald-600 text-white d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm hover:scale-105 transition-transform" onClick={() => handleStatusUpdate(apt._id, 'approved')}>
                                <Check size={16} /> <span className="d-none d-sm-inline small fw-bold">Approve</span>
                              </button>
                              <button className="btn btn-rose-600 text-white d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm hover:scale-105 transition-transform" onClick={() => handleStatusUpdate(apt._id, 'rejected')}>
                                <X size={16} /> <span className="d-none d-sm-inline small fw-bold">Reject</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-muted small italic fw-medium px-3">No actions</span>
                          )}
                          <button className="btn btn-light rounded-xl p-2.5 hover:bg-danger hover:text-white transition-all text-danger shadow-sm" onClick={() => handleDelete(apt._id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <div className="bg-light p-4 rounded-circle d-inline-flex mb-4">
                        <Search size={48} className="text-muted opacity-20" />
                      </div>
                      <h4 className="serif">No appointments found</h4>
                      <p className="text-muted">Try searching for a different patient or doctor.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deletingId && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3xl border-0 shadow-xl">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title serif fw-bold text-danger">Delete Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setDeletingId(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0 text-muted">Are you sure you want to delete this appointment? This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold" onClick={() => setDeletingId(null)}>Cancel</button>
                <button type="button" className="btn btn-danger text-white rounded-pill px-4 py-2 fw-bold" onClick={() => confirmDelete(deletingId!)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
