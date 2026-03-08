import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { path: '/crops', label: '🌾 Crops' },
    { path: '/community', label: '💬 Community' },
    { path: '/mandi', label: '📊 Mandi' },
    { path: '/transport', label: '🚛 Transport' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      background: scrolled ? '#1a4731' : '#1a4731',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 10px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #e9c46a, #f4a261)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0
            }}>🌿</div>
            <div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.25rem', color: 'white', lineHeight: 1 }}>KisanSathi</div>
              <div style={{ fontSize: '0.65rem', color: '#b7e4c7', lineHeight: 1, letterSpacing: '0.5px' }}>किसान साथी</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: isActive(link.path) ? '#e9c46a' : 'rgba(255,255,255,0.85)',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                background: isActive(link.path) ? 'rgba(233,196,106,0.15)' : 'transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { if (!isActive(link.path)) { e.target.style.color = '#e9c46a'; e.target.style.background = 'rgba(255,255,255,0.1)'; } }}
              onMouseLeave={e => { if (!isActive(link.path)) { e.target.style.color = 'rgba(255,255,255,0.85)'; e.target.style.background = 'transparent'; } }}
              >{link.label}</Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>
                  <span style={{ width: 28, height: 28, background: '#e9c46a', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1a4731', fontSize: '0.8rem', fontWeight: 700 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} style={{
                  padding: '0.4rem 1rem',
                  background: 'rgba(231,111,81,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" style={{
                  padding: '0.45rem 1.1rem',
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}>Login</Link>
                <Link to="/register" style={{
                  padding: '0.45rem 1.1rem',
                  background: '#e9c46a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#1a4731',
                  textDecoration: 'none',
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-only"
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', padding: '0.25rem' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#1a4731',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '1rem 1.5rem'
        }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{
              display: 'block',
              padding: '0.75rem 0',
              color: isActive(link.path) ? '#e9c46a' : 'rgba(255,255,255,0.85)',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              textDecoration: 'none'
            }}>{link.label}</Link>
          ))}
          <div style={{ paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {user ? (
              <>
                <Link to="/profile" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 600, textDecoration: 'none' }}>Profile</Link>
                <button onClick={handleLogout} style={{ flex: 1, padding: '0.6rem', background: '#e76f51', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', background: '#e9c46a', borderRadius: '8px', color: '#1a4731', fontFamily: "'Baloo 2', cursive", fontWeight: 700, textDecoration: 'none' }}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .desktop-nav { display: none !important; } }
        @media (min-width: 901px) { .mobile-only { display: none !important; } }
      `}</style>
    </nav>
  );
};

export default Navbar;
