import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const history = useHistory();
  const { order } = location.state || {};

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="card">
            <h3>No recent order found</h3>
            <button className="btn primary" onClick={() => history.push('/dashboard')}>
              Back to Shop
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container order-confirmation">
        <div className="card" style={{ maxWidth: 700 }}>
          <h2>Thank you — Order placed!</h2>
          <p className="oc-row">Order ID: <strong>{order.id}</strong></p>
          <p className="oc-row">Name: {order.name}</p>
          <p className="oc-row">Delivery: {order.address || 'N/A'}</p>
          <p className="oc-row">Payment: {order.paymentMethod}</p>
          <h3 className="oc-items-title">Items</h3>
          <div className="oc-items">
            {order.items.map(it => (
              <div key={it.id} className="oc-item-row">
                <div className="oc-item-name">{it.name} x {it.qty}</div>
                <div className="oc-item-price">₹{(it.priceValue * it.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <h3 className="oc-total">Total: ₹{order.total.toFixed(2)}</h3>

          <div style={{ marginTop: 18 }}>
            <button className="btn primary" onClick={() => history.push('/dashboard')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
