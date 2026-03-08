import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Cereal', 'Pulse', 'Oilseed', 'Vegetable', 'Fruit', 'Cash Crop', 'Spice', 'Fiber'];
const SEASONS = ['All', 'Kharif', 'Rabi', 'Zaid', 'Year-round'];

const cropEmojis = {
  Wheat: '🌾', Rice: '🌾', Cotton: '🌸', Maize: '🌽', Sugarcane: '🎋',
  Soybean: '🫘', Tomato: '🍅', Mustard: '🟡'
};
const categoryColors = {
  Cereal: 'var(--gold-dark)', Pulse: 'var(--green-mid)', Oilseed: '#f4a261',
  Vegetable: '#52b788', 'Cash Crop': '#e76f51', Fruit: '#e63946', Spice: '#8b5e3c', Fiber: '#90e0ef'
};

const CropCard = ({ crop }) => (
  <Link to={`/crops/${crop._id}`} style={{ textDecoration: 'none' }}>
    <div className="card" style={{ cursor: 'pointer', borderLeft: `4px solid ${categoryColors[crop.category] || 'var(--green-mid)'}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,71,49,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '2.5rem' }}>{cropEmojis[crop.name] || '🌱'}</div>
        <div>
          <span className={`badge ${crop.season === 'Kharif' ? 'badge-green' : crop.season === 'Rabi' ? 'badge-gold' : 'badge-blue'}`}>
            {crop.season}
          </span>
        </div>
      </div>
      <h3 style={{ marginBottom: '0.25rem', fontSize: '1.15rem' }}>{crop.name}</h3>
      {crop.localNames?.hindi && <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{crop.localNames.hindi}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <span className="badge badge-earth">{crop.category}</span>
        {crop.duration && <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>⏱️ {crop.duration}</span>}
      </div>

      {crop.soilType && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
          🪨 {crop.soilType.slice(0, 2).join(', ')}
        </p>
      )}

      {crop.marketPrice?.msp > 0 && (
        <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--green-bg)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--green-mid)', fontWeight: 600 }}>MSP</span>
          <span style={{ fontSize: '0.9rem', fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--green-dark)' }}>₹{crop.marketPrice.msp}/Qtl</span>
        </div>
      )}
    </div>
  </Link>
);

const CropLibrary = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [season, setSeason] = useState('All');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const { data } = await axios.get('/api/crops');
      setCrops(data.crops);
    } catch (err) {
      console.error('Error fetching crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = crops.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.localNames?.hindi && c.localNames.hindi.includes(search));
    const matchCategory = category === 'All' || c.category === category;
    const matchSeason = season === 'All' || c.season === season;
    return matchSearch && matchCategory && matchSeason;
  });

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>📚 Crop Library</h1>
          <p>Complete crop guides with seasonal info, soil preparation, fertilizers, pest management and more</p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          {/* Search and Filters */}
          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-mid)', fontSize: '0.9rem' }}>🔍 Search Crops</label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-control"
                  placeholder="Search by name or हिंदी नाम..."
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-mid)', fontSize: '0.9rem' }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="form-control" style={{ minWidth: '140px' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-mid)', fontSize: '0.9rem' }}>Season</label>
                <select value={season} onChange={e => setSeason(e.target.value)} className="form-control" style={{ minWidth: '120px' }}>
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Season tabs quick filter */}
          <div className="tabs">
            {SEASONS.map(s => (
              <button key={s} className={`tab ${season === s ? 'active' : ''}`} onClick={() => setSeason(s)}>{s}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
              <div className="loader" style={{ margin: '0 auto 1rem', borderTopColor: 'var(--green-mid)' }}></div>
              <p>Loading crop data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🌱</div>
              <h3>No crops found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Showing <strong>{filtered.length}</strong> crops
              </p>
              <div className="grid-3">
                {filtered.map(crop => <CropCard key={crop._id} crop={crop} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropLibrary;
