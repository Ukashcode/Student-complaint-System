import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const STATUS_COLORS = {
  pending:  { bg: '#fef9c3', color: '#a16207' },
  inReview: { bg: '#dbeafe', color: '#1d4ed8' },
  resolved: { bg: '#dcfce7', color: '#15803d' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
};

const CATEGORIES = ['Academic', 'Hostel', 'Finance', 'Transport', 'Other'];

const inputStyle = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px',
  padding: '12px 16px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: '"DM Sans", sans-serif',
  backgroundColor: 'white',
};

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false); // 👈 New
  const [form, setForm] = useState({ title: '', description: '', category: 'Academic' });
  const [editForm, setEditForm] = useState({ title: '', description: '', category: 'Academic' }); // 👈 New
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false); // 👈 New
  const [error, setError] = useState('');

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await API.post('/complaints', form);
      setForm({ title: '', description: '', category: 'Academic' });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  // 👇 New — handle complaint update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      const { data } = await API.put(`/complaints/${selected._id}`, editForm);
      // Update the complaint in the list without refetching
      setComplaints((prev) => prev.map((c) => c._id === data._id ? data : c));
      setSelected(data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete');
    }
  };

  // 👇 New — open edit mode pre-filled with current values
  const openEdit = () => {
    setEditForm({
      title: selected.title,
      description: selected.description,
      category: selected.category,
    });
    setEditMode(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f5', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#1a6b3c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: '"Playfair Display", serif' }}>F</span>
          </div>
          <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', color: '#0f1f17' }}>FUD-RESOLVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Welcome, <strong style={{ color: '#0f1f17' }}>{user?.name}</strong>
          </span>
          {/* 👇 Profile link */}
          <button onClick={() => navigate('/profile')}
            style={{ fontSize: '13px', color: '#1a6b3c', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            My Profile
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', fontWeight: 'bold', color: '#0f1f17' }}>My Complaints</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '2px' }}>
              {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setSelected(null); setEditMode(false); }}
            style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ New Complaint'}
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* New Complaint Form */}
        {showForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 'bold', color: '#0f1f17', marginBottom: '20px' }}>Submit a Complaint</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                  placeholder="Brief summary of your complaint" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Explain your complaint in detail..." required rows={4}
                  style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <button type="submit" disabled={submitting}
                style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '13px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        )}

        {/* Complaint Detail / Edit View */}
        {selected && (
          <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>

            {/* Detail Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 'bold', color: '#0f1f17' }}>
                  {editMode ? 'Edit Complaint' : selected.title}
                </h2>
                {!editMode && (
                  <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                    {new Date(selected.createdAt).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
              <button onClick={() => { setSelected(null); setEditMode(false); }}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: '#9ca3af', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Edit Form */}
            {editMode ? (
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>Title</label>
                  <input type="text" name="title" value={editForm.title} onChange={handleEditChange}
                    required style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>Category</label>
                  <select name="category" value={editForm.category} onChange={handleEditChange} style={inputStyle}>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0f1f17', marginBottom: '6px' }}>Description</label>
                  <textarea name="description" value={editForm.description} onChange={handleEditChange}
                    required rows={4} style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" disabled={updating}
                    style={{ flex: 1, backgroundColor: '#1a6b3c', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', opacity: updating ? 0.6 : 1 }}>
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditMode(false)}
                    style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Detail View */
              <>
                <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '999px', marginBottom: '16px', backgroundColor: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>
                  {selected.status}
                </span>

                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.7', marginBottom: '16px' }}>{selected.description}</p>

                {selected.adminRemarks && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#1a6b3c', marginBottom: '4px' }}>Admin Remarks</p>
                    <p style={{ fontSize: '13px', color: '#4b5563' }}>{selected.adminRemarks}</p>
                  </div>
                )}

                {/* Action buttons — only show if pending */}
                {selected.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={openEdit}
                      style={{ fontSize: '13px', color: '#1a6b3c', fontWeight: '600', background: 'none', border: '1px solid #1a6b3c', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>
                      ✏️ Edit Complaint
                    </button>
                    <button onClick={() => handleDelete(selected._id)}
                      style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600', background: 'none', border: '1px solid #dc2626', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>
                      🗑 Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Complaints List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No complaints submitted yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {complaints.map((c) => (
              <div key={c._id} onClick={() => { setSelected(c); setShowForm(false); setEditMode(false); }}
                style={{ backgroundColor: 'white', borderRadius: '16px', border: `1px solid ${selected?._id === c._id ? '#1a6b3c' : '#e5e7eb'}`, padding: '18px 20px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: '600', color: '#0f1f17', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>{c.category} · {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap', backgroundColor: STATUS_COLORS[c.status]?.bg, color: STATUS_COLORS[c.status]?.color }}>
                    {c.status}
                  </span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}