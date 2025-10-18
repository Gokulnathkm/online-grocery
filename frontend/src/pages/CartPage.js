import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useHistory } from 'react-router-dom';
import "./CartPage.css";

function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, placeOrder } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const history = useHistory();

  if (!cart || cart.length === 0) {
    return <div className="empty-cart">Your cart is empty.</div>;
  }

  const openPayment = () => setShowPayment(true);
  const closePayment = () => setShowPayment(false);


  const handleSimulatePayment = async (method = 'card') => {
    // Simulate a tiny delay for payment processing
    setPaymentProcessing(true);
    await new Promise(r => setTimeout(r, 900));
    setPaymentProcessing(false);

    // On success, place order. COD should create order with pending status (paid = false)
    const isCOD = method === 'cod';
    const dummyForm = { name: "Customer", address: "N/A", payment: method };
    const summary = await placeOrder(dummyForm, { paid: !isCOD });
    closePayment();
    if (summary) {
      history.push('/order-confirmation', { order: summary });
    } else {
      // fallback: simple alert
      alert('Order placed (no summary)');
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <span>{item.name} (₹{item.price}) x {item.quantity}</span>
            <div>
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="cart-total">Total: ₹{totalPrice}</h3>
      <button className="buy-now-btn" onClick={openPayment}>Proceed to Payment</button>

      {showPayment && (
        <div className="payment-overlay" onClick={closePayment}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Payment</h3>
            <p>Total to pay: <strong>₹{totalPrice}</strong></p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn primary" disabled={paymentProcessing} onClick={() => handleSimulatePayment('card')}>{paymentProcessing ? 'Processing...' : 'Pay with Card'}</button>
              <button className="btn" disabled={paymentProcessing} onClick={() => handleSimulatePayment('upi')}>{paymentProcessing ? 'Processing...' : 'Pay with UPI'}</button>
              <button className="btn" disabled={paymentProcessing} onClick={() => handleSimulatePayment('cod')}>{paymentProcessing ? 'Processing...' : 'Cash on Delivery'}</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={closePayment}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
