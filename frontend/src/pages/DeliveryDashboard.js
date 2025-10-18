import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';
import './DeliveryDashboard.css';
import { fetchOrders, updateOrderStatusApi } from '../mockApi';

const DeliveryDashboard = () => {
  const [agent, setAgent] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setAgent(current || { name: 'Delivery Agent', email: 'agent@example.com', role: 'delivery' });
    (async () => {
      try {
        const oRes = await fetchOrders();
        if (Array.isArray(oRes)) setOrders(oRes);
      } catch (e) {
        const storedOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        const storedAssignments = JSON.parse(localStorage.getItem('delivery_assignments') || '{}');
        const merged = storedOrders.map(o => ({ ...o, assignedTo: storedAssignments[o.id] || null }));
        setOrders(merged);
      }
    })();
  }, []);

  useEffect(() => {
    const minimal = orders.map(({ id, customer, total, status }) => ({ id, customer, total, status }));
    localStorage.setItem('admin_orders', JSON.stringify(minimal));
  }, [orders]);

  const unassigned = useMemo(() => orders.filter(o => (o.status === 'shipped' || o.status === 'paid') && !o.assignedTo), [orders]);
  const myOrders = useMemo(() => orders.filter(o => o.assignedTo === agent?.email), [orders, agent]);

  const stats = useMemo(() => {
    const assigned = myOrders.length;
    const inProgress = myOrders.filter(o => o.status === 'shipped' || o.status === 'picked_up' || o.status === 'out_for_delivery').length;
    const delivered = myOrders.filter(o => o.status === 'delivered').length;
    return { assigned, inProgress, delivered };
  }, [myOrders]);

  function claim(orderId) {
    if (!agent?.email) return;
    const next = orders.map(o => o.id === orderId ? { ...o, assignedTo: agent.email, status: o.status === 'paid' ? 'shipped' : o.status } : o);
    setOrders(next);
    const storedAssignments = JSON.parse(localStorage.getItem('delivery_assignments') || '{}');
    storedAssignments[orderId] = agent.email;
    localStorage.setItem('delivery_assignments', JSON.stringify(storedAssignments));
  }

  async function updateStatus(orderId, status) {
    const candidate = orders.find(o => o._id === orderId || o.orderId === orderId || o.id === orderId);
    if (candidate && candidate._id) {
      const updated = await updateOrderStatusApi(candidate._id, status);
      setOrders(orders.map(o => (o._id === updated._id) ? updated : o));
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    }
  }

  return (
    <div>
      <Navbar role={agent?.role || "delivery"} />
      <div className="admin-page">
        <div className="admin-header delivery-header">
          <div>
            <h2>Delivery Dashboard</h2>
            <p className="subtitle">Welcome{agent?.name ? `, ${agent.name}` : ''}. Track and update your deliveries.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Assigned</div>
            <div className="stat-value">{stats.assigned}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">In Progress</div>
            <div className="stat-value warning">{stats.inProgress}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Delivered</div>
            <div className="stat-value success">{stats.delivered}</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <h3>Unassigned Shipments</h3>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unassigned.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#777' }}>No unassigned shipments</td></tr>
                ) : (
                  unassigned.map(o => (
                    <tr key={o.id}>
                      <td>{o.orderId || o.id}</td>
                      <td>{o.customer}</td>
                      <td>{Number(o.total).toFixed(2)}</td>
                      <td>{o.status}</td>
                      <td><button className="btn primary" onClick={() => claim(o.id)}>Claim</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <h3>My Deliveries</h3>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#777' }}>No deliveries yet</td></tr>
                ) : (
                  myOrders.map(o => (
                    <tr key={o.id}>
                      <td>{o.orderId || o.id}</td>
                      <td>{o.customer}</td>
                      <td>{Number(o.total).toFixed(2)}</td>
                      <td>
                        <span className={
                          o.status === 'delivered' ? 'badge success' :
                          o.status === 'out_for_delivery' ? 'badge info' :
                          o.status === 'picked_up' ? 'badge warning' : 'badge'
                        }>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <select className="select" value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                          <option value="shipped">shipped</option>
                          <option value="picked_up">picked_up</option>
                          <option value="out_for_delivery">out_for_delivery</option>
                          <option value="delivered">delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
