import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Stethoscope, LogOut, User as UserIcon, Bell, Menu, X, Home, Calendar, FileText, Settings, HelpCircle, CreditCard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const linkStyle = { textDecoration: 'none' } as const;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const clientNavLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/book', label: 'Book Appointment', icon: Calendar },
    { path: '/appointments', label: 'My Appointments', icon: Calendar },
    { path: '/records', label: 'Medical Records', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" style={linkStyle} className="flex items-center gap-2 sm:gap-3 group !no-underline">
            <div className="relative">
              {/* Glow effect ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-125" />
              {/* Main icon container */}
              <div className="relative bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 p-2 sm:p-3 rounded-2xl shadow-2xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 border-2 border-emerald-200 group-hover:border-emerald-100">
                <Stethoscope size={28} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-emerald-700 hidden sm:inline-block font-serif tracking-wider drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
              MediSlot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {user ? (
              <>
                {user.role === 'client' && (
                  <div className="flex items-center gap-1 lg:gap-2">
                    {clientNavLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        style={linkStyle}
                        className={`px-3 lg:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 !no-underline border ${
                          isActive(link.path)
                            ? 'bg-emerald-500 text-white shadow-lg border-emerald-600 scale-105'
                            : 'text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 border-transparent hover:shadow-md hover:scale-105'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    style={linkStyle}
                    className="px-4 py-2 rounded-lg font-medium text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 !no-underline shadow-md hover:shadow-lg border border-emerald-600 hover:scale-105"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : null}
          </div>

          {/* Right Side Icons and Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            {user && (
              <Link
                to="/notifications"
                style={linkStyle}
                className={`p-2.5 rounded-lg transition-all duration-300 !no-underline border ${
                  isActive('/notifications')
                    ? 'bg-emerald-500 text-white shadow-lg border-emerald-600 scale-110'
                    : 'text-emerald-600 hover:bg-emerald-50 border-transparent hover:shadow-md hover:scale-110 hover:text-emerald-700'
                }`}
              >
                <Bell size={20} />
              </Link>
            )}

            {/* User Dropdown or Auth Links */}
            {user ? (
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      style={linkStyle}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 transition-all duration-200 !no-underline rounded-lg border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:shadow-md"
                    >
                      <UserIcon size={16} /> Profile Settings
                    </Link>
                    {user.role !== 'admin' && (
                      <>
                        <Link
                          to="/support"
                          style={linkStyle}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 !no-underline rounded-lg border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:shadow-md"
                        >
                          <HelpCircle size={16} /> Help & Support
                        </Link>
                        <Link
                          to="/billing"
                          style={linkStyle}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 !no-underline rounded-lg border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:shadow-md"
                        >
                          <CreditCard size={16} /> Billing
                        </Link>
                      </>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  style={linkStyle}
                  className="px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 rounded-lg hover:text-emerald-800 transition-all duration-300 !no-underline border-2 border-emerald-700 hover:shadow-md hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={linkStyle}
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl border border-emerald-700 hover:scale-105 !no-underline"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setUserDropdownOpen(false);
              }}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top">
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  {/* Mobile User Info */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-lg p-3 border border-emerald-100 mb-4">
                    <p className="font-semibold text-emerald-900 text-sm">{user.name}</p>
                    <p className="text-xs text-emerald-700 capitalize">{user.role}</p>
                  </div>

                  {user.role === 'client' && (
                    <>
                      {clientNavLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            style={linkStyle}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 !no-underline border ${
                              isActive(link.path)
                                ? 'bg-emerald-500 text-white shadow-lg border-emerald-600'
                                : 'text-emerald-700 hover:bg-emerald-50 border-transparent hover:shadow-md hover:border-emerald-300'
                            }`}
                          >
                            <Icon size={18} />
                            {link.label}
                          </Link>
                        );
                      })}
                    </>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      style={linkStyle}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 !no-underline shadow-md hover:shadow-lg border border-emerald-600"
                    >
                      <Settings size={18} />
                      Admin Panel
                    </Link>
                  )}

                  <hr className="my-3 border-gray-200" />

                  <Link
                    to="/profile"
                    style={linkStyle}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-all duration-300 !no-underline border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:shadow-md"
                  >
                    <UserIcon size={18} />
                    Profile Settings
                  </Link>
                  {user.role !== 'admin' && (
                    <>
                      <Link
                        to="/support"
                        style={linkStyle}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-all duration-300 !no-underline border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:shadow-md"
                      >
                        <HelpCircle size={18} />
                        Help & Support
                      </Link>
                      <Link
                        to="/billing"
                        style={linkStyle}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-all duration-300 !no-underline border-l-4 border-l-emerald-500 hover:border-l-emerald-600 hover:shadow-md"
                      >
                        <CreditCard size={18} />
                        Billing
                      </Link>
                    </>
                  )}

                  <hr className="my-3 border-gray-200" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={linkStyle}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all duration-300 !no-underline border-2 border-emerald-700 hover:shadow-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    style={linkStyle}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg !no-underline border border-emerald-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
