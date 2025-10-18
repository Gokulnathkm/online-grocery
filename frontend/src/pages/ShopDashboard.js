import React from 'react';
import Navbar from '../components/Navbar';

const ShopDashboard = () => {
  return (
    <div>
      <Navbar role="shopowner" />
      <div style={{ padding: '20px' }}>
        <h2>Shop Owner Dashboard</h2>
        <p>Manage your products, view orders, and assign delivery agents here.</p>
        <ul>
          <li>Add / Update / Delete Products</li>
          <li>Confirm Orders</li>
          <li>Assign Delivery Agent</li>
          <li>View Sales Reports</li>
        </ul>
      </div>
    </div>
  );
};

export default ShopDashboard;
