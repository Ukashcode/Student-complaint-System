import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const STATUS_COLORS = {
  pending:  { bg: '#fef9c3', color: '#a16207' },
  inReview: { bg: '#dbeafe', color: '#1d4ed8' },
  resolved: { bg: '#dcfce7', color: '#15803d' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
};

const STATUSES = ['all', 'pending', 'inReview', 'resolved', 'rejected'];

const inputStyle = (dark = false) => ({
  width: '100%', border: `1px solid ${dark ? '#2d4a35' : '#e5e7eb'}`,
  borderRadius: '12px', padding: '10px 14px', fontSize: '13px',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
  backgroundColor: dark ? '#0f1f17' : 'white',
  color: dark ? 'white' : '#0f1f17',
});

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [remarkForm, setRemarkForm] = useState({ status: '', adminRemarks: '' });
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: '', type: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        API.get('/complaints/admin/all'),
        API.get('/complaints/admin/stats'),
      ]);
      setComplaints(complaintsRes.data);
      setStats(statsRes.data);
    } catch {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  // Open a complaint and pre-fill the remark form
  const openComplaint = (c) => {
    setSelected(c);
    setRemarkForm({ status: c.status, adminRemarks: c.adminRemarks || '' });
    setUpdateMsg({ text: '', type: '' });
  };

  const handleRemarkChange = (e) => {
    const { name, value } = e.target;
    setRemarkForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg({ text: '', type: '' });
    try {
      const { data } = await API.put(
        `/complaints/admin/${selected._id}/status`,
        remarkForm
      );
      // Update in the list
      setComplaints((prev) => prev.map((c) => c._id === data._id ? data : c));
      setSelected(data);
      setRemarkForm({ status: data.status, adminRemarks: data.adminRemarks || '' });
      // Update stats
      const statsRes = await API.get('/complaints/admin/stats');
      setStats(statsRes.data);
      setUpdateMsg({ text: 'Complaint updated successfully!', type: 'success' });
    } catch (err) {
      setUpdateMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  // Filter complaints by selected status tab
  const filtered = filterStatus === 'all'
    ? complaints
    : complaints.filter((c) => c.status === filterStatus);

  const statCards = [
    { label: 'Total', value: complaints.length, bg: '#f3f4f6', color: '#374151' },
    { label: 'Pending', value: stats.pending || 0, bg: '#fef9c3', color: '#a16207' },
    { label: 'In Review', value: stats.inReview || 0, bg: '#dbeafe', color: '#1d4ed8' },
    { label: 'Resolved', value: stats.resolved || 0, bg: '#dcfce7', color: '#15803d' },
    { label: 'Rejected', value: stats.rejected || 0, bg: '#fee2e2', color: '#dc2626' },
  ];

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
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>
            <span style={{ color: '#4ade80' }}>●</span> {user?.name}
          </span>
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

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px' }}>

        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', fontWeight: 'bold', color: '#0f1f17' }}>Complaints Dashboard</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>Review and manage all student complaints</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {statCards.map(({ label, value, bg, color }) => (
            <div key={label} style={{ backgroundColor: bg, borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color, fontFamily: '"Playfair Display", serif' }}>{value}</p>
              <p style={{ fontSize: '12px', color, fontWeight: '600', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Main Layout — List + Detail side by side on wide screens */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>

          {/* LEFT — Complaints List */}
          <div>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', backgroundColor: filterStatus === s ? '#0f1f17' : '#e5e7eb', color: filterStatus === s ? 'white' : '#6b7280', textTransform: s === 'all' ? 'capitalize' : 'none' }}>
                  {s === 'all' ? `All (${complaints.length})` : `${s} (${stats[s] || 0})`}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Loading complaints...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>No complaints found</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((c) => (
                  <div key={c._id} onClick={() => openComplaint(c)}
                    style={{ backgroundColor: 'white', borderRadius: '14px', border: `1px solid ${selected?._id === c._id ? '#1a6b3c' : '#e5e7eb'}`, padding: '16px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: '600', color: '#0f1f17', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }}>{c.category} · {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap', backgroundColor: STATUS_COLORS[c.status]?.bg, color: STATUS_COLORS[c.status]?.color }}>
                        {c.status}
                      </span>
                    </div>
                    {/* Student info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', backgroundColor: '#1a6b3c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>{c.student?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{c.student?.name} · {c.student?.registrationNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Complaint Detail + Action Panel */}
          {selected && (
            <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: 'fit-content', position: 'sticky', top: '80px' }}>

              {/* Close */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 'bold', color: '#0f1f17' }}>Complaint Detail</h2>
                <button onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', fontSize: '18px', color: '#9ca3af', cursor: 'pointer' }}>✕</button>
              </div>

              {/* Title & status */}
              <h3 style={{ fontWeight: '700', color: '#0f1f17', fontSize: '15px', marginBottom: '6px' }}>{selected.title}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', backgroundColor: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>
                  {selected.status}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{selected.category}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>·</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(selected.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Student info box */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#1a6b3c', marginBottom: '6px' }}>SUBMITTED BY</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f1f17' }}>{selected.student?.name}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{selected.student?.email}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{selected.student?.registrationNumber}</p>
              </div>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>{selected.description}</p>

              {/* Previous admin remarks */}
              {selected.adminRemarks && (
                <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#a16207', marginBottom: '4px' }}>PREVIOUS REMARK</p>
                  <p style={{ fontSize: '13px', color: '#4b5563' }}>{selected.adminRemarks}</p>
                </div>
              )}

              {/* Update Form */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f1f17', marginBottom: '14px' }}>Update Complaint</h4>

                {updateMsg.text && (
                  <div style={{ backgroundColor: updateMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${updateMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: updateMsg.type === 'success' ? '#15803d' : '#dc2626', fontSize: '12px', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
                    {updateMsg.text}
                  </div>
                )}

                <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Set Status</label>
                    <select name="status" value={remarkForm.status} onChange={handleRemarkChange}
                      style={{ ...inputStyle(), fontSize: '13px' }}>
                      <option value="pending">Pending</option>
                      <option value="inReview">In Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Admin Remarks</label>
                    <textarea name="adminRemarks" value={remarkForm.adminRemarks} onChange={handleRemarkChange}
                      placeholder="Add your response or decision note..." rows={3}
                      style={{ ...inputStyle(), resize: 'none', fontSize: '13px' }} />
                  </div>
                  <button type="submit" disabled={updating}
                    style={{ backgroundColor: '#0f1f17', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer', opacity: updating ? 0.6 : 1 }}>
                    {updating ? 'Updating...' : 'Update Complaint'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}