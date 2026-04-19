import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import sharedProducts from "../data/products";

const CustomerDashboard = () => {
  const { addToCart, cart, totalPrice } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [sortDir, setSortDir] = useState("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const products = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('admin_products') || 'null');
    if (!Array.isArray(stored)) return sharedProducts;
    const byId = new Map(stored.map(p => [p.id, p]));
    const merged = sharedProducts.map(sp => byId.get(sp.id) ? { ...sp, ...byId.get(sp.id) } : sp);
    stored.forEach(p => { if (!merged.find(m => m.id === p.id)) merged.push(p); });
    return merged;
  }, []);

  const visibleProducts = useMemo(() => {
    let list = [...products];
    const q = searchQuery.trim().toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));

    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    if (min !== null && !Number.isNaN(min)) list = list.filter(p => p.price >= min);
    if (max !== null && !Number.isNaN(max)) list = list.filter(p => p.price <= max);

    if (sortBy !== "relevance") {
      list.sort((a, b) => {
        let cmp = 0;
        if (sortBy === "name") cmp = a.name.localeCompare(b.name);
        else if (sortBy === "price") cmp = a.price - b.price;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [products, searchQuery, sortBy, sortDir, minPrice, maxPrice]);

  const handleBuyNow = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <div>
      <Navbar />
      <div className="dashboard-header">
        <div>
          <h1>🥬 Grocery Store</h1>
        </div>
        <div className="cart-summary">
          <span>Items: <strong>{cart.length}</strong></span>
          <span>Total: <strong>₹{totalPrice.toFixed(2)}</strong></span>
        </div>
      </div>

      <div className="filters-bar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="price-range">
          <input type="number" min="0" inputMode="numeric" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span>—</span>
          <input type="number" min="0" inputMode="numeric" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Sort: Relevance</option>
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
          </select>
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
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
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-image-placeholder">No Image</div>
              )}
            </div>
            <div className="product-card-body">
              <h3>{product.name}</h3>
              <p>₹{product.price.toFixed(2)}</p>
              <div className="product-buttons">
                <button className="btn primary small" onClick={() => addToCart(product)}>Add to Cart</button>
                <button className="btn success small" onClick={() => handleBuyNow(product)}>Buy Now</button>
              </div>
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
