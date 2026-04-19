import React from "react";

const Modal = ({ product, onClose }) => {
  const handleCheckout = () => {
    alert(`Order placed for ${product.name} at ₹${product.price.toFixed(2)}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
        <div className="modal-header">
          <h3>Buy Now</h3>
          <button className="btn small" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ alignItems: 'center' }}>
          {product.image && (
            <img src={product.image} alt={product.name} className="buy-modal-img" />
          )}
          <h3 style={{ fontSize: 20 }}>{product.name}</h3>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-emerald)' }}>
            ₹{product.price.toFixed(2)}
          </p>
          <div className="modal-actions" style={{ justifyContent: 'center', width: '100%' }}>
            <button className="btn success" onClick={handleCheckout}>Checkout</button>
            <button className="btn danger" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
