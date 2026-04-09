import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext.tsx';
import API from './services/api.ts';
import { LayoutDashboard, Stethoscope } from 'lucide-react';
import Navbar from './components/Navbar.tsx';
import Sidebar from './components/Sidebar.tsx';
import Footer from './components/Footer.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ReminderManager from './components/ReminderManager.tsx';

import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';

// Client Pages
import ClientDashboard from './pages/client/Dashboard.tsx';
import BookAppointment from './pages/client/BookAppointment.tsx';
import MyAppointments from './pages/client/MyAppointments.tsx';
import Profile from './pages/client/Profile.tsx';
import MedicalRecords from './pages/client/MedicalRecords.tsx';
import HealthTips from './pages/client/HealthTips.tsx';
import Notifications from './pages/client/Notifications.tsx';
import Support from './pages/client/Support.tsx';
import Billing from './pages/client/Billing.tsx';
import LabResults from './pages/client/LabResults.tsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.tsx';
import ManageDoctors from './pages/admin/ManageDoctors.tsx';
import ManageAppointments from './pages/admin/ManageAppointments.tsx';
import ManagePatients from './pages/admin/ManagePatients.tsx';
import ManageSpecializations from './pages/admin/ManageSpecializations.tsx';
import SystemSettings from './pages/admin/SystemSettings.tsx';
import Reports from './pages/admin/Reports.tsx';
import FeedbackInbox from './pages/admin/FeedbackInbox.tsx';
import DoctorNotifications from './pages/admin/DoctorNotifications.tsx';
import InventoryManagement from './pages/admin/InventoryManagement.tsx';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ReminderManager>
          <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <div className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Client Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute role="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/book" element={
                  <ProtectedRoute role="client">
                    <BookAppointment />
                  </ProtectedRoute>
                } />
                <Route path="/appointments" element={
                  <ProtectedRoute role="client">
                    <MyAppointments />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/records" element={
                  <ProtectedRoute role="client">
                    <MedicalRecords />
                  </ProtectedRoute>
                } />
                <Route path="/health-tips" element={
                  <ProtectedRoute role="client">
                    <HealthTips />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute role="client">
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/support" element={
                  <ProtectedRoute role="client">
                    <Support />
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute role="client">
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/lab-results" element={
                  <ProtectedRoute role="client">
                    <LabResults />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute role="admin">
                    <div className="d-flex min-vh-100 flex-column flex-md-row">
                      {/* Desktop Sidebar */}
                      <div className="col-md-3 col-xl-2 d-none d-md-block sticky-top h-screen overflow-y-auto border-end border-gray-100 bg-white">
                        <Sidebar />
                      </div>
                      
                      {/* Mobile Sidebar Toggle */}
                      <div className="d-md-none bg-white border-bottom p-3 sticky-top z-3 shadow-sm">
                        <div className="d-flex align-items-center justify-content-between">
                          <button 
                            className="btn btn-emerald-50 text-emerald-700 d-flex align-items-center gap-2 rounded-xl fw-bold shadow-none"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#adminSidebarMobile"
                          >
                            <LayoutDashboard size={20} />
                            Admin Menu
                          </button>
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <Stethoscope size={20} className="text-emerald-700" />
                          </div>
                        </div>
                      </div>

                      {/* Mobile Sidebar Offcanvas */}
                      <div className="offcanvas offcanvas-start d-md-none border-0 shadow-lg" tabIndex={-1} id="adminSidebarMobile" aria-labelledby="adminSidebarMobileLabel">
                        <div className="offcanvas-header border-bottom bg-white py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-emerald-100 p-2 rounded-xl">
                              <Stethoscope size={24} className="text-emerald-700" />
                            </div>
                            <h5 className="offcanvas-title fw-bold text-emerald-800 serif" id="adminSidebarMobileLabel">Admin Panel</h5>
                          </div>
                          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body p-0 bg-white">
                          <Sidebar onMobileItemClick={() => {
                            const offcanvasElement = document.getElementById('adminSidebarMobile');
                            if (offcanvasElement) {
                              const bsOffcanvas = (window as any).bootstrap.Offcanvas.getInstance(offcanvasElement);
                              if (bsOffcanvas) bsOffcanvas.hide();
                            }
                          }} />
                        </div>
                      </div>

                      <div className="col-md-9 col-xl-10 flex-grow-1 bg-light p-3 p-md-4 p-lg-5 overflow-x-hidden">
                        <Routes>
                          <Route index element={<AdminDashboard />} />
                          <Route path="doctors" element={<ManageDoctors />} />
                          <Route path="appointments" element={<ManageAppointments />} />
                          <Route path="patients" element={<ManagePatients />} />
                          <Route path="specializations" element={<ManageSpecializations />} />
                          <Route path="settings" element={<SystemSettings />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="feedback" element={<FeedbackInbox />} />
                          <Route path="doctor-notifications" element={<DoctorNotifications />} />
                          <Route path="inventory" element={<InventoryManagement />} />
                        </Routes>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Footer />
            <ToastContainer position="bottom-right" theme="colored" aria-label="Notifications" />
          </div>
        </ReminderManager>
      </Router>
    </AuthProvider>
  );
};

export default App;
