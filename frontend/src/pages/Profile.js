import React from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const history = useHistory();
  let user = null;
  try { user = JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch {}
  if (!user) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: 24 }}>No user info available.</div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div style={{ padding: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>My Profile</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '24px' }}>Manage your account information and preferences</p>
        <div className="card" style={{ 
          maxWidth: 520, 
          marginTop: 16, 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card-body" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700, 
                fontSize: 28, 
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                {String(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, paddingTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#2d3748' }}>{user.name}</div>
                <div style={{ color: '#4a5568', marginBottom: 12, fontSize: 16 }}>{user.email}</div>
                <div>
                  <span style={{
                    background: 'linear-gradient(135deg, #4caf50, #45a049)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                  }}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('token');
                    localStorage.removeItem('currentUser');
                  } catch {}
                  history.push('/');
                }}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


