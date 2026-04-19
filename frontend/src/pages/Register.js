import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { registerUser } from "../mockApi";

function Register() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, role: "customer" });
      if (!res?.success) {
        setError(res?.msg || "Registration failed");
        return;
      }
      alert("Registration successful! Please login.");
      history.push("/");
    } catch (err) {
      setError((err && err.message) || "Network error. Please check the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">📝</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join FreshMart for fresh groceries delivered fast</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <button type="submit" className="btn primary btn-block" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-links">
          Already registered? <Link to="/">Sign in</Link>
        </div>
        <div className="auth-links">
          Shop owner? <Link to="/admin/register">Admin Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
