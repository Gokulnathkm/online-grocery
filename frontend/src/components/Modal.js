import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useHistory } from "react-router-dom";

const Modal = ({ product, onClose }) => {
  const { placeOrder } = useCart();
  const history = useHistory();
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSimulatePayment = async (method = 'card') => {
    setPaymentProcessing(true);
    await new Promise(r => setTimeout(r, 900));
    setPaymentProcessing(false);

    const isCOD = method === 'cod';
    const dummyForm = { name: "Customer", address: "N/A", payment: method };
    const summary = await placeOrder(dummyForm, { paid: !isCOD, singleProduct: product });
    
    onClose();
    if (summary) {
      history.push('/order-confirmation', { order: summary });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
        <div className="modal-header">
          <h3>💳 Payment</h3>
          <button className="btn small" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ alignItems: 'center' }}>
          {product.image && (
            <img src={product.image} alt={product.name} className="buy-modal-img" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
          )}
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>{product.name}</h3>
          <p>Total to pay: <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem' }}>₹{product.price.toFixed(2)}</strong></p>
          <div className="payment-methods" style={{ width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <button className="btn ghost btn-block" style={{ marginTop: 12 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
