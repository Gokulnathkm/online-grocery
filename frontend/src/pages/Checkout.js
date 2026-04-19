import React, { useState } from "react";
import { useCart } from '../context/CartContext';
import { useHistory } from 'react-router-dom';
import Navbar from "../components/Navbar";

const CheckoutPage = () => {
  const { cart, placeOrder } = useCart();
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    address: "",
    payment: "Cash on Delivery",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isCOD = form.payment && form.payment.toLowerCase().includes('cash');
    const summary = await placeOrder(form, { paid: !isCOD });
    if (summary) history.push('/order-confirmation', { order: summary });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Navbar />
      <div className="checkout-page">
        <h1>📦 Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <textarea
              name="address"
              placeholder="Enter your delivery address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select name="payment" value={form.payment} onChange={handleChange}>
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Credit/Debit Card</option>
            </select>
          </div>

          <div className="checkout-total">
            Total: ₹{total.toFixed(2)}
          </div>

          <button type="submit" className="btn primary btn-block" style={{ padding: '14px 20px', fontSize: 16 }}>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
