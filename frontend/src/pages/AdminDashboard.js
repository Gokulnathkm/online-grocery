import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import sharedProducts from '../data/products';

import {
  fetchProducts,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProductApi,
  fetchOrders,
  fetchAgents,
  assignOrderApi,
  fetchUsers,
  adjustProductStock,
  uploadProductImage
} from '../mockApi';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState({});

  const [users, setUsers] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);

  // Load data from API; fallback to seed/localStorage on failure
  useEffect(() => {
    const seedProducts = sharedProducts.map(p => ({ id: p.id, name: p.name, stock: 100, price: p.price, image: p.image }));
    const seedOrders = [
      { id: 'ORD-1001', customer: 'Alice', total: 650, status: 'paid' },
      { id: 'ORD-1002', customer: 'Bob', total: 320, status: 'pending' },
      { id: 'ORD-1003', customer: 'Charlie', total: 990, status: 'shipped' }
    ];
    const seedAgents = [
      { id: 'AG-1', name: 'Ravi Kumar', email: 'ravi@delivery.com' },
      { id: 'AG-2', name: 'Prem', email: 'prem@delivery.com' },
      { id: 'AG-3', name: 'Rahul', email: 'rahul@delivery.com' }
    ];
    async function load() {
      try {
        const [pRes, oRes, aRes, uRes] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchAgents(),
          fetchUsers()
        ]);

        if (Array.isArray(pRes)) setProducts(pRes.map(p => ({ ...p, id: p._id })));
        if (Array.isArray(oRes)) setOrders(oRes.map(o => ({
          ...o,
          id: o.orderId || o.id,
          customer: o.customerName || o.customer || o.customerEmail || 'Unknown',
          orderDate: o.createdAt || o.created_at || o.orderDate || o.date || null
        })));
        if (Array.isArray(aRes) && aRes.length) setAgents(aRes);
        else setAgents(seedAgents);
        if (Array.isArray(uRes)) setUsers(uRes.map(u => ({ ...u, id: u._id })));
      } catch (e) {
        console.error('Error loading data from API, falling back to local storage:', e);
        const storedProducts = JSON.parse(localStorage.getItem('admin_products') || 'null');
        const storedOrders = JSON.parse(localStorage.getItem('admin_orders') || 'null');
        const storedAgents = JSON.parse(localStorage.getItem('delivery_agents') || 'null');
        const storedAssignments = JSON.parse(localStorage.getItem('delivery_assignments') || '{}');
        if (Array.isArray(storedProducts)) {
          const byId = new Map(storedProducts.map(p => [p.id, p]));
          const merged = seedProducts.map(sp => byId.get(sp.id) ? { ...sp, ...byId.get(sp.id) } : sp);
          storedProducts.forEach(p => { if (!merged.find(m => m.id === p.id)) merged.push(p); });
          setProducts(merged);
          localStorage.setItem('admin_products', JSON.stringify(merged));
        } else {
          setProducts(seedProducts);
          localStorage.setItem('admin_products', JSON.stringify(seedProducts));
        }
        setOrders(Array.isArray(storedOrders) ? storedOrders : seedOrders);
        if (Array.isArray(storedAgents)) {
          setAgents(storedAgents);
        } else {
          setAgents(seedAgents);
          localStorage.setItem('delivery_agents', JSON.stringify(seedAgents));
        }
        setAssignments(storedAssignments && typeof storedAssignments === 'object' ? storedAssignments : {});
      }
    }
    load();
  }, []);

  useEffect(() => {
    try { localStorage.setItem('admin_products', JSON.stringify(products)); } catch { }
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('admin_orders', JSON.stringify(orders)); } catch { }
  }, [orders]);

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + Number(o.total || 0), 0), [orders]);
  const lowStockCount = useMemo(() => products.filter(p => Number(p.stock) <= 10).length, [products]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => `${p.name}`.toLowerCase().includes(q));
  }, [products, productSearch]);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o => `${o.id} ${o.customer} ${o.status}`.toLowerCase().includes(q));
  }, [orders, orderSearch]);

  function formatDateFrom(rec) {
    if (!rec) return 'Unknown';
    if (typeof rec === 'string' || typeof rec === 'number') {
      try { return new Date(rec).toLocaleDateString(); } catch (e) { return 'Unknown'; }
    }
    const possible = rec.createdAt || rec.created_at || rec.orderDate || rec.order_date || rec.date;
    if (possible) {
      try { return new Date(possible).toLocaleDateString(); } catch (e) { /* fallthrough */ }
    }
    if (rec._id && typeof rec._id === 'string' && rec._id.length >= 8) {
      try { return new Date(parseInt(rec._id.substring(0, 8), 16) * 1000).toLocaleDateString(); } catch (e) { /* fallthrough */ }
    }
    if (rec.id && typeof rec.id === 'string' && rec.id.length >= 8) {
      try { return new Date(parseInt(rec.id.substring(0, 8), 16) * 1000).toLocaleDateString(); } catch (e) { /* fallthrough */ }
    }
    return 'Unknown';
  }

  function openNewProductModal() {
    setEditingProduct({ id: null, name: '', stock: 0, price: 0 });
    setShowProductModal(true);
  }
  function openEditProductModal(p) {
    setEditingProduct({ ...p });
    setShowProductModal(true);
  }
  function closeProductModal() {
    setShowProductModal(false);
    setEditingProduct(null);
    setSelectedImageFile(null);
  }
  async function saveProduct(e) {
    e.preventDefault();
    if (!editingProduct.name) return;
    const stock = Number(editingProduct.stock);
    const price = Number(editingProduct.price);
    if (Number.isNaN(stock) || Number.isNaN(price)) return;

    try {
      let finalImageUrl = editingProduct.image || '';

      if (selectedImageFile) {
        const uploadRes = await uploadProductImage(selectedImageFile);
        if (uploadRes && uploadRes.imageUrl) {
          const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5050";
          if (uploadRes.imageUrl.startsWith('/')) {
            finalImageUrl = `${API_BASE}${uploadRes.imageUrl}`;
          } else {
            finalImageUrl = uploadRes.imageUrl;
          }
        }
      }

      const productPayload = { name: editingProduct.name, stock, price, image: finalImageUrl };

      if (editingProduct._id || (typeof editingProduct.id === 'string' && editingProduct.id.length > 16)) {
        const updated = await apiUpdateProduct(editingProduct._id || editingProduct.id, productPayload);
        setProducts(products.map(p => (p._id === updated._id || p.id === updated._id) ? { ...updated, id: updated._id } : p));
      } else if (editingProduct.id == null) {
        const created = await apiCreateProduct(productPayload);
        setProducts([{ ...created, id: created._id }, ...products]);
      } else {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
      }
      closeProductModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.message || 'Unknown error'));
    }
  }
  function deleteProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    if (typeof id === 'string' && id.length > 16) {
      deleteProductApi(id).finally(() => {
        setProducts(products.filter(p => (p._id || p.id) !== id));
      });
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  }

  async function assignAgentToOrder(orderId, agentEmail) {
    const candidate = orders.find(o => (o.orderId === orderId) || (o.id === orderId) || (o._id === orderId));
    if (candidate && candidate._id) {
      const updated = await assignOrderApi(candidate._id, agentEmail || null);
      setOrders(orders.map(o => (o._id === updated._id) ? { ...o, ...updated, id: updated.orderId || updated.id, customer: o.customer || updated.customerName || updated.customer || 'Unknown' } : o));
    }
    const nextAssignments = { ...assignments, [orderId]: agentEmail };
    setAssignments(nextAssignments);
    try { localStorage.setItem('delivery_assignments', JSON.stringify(nextAssignments)); } catch { }
  }

  function exportCsv(rows, filename) {
    if (!rows.length) return;
    const header = Object.keys(rows[0]);
    const csv = [header.join(',')].concat(rows.map(r => header.map(k => JSON.stringify(r[k] ?? '')).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const reports = useMemo(() => [
    { id: 'RPT-SEP-SALES', name: 'September Sales', generatedAt: '2025-09-25' },
    { id: 'RPT-INV-STOCK', name: 'Inventory Snapshot', generatedAt: '2025-09-24' }
  ], []);

  const getRoleBadge = (role) => {
    if (role === 'admin') return 'role-admin';
    if (role === 'delivery') return 'role-delivery';
    return 'role-customer';
  };

  return (
    <div>
      <Navbar role="admin" />
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>📊 Admin Dashboard</h1>
            <p className="page-header-subtitle">Manage users, products, orders and reports.</p>
          </div>
          <div className="card-actions">
            <button className="btn primary" onClick={openNewProductModal}>+ Add Product</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Low Stock (≤10)</div>
            <div className="stat-value warning">{lowStockCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Revenue (₹)</div>
            <div className="stat-value success">{totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="tabs">
          <button className={activeTab === 'users' ? 'tab active' : 'tab'} onClick={() => setActiveTab('users')}>Users</button>
          <button className={activeTab === 'products' ? 'tab active' : 'tab'} onClick={() => setActiveTab('products')}>Products</button>
          <button className={activeTab === 'orders' ? 'tab active' : 'tab'} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={activeTab === 'reports' ? 'tab active' : 'tab'} onClick={() => setActiveTab('reports')}>Reports</button>
        </div>

        {/* ─── Users Tab ─── */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h3>👥 Users</h3>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role !== 'admin').map((u) => (
                    <tr key={u.id || u._id}>
                      <td className="cell-id">{u.id || u._id}</td>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${getRoleBadge(u.role)}`}>{u.role}</span></td>
                      <td>
                        <button className="btn small primary" onClick={(e) => {
                          e.stopPropagation();
                          const regDate = formatDateFrom(u);
                          setTimeout(() => {
                            alert(`User Details:\n\nID: ${u.id || u._id}\nName: ${u.name}\nEmail: ${u.email}\nRole: ${u.role}\n\nRegistration Date: ${regDate}`);
                          }, 50);
                        }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Products Tab ─── */}
        {activeTab === 'products' && (
          <div className="card">
            <div className="card-header">
              <h3>📦 Products</h3>
              <div className="card-actions">
                <input className="input" placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} style={{ minWidth: 200 }} />
                <button className="btn" onClick={() => exportCsv(filteredProducts, 'products.csv')}>Export CSV</button>
                <button className="btn primary" onClick={openNewProductModal}>+ New Product</button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Stock</th>
                    <th>Price (₹)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="cell-id">{p.id}</td>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)' }}>N/A</div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button className="btn small" onClick={async () => {
                            try {
                              const updated = await adjustProductStock(p._id || p.id, -1);
                              setProducts(products.map(x => (x._id === updated._id || x.id === updated._id) ? { ...updated, id: updated._id } : x));
                            } catch (err) { alert(err.message || 'Could not decrement stock'); }
                          }}>−</button>
                          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{p.stock}</span>
                          <button className="btn small" onClick={async () => {
                            try {
                              const updated = await adjustProductStock(p._id || p.id, 1);
                              setProducts(products.map(x => (x._id === updated._id || x.id === updated._id) ? { ...updated, id: updated._id } : x));
                            } catch (err) { alert(err.message || 'Could not increment stock'); }
                          }}>+</button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>₹{p.price.toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn small primary" onClick={() => openEditProductModal(p)}>Edit</button>
                          <button className="btn small danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Orders Tab ─── */}
        {activeTab === 'orders' && (
          <div className="card">
            <div className="card-header">
              <h3>📋 Orders</h3>
              <div className="card-actions">
                <input className="input" placeholder="Search orders..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} style={{ minWidth: 200 }} />
                <button className="btn" onClick={() => exportCsv(filteredOrders, 'orders.csv')}>Export CSV</button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total (₹)</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <React.Fragment key={o.id}>
                      <tr>
                        <td className="cell-id">{o.orderId || o.id}</td>
                        <td style={{ fontWeight: 500 }}>{o.customer}</td>
                        <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>₹{Number(o.total).toFixed(2)}</td>
                        <td>
                          <select
                            value={assignments[o.orderId || o.id] || o.assignedTo || ''}
                            onChange={(e) => assignAgentToOrder(o.orderId || o.id, e.target.value)}
                            style={{ maxWidth: 200 }}
                          >
                            <option value="">Unassigned</option>
                            {agents.map(a => (
                              <option key={a.email} value={a.email}>{a.name}{a.city ? ` (${a.city})` : ''}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn small primary" onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const assigned = assignments[o.orderId || o.id] || o.assignedTo || 'Unassigned';
                              const items = (o.items || []).map(it => `${it.name} x${it.quantity} @ ₹${it.price}`).join('\n');
                              setTimeout(() => {
                                alert(`Order Details:\n\nOrder ID: ${o.orderId || o.id}\nCustomer: ${o.customer}\nTotal: ₹${Number(o.total).toFixed(2)}\nAssigned To: ${assigned}\n\nItems:\n${items}\n\nOrder Date: ${formatDateFrom(o)}`);
                              }, 50);
                            }}>View</button>
                            <button className="btn small" onClick={() => {
                              const id = o.orderId || o.id;
                              setExpandedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                            }}>Items</button>
                          </div>
                        </td>
                      </tr>
                      {expandedOrders.includes(o.orderId || o.id) && (
                        <tr className="order-items-row">
                          <td colSpan={5}>
                            <div className="order-items-container">
                              <table className="order-items-table">
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price (₹)</th>
                                    <th>Subtotal (₹)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(o.items || []).map((it, idx) => (
                                    <tr key={idx}>
                                      <td>{it.name}</td>
                                      <td>{it.quantity}</td>
                                      <td>₹{Number(it.price).toFixed(2)}</td>
                                      <td>₹{(Number(it.price) * Number(it.quantity)).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Reports Tab ─── */}
        {activeTab === 'reports' && (
          <div className="card">
            <div className="card-header">
              <h3>📈 Reports</h3>
              <div className="card-actions">
                <button className="btn">Generate Report</button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Name</th>
                    <th>Generated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td className="cell-id">{r.id}</td>
                      <td style={{ fontWeight: 500 }}>{r.name}</td>
                      <td>{r.generatedAt}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn small primary" onClick={(e) => {
                            e.stopPropagation();
                            setTimeout(() => {
                              alert(`Report Details:\n\nReport ID: ${r.id}\nName: ${r.name}\nGenerated At: ${r.generatedAt}\n\nReport Summary:\n- Total Records: 150\n- Status: Generated\n- Format: PDF/CSV\n- Size: 2.5 MB`);
                            }, 50);
                          }}>View</button>
                          <button className="btn small success" onClick={(e) => {
                            e.stopPropagation();
                            setTimeout(() => alert(`Downloading report: ${r.name}`), 50);
                          }}>Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── Product Modal ─── */}
      {showProductModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct?.id == null ? '+ Add Product' : '✏️ Edit Product'}</h3>
              <button className="btn small" onClick={closeProductModal}>✕</button>
            </div>
            <form onSubmit={saveProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input value={editingProduct?.name || ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedImageFile(e.target.files[0]);
                    }
                  }}
                  style={{ padding: 8 }}
                />
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0' }}>OR</div>
                <input
                  placeholder="Image URL"
                  value={editingProduct?.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" value={editingProduct?.stock ?? 0} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" step="0.01" value={editingProduct?.price ?? 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeProductModal}>Cancel</button>
                <button type="submit" className="btn primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
