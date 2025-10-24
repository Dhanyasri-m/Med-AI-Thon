import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", { phone, password });
      alert(`${res.data.message}\nWelcome ${res.data.name} (${res.data.unique_id})`);
      localStorage.setItem("patientPhone", res.data.phone);
      localStorage.setItem("uniqueId", res.data.unique_id);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const cardStyle = {
    width: "400px",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    background: "white",
  };

  const containerStyle = {
    height: "100vh",
    background: "linear-gradient(135deg, #c3cfe2, #c3e8e2)",
  };

  const inputStyle = {
    borderRadius: "8px",
    marginBottom: "12px",
    padding: "10px",
    fontSize: "15px",
  };

  const btnStyle = {
    borderRadius: "8px",
    fontSize: "16px",
    padding: "10px",
    fontWeight: "600",
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={containerStyle}>
      <div style={cardStyle}>
        <h3 className="text-center mb-4 fw-bold text-primary">
          🔑 Patient Login
        </h3>

        <input
          type="text"
          placeholder="Phone Number"
          className="form-control"
          style={inputStyle}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control"
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="btn btn-primary w-100 mt-2"
          style={btnStyle}
        >
          Login
        </button>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <a href="/register" className="text-decoration-none fw-semibold text-success">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
