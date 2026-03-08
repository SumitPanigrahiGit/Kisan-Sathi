import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const { data } = await axios.get(`/api/community/questions/${id}`);
      setQuestion(data.question);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) { toast.error('Please login to upvote'); navigate('/login'); return; }
    try {
      const { data } = await axios.put(`/api/community/questions/${id}/upvote`);
      setQuestion(prev => ({ ...prev, upvotes: new Array(data.upvotes).fill(null) }));
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to answer'); navigate('/login'); return; }
    if (!answer.trim()) { toast.error('Answer cannot be empty'); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/community/questions/${id}/answers`, { content: answer });
      setQuestion(prev => ({ ...prev, answers: data.answers }));
      setAnswer('');
      toast.success('Answer posted!');
    } catch (err) {
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    try {
      await axios.put(`/api/community/questions/${id}/resolve`);
      setQuestion(prev => ({ ...prev, isResolved: true }));
      toast.success('Question marked as resolved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div className="loader" style={{ borderTopColor: 'var(--green-mid)' }}></div></div>;

  if (!question) return (
    <div className="page-section container empty-state">
      <div className="icon">😞</div>
      <h3>Question not found</h3>
      <Link to="/community" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Community</Link>
    </div>
  );

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Link to="/community" style={{ color: '#b7e4c7', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
            ← Back to Community
          </Link>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-blue">{question.category}</span>
            {question.isResolved && <span className="badge badge-green">✅ Resolved</span>}
            {question.crop && <span className="badge badge-earth">🌱 {question.crop}</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{question.title}</h1>
        </div>
      </div>

      <div className="page-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Question card */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, background: 'var(--green-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--green-dark)', fontSize: '1.1rem' }}>
                  {question.user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--green-dark)' }}>{question.user?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    {question.user?.district && `📍 ${question.user.district}`} • {new Date(question.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                <span>👁️ {question.views}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-dark)', lineHeight: 1.8, marginBottom: '1.25rem', whiteSpace: 'pre-wrap' }}>{question.content}</p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handleUpvote} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', border: '2px solid var(--border)', borderRadius: '8px', background: 'white', cursor: 'pointer', fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: 'var(--text-mid)', fontSize: '0.88rem' }}>
                👍 {question.upvotes?.length || 0} Upvotes
              </button>
              {user && user._id === question.user?._id && !question.isResolved && (
                <button onClick={handleResolve} className="btn btn-outline btn-sm">✅ Mark Resolved</button>
              )}
            </div>
          </div>

          {/* Answers */}
          <h3 style={{ marginBottom: '1.25rem' }}>💬 {question.answers?.length || 0} Answer{question.answers?.length !== 1 ? 's' : ''}</h3>

          {question.answers?.length === 0 && (
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>No answers yet. Be the first to help this farmer!</div>
          )}

          {question.answers?.map((ans, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem', borderLeft: `4px solid ${ans.isExpertAnswer ? 'var(--gold-dark)' : 'var(--green-light)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 32, height: 32, background: ans.isExpertAnswer ? '#fef9e7' : 'var(--green-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: ans.isExpertAnswer ? 'var(--gold-dark)' : 'var(--green-dark)', fontSize: '0.9rem' }}>
                    {ans.user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{ans.user?.name}</span>
                    {ans.isExpertAnswer && <span className="badge badge-gold" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>👨‍🔬 Expert</span>}
                    {ans.isAccepted && <span className="badge badge-green" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>✅ Accepted</span>}
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{new Date(ans.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <p style={{ color: 'var(--text-dark)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{ans.content}</p>
            </div>
          ))}

          {/* Answer Form */}
          <div className="card" style={{ marginTop: '2rem', borderTop: '4px solid var(--green-mid)' }}>
            <h3 style={{ marginBottom: '1rem' }}>✍️ Your Answer</h3>
            {!user ? (
              <div className="alert alert-info">
                <Link to="/login" style={{ color: 'var(--sky)', fontWeight: 700 }}>Login</Link> or <Link to="/register" style={{ color: 'var(--sky)', fontWeight: 700 }}>Register</Link> to post an answer
              </div>
            ) : (
              <form onSubmit={handleAnswer}>
                <textarea
                  className="form-control"
                  rows={5}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Share your knowledge or experience to help this farmer..."
                  style={{ marginBottom: '1rem' }}
                />
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Posting...' : '📤 Post Answer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
