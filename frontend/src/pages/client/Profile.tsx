import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { User as UserIcon, Mail, Lock, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', formData);
      login(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mt-md-5 pb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 p-md-5 border-0 shadow-sm rounded-[24px] rounded-md-[32px]">
            <div className="text-center mb-4 mb-md-5">
              <div className="bg-emerald-50 w-16 h-16 w-md-20 h-md-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserIcon className="text-emerald-600" size={32} />
              </div>
              <h1 className="serif h3 h2-md mb-1">My Profile</h1>
              <p className="text-muted small">Manage your personal information and security settings.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 mb-md-4">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted mb-2 d-flex align-items-center gap-2">
                  <UserIcon size={14} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-control py-2 py-md-3 rounded-xl rounded-md-2xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4 mb-md-5">
                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted mb-2 d-flex align-items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  className="form-control py-2 py-md-3 rounded-xl rounded-md-2xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl rounded-md-3xl mb-4 mb-md-5">
                <h4 className="serif h5 mb-3 d-flex align-items-center gap-2">
                  <Lock size={18} className="text-emerald-600" /> Change Password
                </h4>
                <p className="text-muted small mb-4">Leave password fields blank if you don't want to change it.</p>
                
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase tracking-wider text-muted mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control py-2 py-md-3 rounded-xl rounded-md-2xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-white"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="mb-0">
                  <label className="form-label small fw-bold text-uppercase tracking-wider text-muted mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control py-2 py-md-3 rounded-xl rounded-md-2xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-white"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-2 py-md-3 rounded-full fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg" disabled={loading}>
                {loading ? (
                  <><div className="spinner-border spinner-border-sm"></div> Updating...</>
                ) : (
                  <><Save size={18} /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
