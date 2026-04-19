import React from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const history = useHistory();
  let user = null;
  try { user = JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch { }

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="profile-page">
          <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div className="card-body">
              <p style={{ color: 'var(--text-muted)' }}>No user info available.</p>
              <button className="btn primary" style={{ marginTop: 16 }} onClick={() => history.push('/')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleBadgeClass = user.role === 'admin' ? 'role-admin' : user.role === 'delivery' ? 'role-delivery' : 'role-customer';

  return (
    <div>
      <Navbar />
      <div className="profile-page">
        <div style={{ marginBottom: 24 }}>
          <h1>My Profile</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Manage your account information</p>
        </div>

        <div className="card profile-card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div className="profile-avatar">
                {String(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-email">{user.email}</div>
                <span className={`badge ${roleBadgeClass}`}>{user.role}</span>
              </div>
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button className="btn danger" onClick={() => {
                try {
                  localStorage.removeItem('token');
                  localStorage.removeItem('currentUser');
                } catch { }
                history.push('/');
              }}>
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
