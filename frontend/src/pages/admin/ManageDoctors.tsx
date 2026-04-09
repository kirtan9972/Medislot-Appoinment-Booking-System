import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { UserPlus, Trash2, Edit2, X, Plus, Camera, User as UserIcon } from 'lucide-react';

const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    fees: '',
    availableSlots: '09:00 AM, 10:00 AM, 11:00 AM, 02:00 PM, 03:00 PM',
    image: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      specialization: formData.specialization,
      fees: Number(formData.fees),
      availableSlots: formData.availableSlots.split(',').map((s) => s.trim()),
      image: formData.image,
    };

    try {
      if (editingDoctor) {
        await API.updateDoctor(editingDoctor._id, payload);
        toast.success('Doctor updated');
      } else {
        await API.createDoctor(payload);
        toast.success('Doctor added');
      }
      setShowModal(false);
      resetForm();
      fetchDoctors();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await API.deleteDoctor(deletingId);
      toast.success('Doctor removed');
      fetchDoctors();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      fees: '',
      availableSlots: '09:00 AM, 10:00 AM, 11:00 AM, 02:00 PM, 03:00 PM',
      image: '',
    });
    setEditingDoctor(null);
  };

  const handleEdit = (doc: any) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      fees: doc.fees.toString(),
      availableSlots: doc.availableSlots.join(', '),
      image: doc.image || '',
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1">Manage Doctors</h2>
          <p className="text-muted small mb-0">Add, edit, or remove medical professionals from the system.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-pill shadow-lg transition-transform hover:scale-105" onClick={() => { resetForm(); setShowModal(true); }}>
          <UserPlus size={20} /> Add New Doctor
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden rounded-[32px] bg-white">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : doctors.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold">Doctor Details</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold d-none d-md-table-cell">Specialization</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold">Fees</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold d-none d-lg-table-cell">Availability</th>
                  <th className="px-4 py-3 border-0 small uppercase tracking-wider text-muted fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td className="px-4 py-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="relative">
                          {doc.image ? (
                            <img src={doc.image} alt={doc.name} className="rounded-2xl object-cover shadow-sm border-2 border-white" style={{ width: '56px', height: '56px' }} referrerPolicy="no-referrer" />
                          ) : (
                            <div className="bg-primary-subtle p-2 rounded-2xl d-flex align-items-center justify-content-center border-2 border-white shadow-sm" style={{ width: '56px', height: '56px' }}>
                              <UserIcon size={24} className="text-primary opacity-50" />
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <div className="fw-bold text-dark h6 mb-0">{doc.name}</div>
                          <div className="small text-muted d-md-none">{doc.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 d-none d-md-table-cell">
                      <span className="badge bg-emerald-50 text-emerald-700 px-3 py-2 rounded-pill fw-bold small border border-emerald-100">{doc.specialization}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="fw-bold text-primary h6 mb-0">${doc.fees}</div>
                      <div className="x-small text-muted">per visit</div>
                    </td>
                    <td className="px-4 py-4 d-none d-lg-table-cell">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-info-subtle p-1 rounded-circle text-info d-flex"><Plus size={12} /></div>
                        <small className="text-muted fw-medium">{doc.availableSlots.length} slots available</small>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-light rounded-xl p-2.5 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => handleEdit(doc)} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button className="btn btn-light rounded-xl p-2.5 hover:bg-danger hover:text-white transition-all text-danger shadow-sm" onClick={() => handleDelete(doc._id)} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="bg-light p-4 rounded-circle d-inline-flex mb-4">
              <UserIcon size={48} className="text-muted opacity-20" />
            </div>
            <h4 className="serif">No doctors found</h4>
            <p className="text-muted">Start by adding your first medical professional.</p>
          </div>
        )}
      </div>

      {/* Modal Backdrop */}
      {showModal && <div className="modal-backdrop fade show" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)' }}></div>}

      {/* Simple Modal */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-2xl rounded-[32px] overflow-hidden">
            <div className="modal-header bg-white border-bottom p-4 px-md-5">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary-subtle p-2 rounded-xl text-primary">
                  <UserPlus size={24} />
                </div>
                <h5 className="modal-title serif h4 mb-0">{editingDoctor ? 'Edit Doctor Details' : 'Register New Doctor'}</h5>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4 p-md-5">
                <div className="row g-4">
                  <div className="col-12 col-md-4 text-center">
                    <div className="position-relative d-inline-block mb-3">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="rounded-[32px] object-cover border-4 border-white shadow-xl" style={{ width: '160px', height: '160px' }} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="bg-light rounded-[32px] d-flex align-items-center justify-content-center border-4 border-white shadow-xl" style={{ width: '160px', height: '160px' }}>
                          <UserIcon size={60} className="text-muted opacity-20" />
                        </div>
                      )}
                      <label className="position-absolute bottom-0 end-0 bg-primary text-white p-3 rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white" style={{ width: '56px', height: '56px' }}>
                        <Camera size={24} />
                        <input type="file" className="d-none" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                    <div className="small text-muted fw-bold uppercase tracking-wider x-small mt-2">Profile Photo</div>
                    <div className="text-xs text-muted mt-1">JPG, PNG up to 2MB</div>
                  </div>
                  <div className="col-12 col-md-8">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted">Doctor Full Name</label>
                        <input type="text" className="form-control py-3 rounded-3 border-light bg-light focus:bg-white" placeholder="Dr. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Specialization</label>
                        <input type="text" className="form-control py-3 rounded-3 border-light bg-light focus:bg-white" placeholder="Cardiologist" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">Consultation Fees ($)</label>
                        <input type="number" className="form-control py-3 rounded-3 border-light bg-light focus:bg-white" placeholder="100" value={formData.fees} onChange={(e) => setFormData({ ...formData, fees: e.target.value })} required />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted">Available Time Slots</label>
                        <textarea className="form-control py-3 rounded-3 border-light bg-light focus:bg-white" rows={3} placeholder="09:00 AM, 10:00 AM, ..." value={formData.availableSlots} onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })} required />
                        <div className="form-text x-small text-muted mt-2">Separate slots with commas (e.g., 09:00 AM, 10:00 AM).</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0 p-4 px-md-5">
                <button type="button" className="btn btn-link text-muted text-decoration-none fw-bold small" onClick={() => setShowModal(false)}>Discard Changes</button>
                <button type="submit" className="btn btn-primary px-5 py-3 rounded-pill shadow-lg fw-bold transition-transform hover:scale-105">{editingDoctor ? 'Update Doctor' : 'Save Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-2xl rounded-[32px] overflow-hidden">
              <div className="modal-body p-4 p-md-5 text-center">
                <div className="bg-danger-subtle w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Trash2 className="text-danger" size={36} />
                </div>
                <h3 className="serif h3 mb-2">Remove Doctor?</h3>
                <p className="text-muted mb-4">This will permanently remove the doctor from the system. This action cannot be undone.</p>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button className="btn btn-light rounded-pill w-full py-3 fw-bold order-2 order-sm-1 shadow-sm" onClick={() => setDeletingId(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger rounded-pill w-full py-3 fw-bold order-1 order-sm-2 shadow-lg" onClick={confirmDelete}>
                    Yes, Remove
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

export default ManageDoctors;
