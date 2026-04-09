import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Mail, Calendar, User as UserIcon, Trash2, Edit2 } from 'lucide-react';

const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await API.getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients');
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await API.deletePatient(id);
      toast.success('Patient deleted successfully');
      fetchPatients();
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const handleEdit = (patient: any) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.updatePatient(editingPatient._id, formData);
      toast.success('Patient updated successfully');
      fetchPatients();
      setShowModal(false);
      setEditingPatient(null);
    } catch (error) {
      toast.error('Failed to update patient');
    }
  };

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1">Manage Patients</h2>
          <p className="text-muted small mb-0">View and manage registered patients in your healthcare system.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-pill fw-bold small border border-emerald-100 shadow-sm">
          Total Patients: {patients.length}
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
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold">Patient Details</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold d-none d-sm-table-cell">Contact Info</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold d-none d-md-table-cell">Registration Date</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary-subtle p-2.5 rounded-2xl d-flex align-items-center justify-content-center border-2 border-white shadow-sm" style={{ width: '48px', height: '48px' }}>
                            <UserIcon size={20} className="text-primary opacity-75" />
                          </div>
                          <div>
                            <div className="fw-bold text-dark h6 mb-0">{p.name}</div>
                            <div className="small text-muted d-sm-none">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 d-none d-sm-table-cell">
                        <div className="d-flex align-items-center gap-2 text-muted small fw-medium">
                          <div className="bg-light p-1.5 rounded-lg"><Mail size={14} /></div>
                          {p.email}
                        </div>
                      </td>
                      <td className="px-4 py-4 d-none d-md-table-cell">
                        <div className="d-flex align-items-center gap-2 text-muted small fw-medium">
                          <div className="bg-light p-1.5 rounded-lg"><Calendar size={14} /></div>
                          {p.joined}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-light rounded-xl p-2.5 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => handleEdit(p)} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn btn-light rounded-xl p-2.5 hover:bg-danger hover:text-white transition-all text-danger shadow-sm" onClick={() => handleDelete(p._id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5">
                      <div className="bg-light p-4 rounded-circle d-inline-flex mb-4">
                        <UserIcon size={48} className="text-muted opacity-20" />
                      </div>
                      <h4 className="serif">No patients found</h4>
                      <p className="text-muted">There are currently no registered patients in the system.</p>
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
                <h5 className="modal-title serif fw-bold text-danger">Delete Patient</h5>
                <button type="button" className="btn-close" onClick={() => setDeletingId(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0 text-muted">Are you sure you want to delete this patient? This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold" onClick={() => setDeletingId(null)}>Cancel</button>
                <button type="button" className="btn btn-danger text-white rounded-pill px-4 py-2 fw-bold" onClick={() => confirmDelete(deletingId!)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3xl border-0 shadow-xl">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title serif fw-bold text-primary">Edit Patient</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setEditingPatient(null); }}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input
                      type="text"
                      className="form-control rounded-2xl"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control rounded-2xl"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold" onClick={() => { setShowModal(false); setEditingPatient(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary text-white rounded-pill px-4 py-2 fw-bold">Update Patient</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
