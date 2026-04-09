import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../services/api.ts';
import { Users, UserRound, CalendarCheck, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await API.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats');
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  const statCards = [
    { name: 'Total Patients', value: stats?.patientCount, icon: <Users size={24} />, color: 'primary' },
    { name: 'Total Doctors', value: stats?.doctorCount, icon: <UserRound size={24} />, color: 'success' },
    { name: 'Total Appointments', value: stats?.appointmentCount, icon: <CalendarCheck size={24} />, color: 'info' },
    { name: 'Pending Approvals', value: stats?.pendingAppointments, icon: <Clock size={24} />, color: 'warning' },
  ];

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1 text-dark">Admin Dashboard</h2>
          <p className="text-muted small mb-0 fw-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-muted small d-flex align-items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm border border-light">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="fw-bold text-dark uppercase tracking-wider x-small">Live System Status</span>
        </div>
      </div>

      <div className="row g-3 g-md-4">
        {statCards.map((stat, idx) => (
          <div className="col-12 col-sm-6 col-xl-3" key={idx}>
            <div className={`card border-0 shadow-sm p-4 rounded-[32px] bg-white h-100 hover:shadow-xl transition-all duration-300 border-start border-4 border-${stat.color}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1 fw-bold uppercase tracking-wider x-small">{stat.name}</p>
                  <h3 className="mb-0 fw-bold serif h2 text-dark">{stat.value}</h3>
                </div>
                <div className={`bg-${stat.color}-subtle p-3 rounded-2xl text-${stat.color} shadow-sm`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-4 mt-md-5 g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4 p-md-5 h-100 rounded-[32px] bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full -mr-32 -mt-32"></div>
            <h5 className="serif fw-bold mb-4 h4 text-dark relative z-10">System Overview</h5>
            <div className="bg-light p-4 p-md-5 rounded-[32px] text-center d-flex flex-column align-items-center justify-content-center h-100 min-vh-25 relative z-10 border border-white">
              <div className="bg-white p-4 rounded-circle shadow-md mb-4 border-4 border-primary-subtle">
                <CalendarCheck size={48} className="text-primary opacity-50" />
              </div>
              <h4 className="serif mb-3">Welcome to MediSlot Admin</h4>
              <p className="text-muted mb-0 max-w-md mx-auto leading-relaxed">
                Use the sidebar to manage doctors, appointments, and patients. 
                Monitor system performance and manage medical departments efficiently.
                Your changes are reflected in real-time across the platform.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 p-md-5 h-100 rounded-[32px] bg-white">
            <h5 className="serif fw-bold mb-4 h4 text-dark">Quick Actions</h5>
            <div className="d-grid gap-3">
              {[
                { name: 'Add New Doctor', sub: 'Register a new specialist', icon: UserRound, color: 'primary', path: '/admin/doctors' },
                { name: 'View Appointments', sub: 'Manage scheduled consultations', icon: CalendarCheck, color: 'success', path: '/admin/appointments' },
                { name: 'Manage Patients', sub: 'View and edit patient records', icon: Users, color: 'info', path: '/admin/patients' }
              ].map((action, i) => (
                <button key={i} className={`btn btn-light text-start p-3 rounded-2xl d-flex align-items-center gap-3 border-0 bg-light hover:bg-${action.color}-subtle transition-all shadow-sm group`}>
                  <div className={`bg-${action.color} text-white p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} />
                  </div>
                  <div>
                    <div className="fw-bold small text-dark">{action.name}</div>
                    <div className="text-muted x-small fw-medium">{action.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
