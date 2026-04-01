import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const inputDark = {
  width: '100%', backgroundColor: '#0f1f17', border: '1px solid #2d4a35',
  borderRadius: '12px', padding: '12px 16px', fontSize: '14px',
  color: 'white', outline: 'none', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
};

const inputLight = {
  width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb',
  borderRadius: '12px', padding: '12px 16px', fontSize: '14px',
  color: '#0f1f17', outline: 'none', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
};

export default function AdminProfile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profile');
        setProfile(data);
        setProfileForm({ name: data.name, email: data.email });
      } catch {
        setProfileMsg({ text: 'Failed to load profile', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ text: '', type: '' });
    try {
      const { data } = await API.put('/profile', profileForm);
      setProfile(data);
      login({ ...user, name: data.name, email: data.email });
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordMsg({ text: 'New password must be at least 6 characters', type: 'error' });
    }

    setPasswordSaving(true);
    try {
      await API.put('/profile/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ text: 'Password changed! Logging you out...', type: 'success' });
      setTimeout(() => { logout(); navigate('/admin-login'); }, 2000);
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'Password change failed', type: 'error' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const tabStyle = (tab) => ({
    flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px',
    fontWeight: '600', border: 'none', cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#1a6b3c' : 'transparent',
    color: activeTab === tab ? 'white' : '#6b7280',
  });

  const msgBox = (msg) => msg.text ? (
    <div style={{
      backgroundColor: msg.type === 'success' ? '#0d2e1a' : '#2d1515',
      border: `1px solid ${msg.type === 'success' ? '#1a6b3c' : '#dc2626'}`,
      color: msg.type === 'success' ? '#4ade80' : '#f87171',
      fontSize: '13px', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px'
    }}>
      {msg.text}
    </div>
  ) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f1f17', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid #1a2e22', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#0f1f17' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#1a6b3c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontFamily: '"Playfair Display", serif' }}>F</span>
          </div>
          <div>
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', color: 'white', display: 'block' }}>FUD-RESOLVE</span>
            <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '600' }}>Admin Panel</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => navigate('/admin/dashboard')}
            style={{ fontSize: '13px', color: '#4ade80', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Dashboard
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ fontSize: '13px', color: '#f87171', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '72px', height: '72px', backgroundColor: '#1a6b3c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '3px solid #2d4a35' }}>
            <span style={{ color: 'white', fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: 'bold' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', fontWeight: 'bold', color: 'white' }}>{user?.name}</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', backgroundColor: '#1a2e22', border: '1px solid #1a6b3c', borderRadius: '999px', padding: '4px 12px' }}>
            <span style={{ fontSize: '10px' }}>🛡️</span>
            <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: '600' }}>Staff ID: {profile?.staffId}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#1a2e22', borderRadius: '14px', padding: '6px', marginBottom: '24px', border: '1px solid #2d4a35' }}>
          <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}>Edit Profile</button>
          <button style={tabStyle('password')} onClick={() => setActiveTab('password')}>Change Password</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
        ) : (
          <div style={{ backgroundColor: '#1a2e22', borderRadius: '20px', border: '1px solid #2d4a35', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>Admin Information</h2>
                {msgBox(profileMsg)}

                {/* Read-only */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '6px' }}>Staff ID</label>
                  <div style={{ ...inputDark, backgroundColor: '#0a1710', color: '#6b7280' }}>{profile?.staffId}</div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '6px' }}>Role</label>
                  <div style={{ ...inputDark, backgroundColor: '#0a1710', color: '#6b7280', textTransform: 'capitalize' }}>{profile?.role}</div>
                </div>

                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Full Name', name: 'name', type: 'text' },
                    { label: 'Email Address', name: 'email', type: 'email' },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px' }}>{label}</label>
                      <input type={type} name={name} value={profileForm[name]}
                        onChange={handleProfileChange} required style={inputDark} />
                    </div>
                  ))}
                  <button type="submit" disabled={profileSaving}
                    style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '13px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: profileSaving ? 0.6 : 1 }}>
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>Change Password</h2>
                {msgBox(passwordMsg)}

                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Current Password', name: 'currentPassword', placeholder: 'Enter current password' },
                    { label: 'New Password', name: 'newPassword', placeholder: 'Min. 6 characters' },
                    { label: 'Confirm New Password', name: 'confirmPassword', placeholder: 'Repeat new password' },
                  ].map(({ label, name, placeholder }) => (
                    <div key={name}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px' }}>{label}</label>
                      <input type="password" name={name} value={passwordForm[name]}
                        onChange={handlePasswordChange} placeholder={placeholder} required style={inputDark} />
                    </div>
                  ))}
                  <button type="submit" disabled={passwordSaving}
                    style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '13px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: passwordSaving ? 0.6 : 1 }}>
                    {passwordSaving ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px', textAlign: 'center' }}>
                  You will be logged out automatically after changing your password.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}