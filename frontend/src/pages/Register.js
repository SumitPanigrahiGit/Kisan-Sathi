import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Bihar','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'];
const LANGUAGES = ['English','Hindi','Punjabi','Marathi','Telugu','Tamil','Kannada','Bengali','Gujarati','Odia'];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', state: '', district: '', language: 'Hindi' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      await register(submitData);
      toast.success('Registration successful! Welcome to KisanSathi 🌾');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌱</div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.25rem' }}>Join KisanSathi</h1>
          <p style={{ color: '#b7e4c7', fontSize: '0.9rem' }}>Free registration for all Indian farmers</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>👤 Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Your full name" required />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>📧 Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="your@email.com" required />
              </div>

              <div className="form-group">
                <label>🔒 Password *</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Min. 6 characters" required />
              </div>

              <div className="form-group">
                <label>🔒 Confirm Password *</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-control" placeholder="Repeat password" required />
              </div>

              <div className="form-group">
                <label>📱 Mobile Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="10-digit number" />
              </div>

              <div className="form-group">
                <label>🗣️ Preferred Language</label>
                <select name="language" value={form.language} onChange={handleChange} className="form-control">
                  {LANGUAGES.map(lang => <option key={lang}>{lang}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>🗺️ State</label>
                <select name="state" value={form.state} onChange={handleChange} className="form-control">
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>📍 District</label>
                <input type="text" name="district" value={form.district} onChange={handleChange} className="form-control" placeholder="Your district" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Creating account...' : '🌾 Create Free Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--green-mid)', fontWeight: 700, textDecoration: 'none' }}>Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
