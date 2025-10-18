import React from 'react';
import '../styles.css';

const Cart = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart">
      <h3>Shopping Cart</h3>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, idx) => (
            <li key={idx}>
              <span>{item.name} - ₹{item.price}</span>
              <button onClick={() => removeFromCart(item)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h4>Total: ₹{total}</h4>
    </div>
  );
};

export default Cart;
