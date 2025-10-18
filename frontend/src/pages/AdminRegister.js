import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { registerUser } from "../mockApi";
import "../App.css";

function AdminRegister() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, role: 'admin' });
      if (!res.success) {
        alert(res.msg || 'Registration failed');
        return;
      }
      alert('Admin registration successful! Please login.');
      history.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Create Admin Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register as Admin"}</button>
        </form>
        <p>
          Already an admin? <Link to="/admin/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;


