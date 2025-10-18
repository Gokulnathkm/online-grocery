// src/components/ProductCard.js
import React from 'react';
import { useCart } from '../context/CartContext';
import { useHistory } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, clearCart } = useCart();
  const history = useHistory();

  const handleAdd = () => addToCart(product, 1);

  const handleBuyNow = () => {
    // Replace cart with single product for Buy Now flow
    clearCart();
    addToCart(product, 1);
    history.push('/checkout');
  };

  return (
    <div className="product-card">
      <div className="prod-img-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <h3>{product.name}</h3>
      <p className="prod-price">{product.displayPrice}</p>
      <div className="prod-actions">
        <button className="btn primary" onClick={handleAdd}>Add to Cart</button>
        <button className="btn outline" onClick={handleBuyNow}>Buy Now</button>
      </div>
    </div>
  );
};

export default ProductCard;
