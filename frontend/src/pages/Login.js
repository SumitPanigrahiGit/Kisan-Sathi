import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🌾');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌿</div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.25rem' }}>Welcome Back</h1>
          <p style={{ color: '#b7e4c7', fontSize: '0.9rem' }}>Login to your KisanSathi account</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📧 Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>🔒 Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Logging in...' : '🌾 Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--green-mid)', fontWeight: 700, textDecoration: 'none' }}>Register Free</Link>
            </p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1rem', marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#e9c46a', fontFamily: "'Baloo 2', cursive", fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9rem' }}>💡 New here?</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>Create a free account to ask questions, track mandi rates and book transport!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
