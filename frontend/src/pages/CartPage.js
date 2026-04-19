import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useHistory } from 'react-router-dom';
import Navbar from "../components/Navbar";

function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, placeOrder } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const history = useHistory();

  if (!cart || cart.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="empty-cart">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <p>Your cart is empty</p>
          <button className="btn primary" style={{ marginTop: 16 }} onClick={() => history.push('/dashboard')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const openPayment = () => setShowPayment(true);
  const closePayment = () => setShowPayment(false);

  const handleSimulatePayment = async (method = 'card') => {
    setPaymentProcessing(true);
    await new Promise(r => setTimeout(r, 900));
    setPaymentProcessing(false);

    const isCOD = method === 'cod';
    const dummyForm = { name: "Customer", address: "N/A", payment: method };
    const summary = await placeOrder(dummyForm, { paid: !isCOD });
    closePayment();
    if (summary) {
      history.push('/order-confirmation', { order: summary });
    } else {
      alert('Order placed (no summary)');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <h2>🛍️ Your Cart</h2>
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <strong>{item.name}</strong>
                <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>
                  ₹{item.price} × {item.quantity}
                </span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  = ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
              <div className="cart-item-actions">
                <button className="btn small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <button className="btn small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button className="btn danger small" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-total">Total: ₹{totalPrice.toFixed(2)}</div>
        <button className="btn primary btn-block" style={{ marginTop: 16, padding: '14px 20px', fontSize: 16 }} onClick={openPayment}>
          Proceed to Payment
        </button>

        {showPayment && (
          <div className="payment-overlay" onClick={closePayment}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <h3>💳 Payment</h3>
              <p>Total to pay: <strong style={{ color: 'var(--accent-emerald)' }}>₹{totalPrice.toFixed(2)}</strong></p>
              <div className="payment-methods">
                <button className="btn primary btn-block" disabled={paymentProcessing} onClick={() => handleSimulatePayment('card')}>
                  {paymentProcessing ? '● Processing...' : '💳 Pay with Card'}
                </button>
                <button className="btn btn-block" disabled={paymentProcessing} onClick={() => handleSimulatePayment('upi')}>
                  {paymentProcessing ? '● Processing...' : '📱 Pay with UPI'}
                </button>
                <button className="btn btn-block" disabled={paymentProcessing} onClick={() => handleSimulatePayment('cod')}>
                  {paymentProcessing ? '● Processing...' : '🏠 Cash on Delivery'}
                </button>
              </div>
              <button className="btn ghost btn-block" style={{ marginTop: 12 }} onClick={closePayment}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
