import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cropEmojis = { 'Wheat': '🌾', 'Rice': '🌾', 'Cotton': '🌸', 'Maize': '🌽', 'Sugarcane': '🌿', 'Soybean': '🫘', 'Tomato': '🍅', 'Mustard': '🟡' };

const FeatureCard = ({ icon, title, desc, link, color }) => (
  <Link to={link} style={{ textDecoration: 'none' }}>
    <div className="card" style={{ cursor: 'pointer', borderTop: `4px solid ${color}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,71,49,0.18)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
      <div style={{ marginTop: '1rem', color: color, fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem' }}>Explore →</div>
    </div>
  </Link>
);

const StatCard = ({ value, label, icon }) => (
  <div style={{ textAlign: 'center', padding: '1.5rem' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{icon}</div>
    <div style={{ fontSize: '2.2rem', fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>{value}</div>
    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.87rem', marginTop: '0.25rem' }}>{label}</div>
  </div>
);

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 50%, #1a4731 100%)',
        color: 'white',
        padding: '5rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 20% 50%, rgba(82,183,136,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(233,196,106,0.1) 0%, transparent 40%)`, pointerEvents: 'none' }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,196,106,0.2)', border: '1px solid rgba(233,196,106,0.4)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#e9c46a' }}>
                🇮🇳 भारत का किसान पोर्टल
              </div>
              <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                Smart Farming for<br />
                <span style={{ color: '#e9c46a' }}>Every Indian Farmer</span>
              </h1>
              <p style={{ color: '#b7e4c7', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '500px' }}>
                Your complete digital farming companion — crop knowledge, live mandi prices, community support, and logistics, all in one place.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/crops" className="btn btn-gold btn-lg">🌾 Explore Crops</Link>
                {!user && <Link to="/register" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>Join Free</Link>}
                {user && <Link to="/community" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>Ask Community</Link>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[['🌾', 'Wheat', '#e9c46a'], ['🌽', 'Maize', '#52b788'], ['🍅', 'Tomato', '#e76f51'], ['🌸', 'Cotton', '#90e0ef']].map(([emoji, name, color]) => (
                <Link key={name} to="/crops" style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  border: `1px solid rgba(255,255,255,0.12)`,
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{emoji}</div>
                  <div style={{ color: color, fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem' }}>{name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '50px', background: '#f8fdf9', clipPath: 'ellipse(55% 100% at 50% 100%)' }}></div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#1a4731', padding: '0.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <StatCard value="8+" label="Crops Covered" icon="🌱" />
          <StatCard value="500+" label="Mandi Markets" icon="🏪" />
          <StatCard value="10" label="Regional Languages" icon="🗣️" />
          <StatCard value="24/7" label="Expert Support" icon="📞" />
        </div>
      </div>

      {/* Features section */}
      <div className="page-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Everything a Farmer Needs</h2>
            <p className="section-subtitle">One platform — crop knowledge, market prices, expert advice, and logistics support</p>
          </div>
          <div className="grid-2">
            <FeatureCard icon="📚" title="Crop Library" desc="Detailed guides on seasonality, soil prep, irrigation, fertilizer schedules, pest management, and harvesting for 50+ crops." link="/crops" color="var(--green-mid)" />
            <FeatureCard icon="💬" title="Community Q&A" desc="Ask questions in your local language, get answers from fellow farmers and certified agricultural experts." link="/community" color="var(--sky)" />
            <FeatureCard icon="📊" title="Live Mandi Rates" desc="Real-time crop prices from mandis across India, with market trends, top gainers and losers updated daily." link="/mandi" color="var(--gold-dark)" />
            <FeatureCard icon="🚛" title="Transport Booking" desc="Connect with logistics providers for crop transportation from farm to mandi or storage. Easy pickup request flow." link="/transport" color="var(--orange)" />
          </div>
        </div>
      </div>

      {/* Crop quick access */}
      <div style={{ background: 'var(--green-bg)', padding: '3rem 1.5rem' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Popular Crops</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            {['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane', 'Tomato', 'Mustard', 'Soybean'].map(crop => (
              <Link key={crop} to="/crops" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'white', padding: '0.6rem 1.2rem',
                borderRadius: '100px',
                fontFamily: "'Baloo 2', cursive", fontWeight: 600,
                color: 'var(--green-dark)',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
              >
                <span>{cropEmojis[crop] || '🌱'}</span> {crop}
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/crops" className="btn btn-primary">View All Crops →</Link>
          </div>
        </div>
      </div>

      {/* CTA section */}
      {!user && (
        <div style={{ background: 'linear-gradient(135deg, var(--green-dark), #1b4332)', padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Join Lakhs of Farmers on KisanSathi</h2>
            <p style={{ color: '#b7e4c7', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Free registration. Access all features. Get expert advice in your language.
            </p>
            <Link to="/register" className="btn btn-gold btn-lg">🌾 Register Free Today</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
