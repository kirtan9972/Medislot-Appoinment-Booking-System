import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Settings, Save, Globe, Mail, Phone, MapPin, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const defaultSettings = {
    hospitalName: "MediSlot Hospital",
    contactEmail: "contact@medislot.com",
    contactPhone: "+1 555-123-4567",
    address: "123 Main St, Your City",
    maintenanceMode: false,
    allowNewRegistrations: true,
  };

  const [settings, setSettings] = useState<any>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/admin/settings');
      setSettings(data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex align-items-center gap-3 mb-4 mb-md-5">
        <div className="bg-primary p-3 rounded-2xl text-white shadow-md">
          <Settings size={28} />
        </div>
        <div>
          <h2 className="serif h2 mb-1 text-dark">System Settings</h2>
          <p className="text-muted small mb-0 fw-medium">Configure global application parameters and security.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm p-4 p-md-5 mb-4 rounded-[32px] bg-white">
              <h5 className="serif fw-bold mb-4 d-flex align-items-center gap-2 h4 text-dark">
                <Globe size={24} className="text-primary" /> General Information
              </h5>
              <div className="row g-3 g-md-4">
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted uppercase tracking-wider x-small">Hospital Name</label>
                  <input 
                    type="text" 
                    className="form-control py-3 rounded-2xl border-light bg-light focus:bg-white focus:border-primary shadow-none transition-all" 
                    value={settings.hospitalName}
                    onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-muted uppercase tracking-wider x-small">Contact Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light border-end-0 rounded-start-2xl px-3 text-muted"><Mail size={18} /></span>
                    <input 
                      type="email" 
                      className="form-control border-light border-start-0 ps-0 py-3 rounded-end-2xl bg-light focus:bg-white focus:border-primary shadow-none transition-all" 
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-muted uppercase tracking-wider x-small">Contact Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light border-end-0 rounded-start-2xl px-3 text-muted"><Phone size={18} /></span>
                    <input 
                      type="text" 
                      className="form-control border-light border-start-0 ps-0 py-3 rounded-end-2xl bg-light focus:bg-white focus:border-primary shadow-none transition-all" 
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted uppercase tracking-wider x-small">Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light border-end-0 rounded-start-2xl px-3 text-muted align-items-start pt-3"><MapPin size={18} /></span>
                    <textarea 
                      className="form-control border-light border-start-0 ps-0 py-3 rounded-end-2xl bg-light focus:bg-white focus:border-primary shadow-none transition-all" 
                      rows={3}
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-[32px] bg-white">
              <h5 className="serif fw-bold mb-4 d-flex align-items-center gap-2 h4 text-dark">
                <Shield size={24} className="text-primary" /> Security & Access
              </h5>
              <div className="d-flex flex-column gap-4">
                {[
                  { 
                    title: 'Maintenance Mode', 
                    desc: 'Temporarily disable the application for maintenance.', 
                    key: 'maintenanceMode' 
                  },
                  { 
                    title: 'Allow New Registrations', 
                    desc: 'Enable or disable new patient account creation.', 
                    key: 'allowNewRegistrations' 
                  }
                ].map((item, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center p-3 rounded-2xl bg-light border border-white hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <div className="fw-bold text-dark">{item.title}</div>
                      <div className="text-muted small">{item.desc}</div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-link p-0 border-0 shadow-none"
                      onClick={() => setSettings({...settings, [item.key]: !settings[item.key]})}
                    >
                      {settings[item.key] ? (
                        <ToggleRight size={48} className="text-primary" />
                      ) : (
                        <ToggleLeft size={48} className="text-muted opacity-50" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-lg p-4 p-md-5 rounded-[32px] bg-white sticky-top" style={{ top: '2rem' }}>
              <h5 className="serif fw-bold mb-4 h4 text-dark">Actions</h5>
              <div className="bg-primary-subtle p-4 rounded-2xl mb-4 border border-primary-subtle">
                <p className="text-primary small mb-0 fw-medium leading-relaxed">
                  Changes made here will affect the entire system immediately. Please review all fields before saving.
                </p>
              </div>
              <div className="d-grid gap-3">
                <button type="submit" className="btn btn-primary w-full py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-lg transition-transform hover:scale-105" disabled={saving}>
                  <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
                </button>
                <button type="button" className="btn btn-outline-secondary w-full py-3 rounded-pill border-2 fw-bold" onClick={fetchSettings}>
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
