import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TABS = ['Overview', 'Fertilizer', 'Pests & Diseases', 'Harvesting', 'Tips'];

const InfoRow = ({ label, value }) => value ? (
  <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0.65rem 0' }}>
    <span style={{ minWidth: '140px', fontWeight: 600, color: 'var(--text-mid)', fontSize: '0.9rem' }}>{label}</span>
    <span style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{value}</span>
  </div>
) : null;

const CropDetail = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const { data } = await axios.get(`/api/crops/${id}`);
        setCrop(data.crop);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loader" style={{ borderTopColor: 'var(--green-mid)' }}></div>
    </div>
  );

  if (!crop) return (
    <div className="page-section container empty-state">
      <div className="icon">😞</div>
      <h3>Crop not found</h3>
      <Link to="/crops" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Crops</Link>
    </div>
  );

  const cropEmoji = { Wheat: '🌾', Rice: '🌾', Cotton: '🌸', Maize: '🌽', Sugarcane: '🎋', Soybean: '🫘', Tomato: '🍅', Mustard: '🟡' };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)', padding: '2.5rem 1.5rem 3rem', color: 'white' }}>
        <div className="container">
          <Link to="/crops" style={{ color: '#b7e4c7', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            ← Back to Crop Library
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '5rem', lineHeight: 1 }}>{cropEmoji[crop.name] || '🌱'}</div>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-green">{crop.category}</span>
                <span className="badge badge-gold">{crop.season}</span>
                {crop.duration && <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>⏱️ {crop.duration}</span>}
              </div>
              <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.25rem' }}>{crop.name}</h1>
              {crop.localNames && (
                <p style={{ color: '#b7e4c7', fontSize: '1rem' }}>
                  {[crop.localNames.hindi, crop.localNames.marathi, crop.localNames.telugu, crop.localNames.tamil].filter(Boolean).join(' | ')}
                </p>
              )}
              {crop.marketPrice?.msp > 0 && (
                <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,196,106,0.2)', border: '1px solid rgba(233,196,106,0.4)', borderRadius: '8px', padding: '0.4rem 1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#e9c46a' }}>MSP:</span>
                  <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#e9c46a', fontSize: '1.2rem' }}>₹{crop.marketPrice.msp} / Quintal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          {/* Tabs */}
          <div className="tabs">
            {TABS.map(t => (
              <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'Overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>🪨 Soil Requirements</h3>
                {crop.soilType && <InfoRow label="Soil Type" value={crop.soilType.join(', ')} />}
                {crop.soilPH && <InfoRow label="Soil pH" value={`${crop.soilPH.min} - ${crop.soilPH.max}`} />}
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>🌤️ Climate Requirements</h3>
                {crop.climate && (
                  <>
                    <InfoRow label="Temperature" value={crop.climate.temperature} />
                    <InfoRow label="Rainfall" value={crop.climate.rainfall} />
                    <InfoRow label="Humidity" value={crop.climate.humidity} />
                  </>
                )}
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>💧 Irrigation</h3>
                {crop.irrigation && (
                  <>
                    <InfoRow label="Method" value={crop.irrigation.method?.join(', ')} />
                    <InfoRow label="Frequency" value={crop.irrigation.frequency} />
                    <InfoRow label="Water Need" value={crop.irrigation.waterRequirement} />
                  </>
                )}
              </div>
              {crop.states?.length > 0 && (
                <div className="card">
                  <h3 style={{ marginBottom: '1rem' }}>🗺️ Major Growing States</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {crop.states.map(s => (
                      <span key={s} className="badge badge-green">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fertilizer Tab */}
          {activeTab === 'Fertilizer' && crop.fertilizer && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>🌿 Fertilizer Guide</h3>
                <InfoRow label="Basal Dose" value={crop.fertilizer.basal} />
                {crop.fertilizer.organic && <InfoRow label="Organic" value={crop.fertilizer.organic} />}
                {crop.fertilizer.topDressing?.map((td, i) => (
                  <InfoRow key={i} label={`Top Dressing ${i + 1}`} value={td} />
                ))}
              </div>
              {crop.fertilizer.schedule?.length > 0 && (
                <div className="card">
                  <h3 style={{ marginBottom: '1rem' }}>📅 Fertilizer Schedule</h3>
                  {crop.fertilizer.schedule.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: i % 2 === 0 ? 'var(--green-bg)' : 'white', borderRadius: '8px', marginBottom: '0.5rem' }}>
                      <div style={{ width: 28, height: 28, background: 'var(--green-mid)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--green-dark)', fontSize: '0.9rem' }}>{s.stage}</div>
                        <div style={{ color: 'var(--text-mid)', fontSize: '0.85rem' }}>{s.fertilizer} — {s.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pests & Diseases Tab */}
          {activeTab === 'Pests & Diseases' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {crop.pests?.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#e76f51' }}>🐛 Pests</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                    {crop.pests.map((p, i) => (
                      <div key={i} className="card" style={{ borderTop: '3px solid #e76f51' }}>
                        <h4 style={{ marginBottom: '0.75rem', color: '#e76f51' }}>🐞 {p.name}</h4>
                        <InfoRow label="Symptoms" value={p.symptoms} />
                        <InfoRow label="Control" value={p.control} />
                        {p.pesticide && <InfoRow label="Pesticide" value={p.pesticide} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {crop.diseases?.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#e63946' }}>🦠 Diseases</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                    {crop.diseases.map((d, i) => (
                      <div key={i} className="card" style={{ borderTop: '3px solid #e63946' }}>
                        <h4 style={{ marginBottom: '0.75rem', color: '#e63946' }}>🔬 {d.name}</h4>
                        <InfoRow label="Symptoms" value={d.symptoms} />
                        <InfoRow label="Control" value={d.control} />
                        {d.fungicide && <InfoRow label="Fungicide" value={d.fungicide} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Harvesting Tab */}
          {activeTab === 'Harvesting' && crop.harvesting && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ borderTop: '4px solid var(--gold-dark)' }}>
                <h3 style={{ marginBottom: '1rem' }}>🚜 Harvesting Info</h3>
                <InfoRow label="Indicators" value={crop.harvesting.indicators} />
                <InfoRow label="Method" value={crop.harvesting.method} />
                <InfoRow label="Expected Yield" value={crop.harvesting.yield} />
              </div>
              {crop.marketPrice?.msp > 0 && (
                <div className="card" style={{ borderTop: '4px solid var(--green-mid)' }}>
                  <h3 style={{ marginBottom: '1rem' }}>💰 Market Info</h3>
                  <InfoRow label="MSP 2024-25" value={`₹${crop.marketPrice.msp} per ${crop.marketPrice.unit}`} />
                </div>
              )}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'Tips' && crop.tips?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>💡 Expert Tips for {crop.name} Farming</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {crop.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--green-bg)', borderRadius: '10px' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--green-mid)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Baloo 2', cursive", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ color: 'var(--text-dark)', lineHeight: 1.6, margin: 0 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDetail;
