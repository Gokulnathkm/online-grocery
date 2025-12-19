import { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ SUCCESS HANDLING (MATCHES App.js)
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ role: "admin" })
      );

      // ✅ SINGLE redirect (correct)
      history.push("/admin");

    } catch (err) {
      setError("Server unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <form className="admin-card" onSubmit={handleLogin}>
        <h2>Admin Portal</h2>
        <p className="subtitle">Sign in to manage the platform</p>

        {error && <div className="error-msg">{error}</div>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="footer-text">
          New admin?{" "}
          <span onClick={() => history.push("/admin/register")}>
            Register
          </span>
        </div>
      </form>
    </div>
  );
}
