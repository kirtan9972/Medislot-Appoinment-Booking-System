import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-top mt-auto pt-5 pb-4 px-3">
      <div className="container">
        <div className="row g-4 g-lg-5">
          {/* Brand & Description */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-4">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-sm">
                <Heart className="text-white" size={20} />
              </div>
              <span className="serif h4 mb-0 text-dark tracking-tight">MediSlot</span>
            </Link>
            <p className="text-muted mb-4 small-md leading-relaxed">
              Your trusted partner for seamless hospital appointment bookings. 
              Connecting patients with top-tier healthcare professionals effortlessly.
            </p>
            <div className="d-flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="bg-light p-2 rounded-circle text-muted hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="serif fw-bold text-dark mb-4">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Book Appointment', path: '/book' },
                { name: 'My Appointments', path: '/appointments' },
                { name: 'Profile Settings', path: '/profile' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-muted small text-decoration-none hover:text-emerald-600 hover:translate-x-1 d-inline-block transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="serif fw-bold text-dark mb-4">Specialties</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology'].map((spec, i) => (
                <li key={i}>
                  <span className="text-muted small hover:text-emerald-600 transition-all cursor-default">{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-6 col-lg-4">
            <h6 className="serif fw-bold text-dark mb-4">Contact Us</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li className="d-flex align-items-start gap-3 text-muted">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><MapPin size={18} /></div>
                <span className="small">123 Medical Plaza, Healthcare City, HC 45678</span>
              </li>
              <li className="d-flex align-items-center gap-3 text-muted">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Phone size={18} /></div>
                <span className="small">+1 (555) 123-4567</span>
              </li>
              <li className="d-flex align-items-center gap-3 text-muted">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Mail size={18} /></div>
                <span className="small">support@medislot.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-5 opacity-5" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          <p className="text-muted x-small mb-0 fw-medium">
            &copy; {currentYear} MediSlot Healthcare. All rights reserved.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text, i) => (
              <Link key={i} to="#" className="text-muted x-small text-decoration-none hover:text-emerald-600 transition-all fw-medium">
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
