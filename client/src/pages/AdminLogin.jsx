import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function AdminLogin() {
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
      const { data } = await API.post('/auth/admin/login', form);
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f1f17', fontFamily: '"DM Sans", sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #1a2e22', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#1a6b3c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: '"Playfair Display", serif' }}>F</span>
          </div>
          <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', color: 'white' }}>FUD-RESOLVE</span>
        </Link>
        <Link to="/login" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>
          Student Login →
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Badge */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#1a2e22', border: '1px solid #1a6b3c', borderRadius: '999px', padding: '6px 16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px' }}>🛡️</span>
              <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>Admin Access Only</span>
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Admin Portal</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Sign in to manage student complaints</p>
          </div>

          <div style={{ backgroundColor: '#1a2e22', borderRadius: '24px', border: '1px solid #2d4a35', padding: '36px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>

            {error && (
              <div style={{ backgroundColor: '#2d1515', border: '1px solid #dc2626', color: '#f87171', fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Email Address', name: 'email', type: 'email', placeholder: 'admin@fud.edu.ng' },
                { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px' }}>{label}</label>
                  <input
                    type={type} name={name} value={form[name]}
                    onChange={handleChange} placeholder={placeholder} required
                    style={{ width: '100%', backgroundColor: '#0f1f17', border: '1px solid #2d4a35', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif' }}
                  />
                </div>
              ))}

              <button type="submit" disabled={loading}
                style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '13px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}