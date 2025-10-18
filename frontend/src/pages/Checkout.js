import React, { useState } from "react";
import { useCart } from '../context/CartContext';
import { useHistory } from 'react-router-dom';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="payment"
          value={form.payment}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Cash on Delivery</option>
          <option>UPI</option>
          <option>Credit/Debit Card</option>
        </select>

        <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
