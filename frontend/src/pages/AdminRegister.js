import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { registerUser } from "../mockApi";

function AdminRegister() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password, role: "admin" });
      alert("Admin registered successfully");
      history.push("/admin/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🏪</div>
        <h2 className="auth-title">Admin Registration</h2>
        <p className="auth-subtitle">Create your shop admin account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn primary btn-block" disabled={loading}>
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <div className="auth-links">
          Already an admin? <Link to="/admin/login">Sign in</Link>
        </div>
        <div className="auth-links">
          Customer? <Link to="/register">Customer Register</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
