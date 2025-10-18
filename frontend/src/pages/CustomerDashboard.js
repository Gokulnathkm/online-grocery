import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "./CustomerDashboard.css";
import sharedProducts from "../data/products";

const CustomerDashboard = () => {
  const { addToCart, cart, totalPrice } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance"); // relevance | name | price
  const [sortDir, setSortDir] = useState("asc"); // asc | desc
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const products = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('admin_products') || 'null');
    if (!Array.isArray(stored)) return sharedProducts;
    // Merge: overlay any admin-edited products by id, but keep all shared items
    const byId = new Map(stored.map(p => [p.id, p]));
    const merged = sharedProducts.map(sp => byId.get(sp.id) ? { ...sp, ...byId.get(sp.id) } : sp);
    // Include any brand new products added by admin (ids not in shared)
    stored.forEach(p => { if (!merged.find(m => m.id === p.id)) merged.push(p); });
    return merged;
  }, []);

  const visibleProducts = useMemo(() => {
    let list = [...products];

    // Filter by search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    // Filter by price range
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    if (min !== null && !Number.isNaN(min)) {
      list = list.filter(p => p.price >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter(p => p.price <= max);
    }

    // Sort
    if (sortBy !== "relevance") {
      list.sort((a, b) => {
        let cmp = 0;
        if (sortBy === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortBy === "price") {
          cmp = a.price - b.price;
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return list;
  }, [products, searchQuery, sortBy, sortDir, minPrice, maxPrice]);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);

  return (
    <div>
      <Navbar />
      <div className="dashboard-header">
        <h1>Grocery Store</h1>
        <div className="cart-summary">
          <span>Items in Cart: {cart.length}</span>
          <span>Total: ₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="filters-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="price-range">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Sort: Relevance</option>
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
          </select>
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {visibleProducts.length === 0 && (
          <div className="empty-state">No products match your filters.</div>
        )}
        {visibleProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
            <p>₹{product.price.toFixed(2)}</p>
            <div className="product-buttons">
              <button className="add-cart" onClick={() => addToCart(product)}>Add to Cart</button>
              <button className="buy-now" onClick={() => handleBuyNow(product)}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <Modal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default CustomerDashboard;
