import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MandiRates = () => {
  const [rates, setRates] = useState([]);
  const [states, setStates] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [topMovers, setTopMovers] = useState({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ state: '', commodity: '', district: '' });
  const [activeTab, setActiveTab] = useState('All Rates');

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    fetchRates();
    if (filters.state) fetchMarkets(filters.state);
  }, [filters]);

  const fetchInitial = async () => {
    try {
      const [ratesRes, statesRes, commoditiesRes, moversRes] = await Promise.all([
        axios.get('/api/mandi/rates?limit=30'),
        axios.get('/api/mandi/states'),
        axios.get('/api/mandi/commodities'),
        axios.get('/api/mandi/top-movers')
      ]);
      setRates(ratesRes.data.rates);
      setStates(statesRes.data.states);
      setCommodities(commoditiesRes.data.commodities);
      setTopMovers(moversRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRates = async () => {
    try {
      const params = { limit: 50, ...filters };
      const { data } = await axios.get('/api/mandi/rates', { params });
      setRates(data.rates);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMarkets = async (state) => {
    try {
      const { data } = await axios.get('/api/mandi/markets', { params: { state } });
      setMarkets(data.markets);
    } catch (err) {}
  };

  const TrendIcon = ({ trend, change }) => {
    if (trend === 'up') return <span className="trend-up">▲ {Math.abs(change).toFixed(1)}%</span>;
    if (trend === 'down') return <span className="trend-down">▼ {Math.abs(change).toFixed(1)}%</span>;
    return <span className="trend-stable">● Stable</span>;
  };

  const MoverCard = ({ rate, type }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: type === 'gainer' ? '#f0fdf4' : '#fff5f5', borderRadius: '8px', marginBottom: '0.5rem', border: `1px solid ${type === 'gainer' ? '#bbf7d0' : '#fecaca'}` }}>
      <div>
        <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{rate.commodity}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{rate.market}, {rate.state}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>₹{rate.modalPrice}</div>
        <div style={{ fontSize: '0.82rem' }}>
          {type === 'gainer' ? <span className="trend-up">▲ {Math.abs(rate.changePercent).toFixed(1)}%</span> : <span className="trend-down">▼ {Math.abs(rate.changePercent).toFixed(1)}%</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>📊 Live Mandi Rates</h1>
          <p>Real-time crop prices from mandis across India • Updated daily</p>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#b7e4c7' }}>
            🕐 Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          {/* Top Movers */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1rem', color: '#2e7d32' }}>📈 Top Gainers</h3>
                {topMovers.gainers.slice(0, 4).map((r, i) => <MoverCard key={i} rate={r} type="gainer" />)}
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1rem', color: '#c62828' }}>📉 Top Losers</h3>
                {topMovers.losers.slice(0, 4).map((r, i) => <MoverCard key={i} rate={r} type="loser" />)}
              </div>
            </div>
          )}

          {/* Filters */}
          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-mid)', fontSize: '0.9rem' }}>State</label>
                <select className="form-control" value={filters.state} onChange={e => setFilters({ ...filters, state: e.target.value, district: '' })}>
                  <option value="">All States</option>
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-mid)', fontSize: '0.9rem' }}>Market/District</label>
                <select className="form-control" value={filters.district} onChange={e => setFilters({ ...filters, district: e.target.value })}>
                  <option value="">All Markets</option>
                  {markets.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-mid)', fontSize: '0.9rem' }}>Commodity</label>
                <select className="form-control" value={filters.commodity} onChange={e => setFilters({ ...filters, commodity: e.target.value })}>
                  <option value="">All Commodities</option>
                  {commodities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={() => setFilters({ state: '', commodity: '', district: '' })} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Clear Filters</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loader" style={{ margin: '0 auto', borderTopColor: 'var(--green-mid)' }}></div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Showing <strong>{rates.length}</strong> rates
              </p>
              <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: 'var(--green-dark)', color: 'white' }}>
                      {['Commodity', 'Market', 'State', 'Min ₹', 'Modal ₹', 'Max ₹', 'Trend', 'Date'].map(h => (
                        <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate, i) => (
                      <tr key={rate._id} style={{ background: i % 2 === 0 ? 'white' : '#f8fdf9', borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--green-dark)' }}>{rate.commodity}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-mid)' }}>{rate.market}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-mid)' }}>{rate.state}</td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: "'Baloo 2', cursive" }}>₹{rate.minPrice}</td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--green-dark)', fontSize: '1.05rem' }}>₹{rate.modalPrice}</td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: "'Baloo 2', cursive" }}>₹{rate.maxPrice}</td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.88rem' }}>
                          <TrendIcon trend={rate.trend} change={rate.changePercent} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                          {new Date(rate.arrivalDate).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
                * Prices are in ₹ per Quintal (100 kg). Data sourced from AGMARKNET.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MandiRates;
