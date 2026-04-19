import React from 'react';
import Navbar from '../components/Navbar';

const ShopDashboard = () => {
  const features = [
    { icon: '📦', title: 'Manage Products', desc: 'Add, update, or remove products from your catalog' },
    { icon: '📋', title: 'Confirm Orders', desc: 'Review and confirm incoming customer orders' },
    { icon: '🚚', title: 'Assign Delivery', desc: 'Assign delivery agents to pending shipments' },
    { icon: '📊', title: 'Sales Reports', desc: 'View detailed analytics and sales performance' },
  ];

  return (
    <div>
      <Navbar role="shopowner" />
      <div className="shop-page">
        <div style={{ marginBottom: 8 }}>
          <h1>🏪 Shop Owner Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Manage your products, view orders, and assign delivery agents.</p>
        </div>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
