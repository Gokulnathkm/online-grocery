import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { registerUser } from "../mockApi";
import "../styles.css";
import "../App.css";

function Register() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await registerUser({ name, email, password, role: 'customer' });
      if (!res?.success) {
        alert(res?.msg || 'Registration failed');
        return;
      }
      alert("Registration successful! Please login.");
      history.push("/");
    } catch (err) {
      alert((err && err.message) || 'Network error. Please check the server and try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6} 
            />
          </div>
          <button type="submit" className="login-btn">Register</button>
        </form>
        <div className="register-link">
          Already registered? <Link to="/">Login</Link>
        </div>
        <div className="register-link" style={{ marginTop: 8 }}>
          Shop owner? <Link to="/admin/register">Admin Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
