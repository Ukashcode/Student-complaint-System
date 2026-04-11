import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function AdminStudents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null); // track which button is loading

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/students/admin/all');
      setStudents(data);
    } catch {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    const student = students.find((s) => s._id === id);
    const action = student.isBlocked ? 'unblock' : 'block';

    if (!confirm(`Are you sure you want to ${action} ${student.name}?`)) return;

    setTogglingId(id);
    try {
      const { data } = await API.put(`/students/admin/${id}/block`);
      // Update just that student in the list
      setStudents((prev) =>
        prev.map((s) => s._id === id ? { ...s, isBlocked: data.isBlocked } : s)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setTogglingId(null);
    }
  };

  // Filter by name, email, or reg number
  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.registrationNumber.toLowerCase().includes(q)
    );
  });

  const blocked = students.filter((s) => s.isBlocked).length;
  const active = students.length - blocked;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f5', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#0f1f17', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#1a6b3c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: '"Playfair Display", serif' }}>F</span>
          </div>
          <div>
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', color: 'white', display: 'block' }}>FUD-RESOLVE</span>
            <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '600' }}>Admin Panel</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/admin/dashboard')}
            style={{ fontSize: '13px', color: '#4ade80', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Dashboard
          </button>
          <button onClick={() => navigate('/admin/profile')}
            style={{ fontSize: '13px', color: '#4ade80', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            My Profile
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ fontSize: '13px', color: '#f87171', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 16px' }}>

        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', fontWeight: 'bold', color: '#0f1f17' }}>Student Management</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>View and manage student accounts</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Students', value: students.length, bg: '#f3f4f6', color: '#374151' },
            { label: 'Active', value: active, bg: '#dcfce7', color: '#15803d' },
            { label: 'Blocked', value: blocked, bg: '#fee2e2', color: '#dc2626' },
          ].map(({ label, value, bg, color }) => (
            <div key={label} style={{ backgroundColor: bg, borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color, fontFamily: '"Playfair Display", serif' }}>{value}</p>
              <p style={{ fontSize: '12px', color, fontWeight: '600', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍  Search by name, email or registration number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif', backgroundColor: 'white' }}
          />
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Students List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Loading students...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>👤</p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No students found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((s) => (
              <div key={s._id}
                style={{ backgroundColor: 'white', borderRadius: '16px', border: `1px solid ${s.isBlocked ? '#fecaca' : '#e5e7eb'}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                {/* Student Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  {/* Avatar */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: s.isBlocked ? '#fee2e2' : '#f0fdf4', border: `2px solid ${s.isBlocked ? '#fecaca' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: s.isBlocked ? '#dc2626' : '#1a6b3c', fontFamily: '"Playfair Display", serif' }}>
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: '600', color: '#0f1f17', fontSize: '14px', margin: 0 }}>{s.name}</h3>
                      {s.isBlocked && (
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.email}</p>
                    <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '1px' }}>{s.registrationNumber} · {s.phoneNumber}</p>
                  </div>
                </div>

                {/* Block / Unblock Button */}
                <button
                  onClick={() => handleToggleBlock(s._id)}
                  disabled={togglingId === s._id}
                  style={{
                    padding: '8px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: '600',
                    border: 'none', cursor: 'pointer', flexShrink: 0,
                    opacity: togglingId === s._id ? 0.6 : 1,
                    backgroundColor: s.isBlocked ? '#f0fdf4' : '#fef2f2',
                    color: s.isBlocked ? '#15803d' : '#dc2626',
                  }}>
                  {togglingId === s._id
                    ? 'Please wait...'
                    : s.isBlocked ? '✅ Unblock' : '🚫 Block'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}