import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/student/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f5', fontFamily: '"DM Sans", sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#1a6b3c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: '"Playfair Display", serif' }}>F</span>
          </div>
          <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', color: '#0f1f17' }}>FUD-RESOLVE</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '36px', width: '100%', maxWidth: '420px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: 'bold', color: '#0f1f17', marginBottom: '4px' }}>Student Portal</h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>Login to manage your complaints</p>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>{label}</label>
                <input
                  type={type} name={name} value={form[name]}
                  onChange={handleChange} placeholder={placeholder} required
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif' }}
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '13px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Logging in...' : 'Access Dashboard'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1a6b3c', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
          </p>
          <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: '11px', marginTop: '8px' }}>
            By logging in, you agree to the university's code of conduct.
          </p>
        </div>
      </div>
    </div>
  );
}