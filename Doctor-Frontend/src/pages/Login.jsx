import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("⚠️ Please enter username and password");
      return;
    }

    // ✅ Dummy login (no backend check)
    localStorage.setItem("doctorName", username);
    window.location.href = "/dashboard";
  };

  const bgStyle = {
    height: "100vh",
    background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    padding: "30px",
    background: "white",
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={bgStyle}>
      <div style={cardStyle} className="w-25">
        <h3 className="text-center text-primary fw-bold mb-4">👨‍⚕️ Doctor Login</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100 fw-semibold"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
