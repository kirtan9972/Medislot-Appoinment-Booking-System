import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Plus, Trash2, Edit2, X, Tag, Users } from 'lucide-react';

interface Specialization {
  _id: string;
  name: string;
  description: string;
}

const ManageSpecializations: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/specializations');
      setSpecializations(Array.isArray(data) ? data : []);
      console.log('Specializations loaded:', data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast.error('Failed to fetch specializations');
      setSpecializations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }
    try {
      if (editingId) {
        const { data } = await API.put(`/admin/specializations/${editingId}`, formData);
        setSpecializations(prev => prev.map(s => s._id === editingId ? data : s));
        toast.success('Specialization updated successfully');
      } else {
        const { data } = await API.post('/admin/specializations', formData);
        setSpecializations(prev => [...prev, data]);
        toast.success('Department added successfully');
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingId(null);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (spec: Specialization) => {
    setFormData({ name: spec.name, description: spec.description });
    setEditingId(spec._id);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await API.delete(`/admin/specializations/${itemToDelete}`);
      setSpecializations(prev => prev.filter(s => s._id !== itemToDelete));
      toast.success('Department deleted successfully');
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error(error.response?.data?.message || 'Delete failed');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1">Medical Departments</h2>
          <p className="text-muted small mb-0">Manage hospital specializations and departments.</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-pill shadow-lg transition-transform hover:scale-105" 
          onClick={handleAddNew}
        >
          <Plus size={20} /> Add New Department
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : specializations.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <p className="mb-0">No departments found. Click "Add New Department" to create one.</p>
        </div>
      ) : (
        <div className="row g-4">
          {specializations.map((spec) => (
            <div className="col-12 col-md-6 col-xl-4" key={spec._id}>
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="bg-primary-subtle p-3 rounded-2xl text-primary shadow-sm">
                    <Tag size={24} />
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-light rounded-xl p-2.5 hover:bg-primary hover:text-white transition-all shadow-sm" 
                      onClick={() => handleEdit(spec)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="btn btn-light rounded-xl p-2.5 hover:bg-danger hover:text-white transition-all text-danger shadow-sm" 
                      onClick={() => confirmDelete(spec._id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h5 className="card-title font-weight-bold mb-2">{spec.name}</h5>
                <p className="card-text text-muted small mb-0">{spec.description || 'No description provided'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div 
          className="modal d-flex align-items-center justify-content-center" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="modal-content rounded-3xl shadow-xl" 
            style={{ maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header border-bottom-0 d-flex justify-content-between align-items-center pb-0">
              <h5 className="modal-title">{editingId ? 'Edit Department' : 'Add New Department'}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-600">Department Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control rounded-xl border-light shadow-sm"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Cardiology, Neurology"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-600">Description</label>
                  <textarea
                    className="form-control rounded-xl border-light shadow-sm"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Brief description of the department"
                  ></textarea>
                </div>
                <div className="modal-footer border-top-0 d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-secondary rounded-pill" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill">
                    {editingId ? 'Update' : 'Add'} Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="modal d-flex align-items-center justify-content-center" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="modal-content rounded-3xl shadow-xl" 
            style={{ maxWidth: '400px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header border-bottom-0 d-flex justify-content-between align-items-center pb-0">
              <h5 className="modal-title">Confirm Delete</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this department? This action cannot be undone.</p>
            </div>
            <div className="modal-footer border-top-0 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary rounded-pill" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger rounded-pill" 
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ManageSpecializations;
