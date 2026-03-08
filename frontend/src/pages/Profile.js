import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Bihar','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'];
const LANGUAGES = ['English','Hindi','Punjabi','Marathi','Telugu','Tamil','Kannada','Bengali','Gujarati','Odia'];

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.state || '',
    district: user?.district || '',
    language: user?.language || 'Hindi'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const roleColor = { farmer: 'var(--green-mid)', expert: 'var(--gold-dark)', admin: '#c62828' };
  const roleEmoji = { farmer: '👨‍🌾', expert: '👨‍🔬', admin: '⚙️' };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="page-section">
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Profile Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--green-mid), var(--green-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontFamily: "'Baloo 2', cursive", fontWeight: 800 }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ padding: '0.2rem 0.7rem', borderRadius: '100px', background: `${roleColor[user?.role]}20`, color: roleColor[user?.role], fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.85rem' }}>
                    {roleEmoji[user?.role]} {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                  </span>
                  {user?.language && <span className="badge badge-earth">{user.language}</span>}
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.87rem', marginTop: '0.4rem' }}>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), icon: '📅' },
              { label: 'Location', value: user?.district && user?.state ? `${user.district}, ${user.state}` : user?.state || 'Not set', icon: '📍' },
              { label: 'Phone', value: user?.phone || 'Not set', icon: '📱' }
            ].map((stat, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: 'var(--green-dark)', marginBottom: '0.2rem' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Edit Profile */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>✏️ Profile Information</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm">Edit Profile</button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Full Name</label>
                    <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
                  </div>
                  <div className="form-group">
                    <label>Preferred Language</label>
                    <select className="form-control" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select className="form-control" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>District</label>
                    <input type="text" className="form-control" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="Your district" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                {[
                  ['Full Name', user?.name],
                  ['Email', user?.email],
                  ['Mobile', user?.phone || 'Not added'],
                  ['State', user?.state || 'Not added'],
                  ['District', user?.district || 'Not added'],
                  ['Language', user?.language || 'Hindi']
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0.65rem 0' }}>
                    <span style={{ minWidth: '120px', fontWeight: 600, color: 'var(--text-mid)', fontSize: '0.9rem' }}>{label}</span>
                    <span style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button onClick={logout} style={{ padding: '0.6rem 2rem', background: '#fce4ec', border: 'none', borderRadius: '8px', color: '#c62828', cursor: 'pointer', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem' }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
