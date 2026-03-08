import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Crop Disease', 'Irrigation', 'Fertilizer', 'Pest Control', 'Market Price', 'Weather', 'Soil', 'Government Scheme', 'Other'];

const QuestionCard = ({ q }) => (
  <Link to={`/community/${q._id}`} style={{ textDecoration: 'none' }}>
    <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,71,49,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-blue">{q.category}</span>
          {q.isResolved && <span className="badge badge-green">✅ Resolved</span>}
          {q.language && q.language !== 'English' && <span className="badge badge-earth">{q.language}</span>}
        </div>
        <span style={{ color: 'var(--text-light)', fontSize: '0.78rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
          {new Date(q.createdAt).toLocaleDateString('en-IN')}
        </span>
      </div>

      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--green-dark)', lineHeight: 1.4 }}>{q.title}</h3>
      <p style={{ color: 'var(--text-light)', fontSize: '0.87rem', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.content}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 28, height: 28, background: 'var(--green-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--green-dark)' }}>
            {q.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)' }}>{q.user?.name}</span>
          {q.user?.role !== 'farmer' && <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{q.user?.role}</span>}
          {q.user?.district && <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>📍 {q.user.district}</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>
          <span>💬 {q.answers?.length || 0}</span>
          <span>👁️ {q.views || 0}</span>
          <span>👍 {q.upvotes?.length || 0}</span>
        </div>
      </div>
    </div>
  </Link>
);

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'Other', crop: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [category]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await axios.get('/api/community/questions', { params });
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleAskQuestion = () => {
    if (!user) {
      toast.error('Please login to ask a question');
      navigate('/login');
      return;
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/community/questions', form);
      toast.success('Question posted successfully!');
      setShowForm(false);
      setForm({ title: '', content: '', category: 'Other', crop: '' });
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = questions.filter(q => !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>💬 Farmer Community</h1>
          <p>Ask questions, share knowledge, get expert advice in your local language</p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          {/* Ask question banner */}
          {!showForm && (
            <div style={{ background: 'linear-gradient(135deg, var(--green-dark), var(--green-mid))', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>Have a farming question? 🌾</h3>
                <p style={{ color: '#b7e4c7', fontSize: '0.9rem' }}>Get answers from expert agronomists and experienced farmers</p>
              </div>
              <button onClick={handleAskQuestion} className="btn btn-gold">+ Ask Question</button>
            </div>
          )}

          {/* Ask Question Form */}
          {showForm && (
            <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--sky)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3>📝 Ask Your Question</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-light)' }}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Question Title *</label>
                  <input type="text" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Why are my wheat leaves turning yellow?" required minLength={10} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Related Crop</label>
                    <input type="text" className="form-control" value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })} placeholder="e.g., Wheat, Rice" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Describe Your Problem *</label>
                  <textarea className="form-control" rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Describe the problem in detail — what you see, when it started, what you've tried..." required />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Posting...' : '📤 Post Question'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '250px', display: 'flex', gap: '0.5rem' }}>
              <input type="text" className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." />
              <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Search</button>
            </form>
          </div>

          {/* Category tabs */}
          <div className="tabs" style={{ marginBottom: '1.5rem' }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loader" style={{ margin: '0 auto', borderTopColor: 'var(--green-mid)' }}></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💬</div>
              <h3>No questions yet</h3>
              <p>Be the first to ask a question!</p>
              <button onClick={handleAskQuestion} className="btn btn-primary" style={{ marginTop: '1rem' }}>Ask First Question</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filtered.map(q => <QuestionCard key={q._id} q={q} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
