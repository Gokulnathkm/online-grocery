import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderConfirmation = () => {
  const location = useLocation();
  const history = useHistory();
  const { order } = location.state || {};

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="confirmation-page">
          <div className="card confirmation-card" style={{ textAlign: 'center' }}>
            <div className="card-body">
              <h3>No recent order found</h3>
              <button className="btn primary" style={{ marginTop: 16 }} onClick={() => history.push('/dashboard')}>
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="confirmation-page">
        <div className="card confirmation-card">
          <div className="card-body">
            <div className="success-icon">✅</div>
            <h2 style={{ textAlign: 'center', marginBottom: 4 }}>Order Placed Successfully!</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 24 }}>Thank you for shopping with FreshMart</p>

            <div className="oc-row">
              <span>Order ID</span>
              <strong>{order.id}</strong>
            </div>
            <div className="oc-row">
              <span>Name</span>
              <strong>{order.name}</strong>
            </div>
            <div className="oc-row">
              <span>Delivery Address</span>
              <strong>{order.address || 'N/A'}</strong>
            </div>
            <div className="oc-row">
              <span>Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>

            <h3 className="oc-items-title">Order Items</h3>
            <div className="oc-items">
              {order.items.map(it => (
                <div key={it.id} className="oc-item-row">
                  <div className="oc-item-name">{it.name} × {it.qty}</div>
                  <div className="oc-item-price">₹{(it.priceValue * it.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <h3 className="oc-total">Total: ₹{order.total.toFixed(2)}</h3>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <button className="btn primary" onClick={() => history.push('/dashboard')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
