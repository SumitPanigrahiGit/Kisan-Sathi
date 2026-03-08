import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1a4731', color: 'rgba(255,255,255,0.8)', marginTop: 'auto' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #e9c46a, #f4a261)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌿</div>
            <div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>KisanSathi</div>
              <div style={{ fontSize: '0.6rem', color: '#b7e4c7', letterSpacing: '0.5px' }}>किसान साथी</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>Empowering Indian farmers with technology, knowledge, and community support.</p>
        </div>
        <div>
          <h4 style={{ color: '#e9c46a', fontFamily: "'Baloo 2', cursive", marginBottom: '0.75rem', fontSize: '1rem' }}>Quick Links</h4>
          {[['/', 'Home'], ['/crops', 'Crop Library'], ['/community', 'Community'], ['/mandi', 'Mandi Rates']].map(([path, label]) => (
            <Link key={path} to={path} style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem', fontSize: '0.87rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#e9c46a'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#e9c46a', fontFamily: "'Baloo 2', cursive", marginBottom: '0.75rem', fontSize: '1rem' }}>Services</h4>
          {[['/transport', 'Transport Booking'], ['/community', 'Expert Q&A'], ['/mandi', 'Price Trends'], ['/register', 'Join Community']].map(([path, label]) => (
            <Link key={path} to={path} style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem', fontSize: '0.87rem', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#e9c46a'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#e9c46a', fontFamily: "'Baloo 2', cursive", marginBottom: '0.75rem', fontSize: '1rem' }}>Helpline</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>📞 Kisan Call Center: <strong style={{ color: 'white' }}>1800-180-1551</strong></p>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>🌐 PM Kisan Portal</p>
          <p style={{ fontSize: '0.85rem' }}>📱 Available in 10 regional languages</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {['🌾', '🐄', '💧', '☀️'].map((emoji, i) => (
              <span key={i} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
        © 2024 KisanSathi. Built with ❤️ for Indian Farmers | Jai Jawan, Jai Kisan 🇮🇳
      </div>
    </div>
  </footer>
);

export default Footer;
