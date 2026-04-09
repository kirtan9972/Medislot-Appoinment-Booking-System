import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, CalendarCheck, Settings, Tag, BarChart3, MessageSquare, Bell, Package, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface SidebarProps {
  onMobileItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMobileItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onMobileItemClick) onMobileItemClick();
  };

  const handleItemClick = () => {
    if (onMobileItemClick) onMobileItemClick();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Doctors', path: '/admin/doctors', icon: <UserRound size={20} /> },
    { name: 'Manage Appointments', path: '/admin/appointments', icon: <CalendarCheck size={20} /> },
    { name: 'Manage Patients', path: '/admin/patients', icon: <Users size={20} /> },
    { name: 'Specializations', path: '/admin/specializations', icon: <Tag size={20} /> },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: <BarChart3 size={20} /> },
    { name: 'Feedback Inbox', path: '/admin/feedback', icon: <MessageSquare size={20} /> },
    { name: 'Doctor Alerts', path: '/admin/doctor-notifications', icon: <Bell size={20} /> },
    { name: 'Inventory Management', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Admin Profile', path: '/profile', icon: <Users size={20} /> },
    { name: 'System Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar p-3 d-flex flex-column h-100 border-end border-gray-100 bg-white shadow-sm overflow-y-auto custom-scrollbar">
      <div className="mb-4 px-3 d-none d-md-block">
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-sm">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <h5 className="serif fw-bold text-emerald-900 mb-0">MediSlot</h5>
        </div>
        <h6 className="text-muted small uppercase tracking-widest fw-bold x-small">Admin Menu</h6>
      </div>
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              onClick={handleItemClick}
              className={`nav-link d-flex align-items-center gap-3 rounded-2xl py-3 px-4 transition-all duration-300 ${path === item.path ? 'bg-emerald-700 text-white shadow-lg scale-[1.02]' : 'text-dark hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'}`}
            >
              <div className={`${path === item.path ? 'text-white' : 'text-emerald-600'} transition-colors`}>
                {item.icon}
              </div>
              <span className="fw-bold small">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto pt-4 border-top border-gray-100">
        <div className="bg-light p-3 rounded-2xl mb-3 d-none d-md-block">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Users size={18} className="text-emerald-600" />
            </div>
            <div>
              <div className="fw-bold small text-dark">{user?.name || 'Admin User'}</div>
              <div className="text-muted x-small fw-medium">{user?.email || 'System Manager'}</div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn btn-link w-full text-start d-flex align-items-center gap-3 text-danger text-decoration-none rounded-2xl py-3 px-4 hover:bg-red-50 transition-all hover:translate-x-1 group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="fw-bold small">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
