import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Bihar','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'];
const VEHICLES = ['Mini Truck', 'Tempo', 'Tractor', 'Medium Truck', 'Large Truck'];
const STATUS_COLORS = { Pending: '#f57f17', Confirmed: '#1565c0', 'In Transit': '#6a1b9a', Delivered: '#2e7d32', Cancelled: '#c62828' };

const statusBadge = (status) => (
  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '100px', background: `${STATUS_COLORS[status]}20`, color: STATUS_COLORS[status], fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.78rem' }}>{status}</span>
);

const Transport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('request');
  const [providers, setProviders] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    pickupLocation: { address: '', district: '', state: '', pincode: '' },
    dropLocation: { address: '', district: '', state: '', pincode: '' },
    commodity: '',
    quantity: { value: '', unit: 'Quintal' },
    vehicleType: 'Mini Truck',
    scheduledDate: '',
    contactPhone: '',
    notes: ''
  });

  useEffect(() => {
    fetchProviders();
    if (user) fetchMyRequests();
  }, [user]);

  const fetchProviders = async () => {
    try {
      const { data } = await axios.get('/api/transport/providers');
      setProviders(data.providers);
    } catch (err) {}
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/transport/my-requests');
      setMyRequests(data.requests);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book transport'); navigate('/login'); return; }
    if (!form.pickupLocation.address || !form.pickupLocation.district || !form.dropLocation.address || !form.commodity || !form.quantity.value || !form.scheduledDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/transport/request', form);
      toast.success('Transport request submitted! Provider will contact you soon 🚛');
      setForm({ pickupLocation: { address: '', district: '', state: '', pincode: '' }, dropLocation: { address: '', district: '', state: '', pincode: '' }, commodity: '', quantity: { value: '', unit: 'Quintal' }, vehicleType: 'Mini Truck', scheduledDate: '', contactPhone: '', notes: '' });
      setTab('my-requests');
      fetchMyRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (reqId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await axios.put(`/api/transport/${reqId}/cancel`);
      toast.success('Request cancelled');
      fetchMyRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  const costEstimate = {
    'Mini Truck': '₹2,000 - ₹3,500',
    'Tempo': '₹1,500 - ₹2,500',
    'Tractor': '₹1,200 - ₹2,000',
    'Medium Truck': '₹3,500 - ₹5,500',
    'Large Truck': '₹5,500 - ₹8,000'
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>🚛 Transport & Logistics</h1>
          <p>Book transport for your crops — farm to mandi, storage, or processing unit</p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <div className="tabs">
            {[['request', '📋 Book Transport'], ['providers', '🏢 Our Partners'], ['my-requests', '📦 My Bookings']].map(([key, label]) => (
              <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => { setTab(key); if (key === 'my-requests' && user) fetchMyRequests(); }}>{label}</button>
            ))}
          </div>

          {/* Book Transport Form */}
          {tab === 'request' && (
            <div style={{ maxWidth: '750px' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>📋 Request Transport Pickup</h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ background: 'var(--green-bg)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--green-dark)' }}>📍 Pickup Location</h4>
                    <div className="form-group">
                      <label>Address *</label>
                      <input type="text" className="form-control" value={form.pickupLocation.address} onChange={e => handleChange('pickupLocation', 'address', e.target.value)} placeholder="Village/Town, nearby landmark" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                      <div className="form-group">
                        <label>District *</label>
                        <input type="text" className="form-control" value={form.pickupLocation.district} onChange={e => handleChange('pickupLocation', 'district', e.target.value)} placeholder="Your district" required />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <select className="form-control" value={form.pickupLocation.state} onChange={e => handleChange('pickupLocation', 'state', e.target.value)}>
                          <option value="">Select State</option>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#fff3e0', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#e65100' }}>📦 Drop Location</h4>
                    <div className="form-group">
                      <label>Address *</label>
                      <input type="text" className="form-control" value={form.dropLocation.address} onChange={e => handleChange('dropLocation', 'address', e.target.value)} placeholder="Mandi name / destination" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                      <div className="form-group">
                        <label>District</label>
                        <input type="text" className="form-control" value={form.dropLocation.district} onChange={e => handleChange('dropLocation', 'district', e.target.value)} placeholder="Destination district" />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <select className="form-control" value={form.dropLocation.state} onChange={e => handleChange('dropLocation', 'state', e.target.value)}>
                          <option value="">Select State</option>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <div className="form-group">
                      <label>🌾 Commodity *</label>
                      <input type="text" className="form-control" value={form.commodity} onChange={e => handleChange(null, 'commodity', e.target.value)} placeholder="e.g., Wheat, Rice, Tomato" required />
                    </div>
                    <div className="form-group">
                      <label>⚖️ Quantity (Quintals) *</label>
                      <input type="number" className="form-control" value={form.quantity.value} onChange={e => handleChange('quantity', 'value', e.target.value)} placeholder="e.g., 50" min="1" required />
                    </div>
                    <div className="form-group">
                      <label>🚛 Vehicle Type *</label>
                      <select className="form-control" value={form.vehicleType} onChange={e => handleChange(null, 'vehicleType', e.target.value)}>
                        {VEHICLES.map(v => <option key={v}>{v}</option>)}
                      </select>
                      <small style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>Est. cost: {costEstimate[form.vehicleType]}</small>
                    </div>
                    <div className="form-group">
                      <label>📅 Pickup Date *</label>
                      <input type="date" className="form-control" value={form.scheduledDate} onChange={e => handleChange(null, 'scheduledDate', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="form-group">
                      <label>📱 Contact Phone</label>
                      <input type="tel" className="form-control" value={form.contactPhone} onChange={e => handleChange(null, 'contactPhone', e.target.value)} placeholder="Your phone number" />
                    </div>
                    <div className="form-group">
                      <label>📝 Additional Notes</label>
                      <input type="text" className="form-control" value={form.notes} onChange={e => handleChange(null, 'notes', e.target.value)} placeholder="Any special instructions" />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={submitting}>
                    {submitting ? '⏳ Submitting...' : '🚛 Submit Transport Request'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Providers */}
          {tab === 'providers' && (
            <div className="grid-3">
              {providers.map((p, i) => (
                <div key={i} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, background: 'var(--green-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🚛</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#f57f17', fontFamily: "'Baloo 2', cursive", fontWeight: 700 }}>{'⭐'.repeat(Math.round(p.rating))} {p.rating}</div>
                    </div>
                  </div>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{p.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {p.vehicles.map(v => <span key={v} className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{v}</span>)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    📍 {p.areas.join(', ')}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginBottom: '1rem' }}>
                    💰 ₹{p.pricePerKm}/km approx
                  </div>
                  <a href={`tel:${p.phone}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    📞 {p.phone}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* My Requests */}
          {tab === 'my-requests' && (
            !user ? (
              <div className="alert alert-info">
                <Link to="/login" style={{ color: 'var(--sky)', fontWeight: 700 }}>Login</Link> to view your transport bookings
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}><div className="loader" style={{ margin: '0 auto', borderTopColor: 'var(--green-mid)' }}></div></div>
            ) : myRequests.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🚛</div>
                <h3>No transport requests yet</h3>
                <button onClick={() => setTab('request')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Book Transport</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myRequests.map(req => (
                  <div key={req._id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          {statusBadge(req.status)}
                          <span className="badge badge-earth">{req.vehicleType}</span>
                        </div>
                        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--green-dark)' }}>
                          {req.commodity} — {req.quantity.value} {req.quantity.unit}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {req.estimatedCost && <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--green-mid)', fontSize: '1.1rem' }}>₹{req.estimatedCost}</div>}
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{new Date(req.scheduledDate).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.87rem', color: 'var(--text-mid)', marginBottom: '0.5rem' }}>
                      📍 From: {req.pickupLocation.address}, {req.pickupLocation.district}
                    </div>
                    <div style={{ fontSize: '0.87rem', color: 'var(--text-mid)', marginBottom: '1rem' }}>
                      🏭 To: {req.dropLocation.address}
                    </div>
                    {req.status === 'Pending' && (
                      <button onClick={() => handleCancel(req._id)} className="btn btn-sm" style={{ background: '#fce4ec', color: '#c62828', border: 'none', cursor: 'pointer' }}>Cancel Request</button>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Transport;
