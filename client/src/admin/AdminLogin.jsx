import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(username, password);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', res.data.username);
      navigate('/admin/slides');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: 36, color: '#3B82F6' }} />
          <h2 style={{ margin: '12px 0 4px', color: '#0F172A', fontSize: 24, fontWeight: 700 }}>Admin Portal</h2>
          <p style={{ color: '#64748B', margin: 0, fontSize: 14 }}>Pulse Creative & Consulting Ltd</p>
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: 'linear-gradient(135deg,#071121 0%,#0F2744 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '40px 40px',
    width: '100%', maxWidth: 420, boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
  },
  logo: { textAlign: 'center', marginBottom: 8 },
  error: {
    background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B',
    borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 8,
  },
  field: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', border: '1px solid #D1D5DB', borderRadius: 8,
    fontSize: 15, outline: 'none', color: '#111',
  },
  btn: {
    width: '100%', padding: '12px', background: '#3B82F6', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600,
    cursor: 'pointer', marginTop: 8, letterSpacing: 0.3,
  },
};
