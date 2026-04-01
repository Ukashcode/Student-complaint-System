import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f5', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#1a6b3c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', fontFamily: '"Playfair Display", serif' }}>F</span>
          </div>
          <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', fontSize: '20px', color: '#0f1f17' }}>FUD-RESOLVE</span>
        </div>
        <button
          onClick={() => navigate('/admin-login')}
          style={{ color: '#1a6b3c', fontWeight: '600', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          🛡️ Admin Login
        </button>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '52px', fontWeight: '800', color: '#0f1f17', lineHeight: '1.15', marginBottom: '16px' }}>
          Your Voice <br /> Matters at{' '}
          <span style={{ color: '#1a6b3c' }}>FUD</span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
          FUD-RESOLVE is the official student complaint and feedback management system
          for Federal University Dutse. We ensure your concerns are heard and resolved efficiently.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#1a6b3c', color: 'white', padding: '14px 32px', borderRadius: '14px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(26,107,60,0.3)' }}
          >
            Student Login
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{ backgroundColor: 'transparent', color: '#1a6b3c', padding: '14px 32px', borderRadius: '14px', fontWeight: '600', fontSize: '15px', border: '2px solid #1a6b3c', cursor: 'pointer' }}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: '#f9fafb', padding: '48px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          {[
            { icon: '📝', title: 'Submit', desc: 'Raise complaints easily from any device' },
            { icon: '🔍', title: 'Track', desc: 'Monitor your complaint status in real time' },
            { icon: '✅', title: 'Resolve', desc: 'Get timely responses from university admin' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '28px 20px', textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 'bold', color: '#0f1f17', fontSize: '18px', marginBottom: '6px' }}>{title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.5' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>
        © 2026 FUD-RESOLVE · Federal University Dutse
      </footer>
    </div>
  );
}