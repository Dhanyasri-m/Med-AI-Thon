import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      alert("⚠️ Please enter username and password");
      return;
    }

    // ✅ Just store nurse name locally (no backend)
    localStorage.setItem("nurseName", username);
    window.location.href = "/dashboard";
  };

  const pageStyle = {
    height: "100vh",
    background: "linear-gradient(135deg, #c3cfe2, #f5f7fa)",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    padding: "30px",
    background: "white",
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={pageStyle}>
      <div style={cardStyle} className="w-25">
        <h3 className="text-center text-primary fw-bold mb-4">👩‍⚕️ Nurse Login</h3>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
