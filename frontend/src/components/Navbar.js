import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = ({ role }) => {
  const { cartCount } = useCart();
  const history = useHistory();

  function handleLogout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    } catch { }
    if (role === 'admin') history.push('/admin/login');
    else history.push('/');
  }

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch { return null; }
  })();

  const initials = currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-icon">🛒</span>
        <span className="logo-text">FreshMart</span>
      </div>

      <div className="nav-links">
        {currentUser?.name && (
          <Link to="/profile" className="nav-user">
            <div className="nav-avatar">{initials}</div>
            <span className="nav-user-name">{currentUser.name}</span>
          </Link>
        )}

        {role === 'admin' ? (
          <>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">🏠 Home</Link>
            <Link to="/cart" className="nav-link nav-cart-badge">
              🛍️ Cart
              {cartCount > 0 && <span className="nav-cart-count">{cartCount}</span>}
            </Link>
            {(role === 'delivery' || (!role && currentUser?.name)) && (
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
