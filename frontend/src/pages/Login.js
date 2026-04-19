import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { loginUser } from "../mockApi";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { role, name } = res.user;
      localStorage.setItem("currentUser", JSON.stringify({ name, email, role }));

      if (role === "admin") history.push("/admin");
      else if (role === "delivery") history.push("/delivery");
      else history.push("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🛒</div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your FreshMart account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-links">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
        <div className="auth-links">
          Shop owner? <Link to="/admin/login">Admin Portal</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
