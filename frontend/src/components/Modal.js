import React from "react";
import "./Modal.css";

const Modal = ({ product, onClose }) => {
  const handleCheckout = () => {
    alert(`Order placed for ₹{product.name} at ₹{product.price.toFixed(2)}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Buy Now</h2>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>Price: ₹{product.price.toFixed(2)}</p>
        <div className="modal-buttons">
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          <button className="close-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
