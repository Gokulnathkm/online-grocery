import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = ({ role }) => {
  const { cartCount } = useCart();
  const history = useHistory();

  function handleLogout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    } catch {}
    if (role === 'admin') history.push('/admin/login');
    else if (role === 'delivery') history.push('/');
    else history.push('/');
  }

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch { return null; }
  })();

  const initials = currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="logo">
        <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Dashboard</span>
      </div>
      <div className="nav-links">
        {currentUser?.name && (
          <Link to="/profile" style={{ display:'inline-flex', alignItems:'center', gap:8, marginRight:12, textDecoration:'none' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#ddd', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, flexShrink:0 }}>{initials}</div>
            <span style={{ fontWeight: 600, color: 'inherit', lineHeight:1.2 }}>{currentUser.name}</span>
          </Link>
        )}
        {role === 'admin' ? (
          <>
            <button 
              onClick={handleLogout} 
              style={{ 
                marginLeft: 12,
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart ({cartCount})</Link>
            {role === 'delivery' && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  marginLeft: 12,
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
                }}
              >
                Logout
              </button>
            )}
            {!role && currentUser?.name && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  marginLeft: 12,
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
                }}
              >
                Logout
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
