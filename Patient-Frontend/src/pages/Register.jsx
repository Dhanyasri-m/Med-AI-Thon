import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    phone: "",
    aadhaar: "",
    city: "",
    state: "",
    address: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/register", form);
      alert(`${res.data.message}\nYour Unique ID: ${res.data.unique_id}`);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  const cardStyle = {
    width: "480px",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    background: "white",
  };

  const containerStyle = {
    height: "100vh",
    background: "linear-gradient(135deg, #a8edea, #fed6e3)",
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
          🩺 Patient Registration
        </h3>

        {[
          { key: "name", label: "Full Name" },
          { key: "age", label: "Age" },
          { key: "sex", label: "Sex (Male/Female/Other)" },
          { key: "phone", label: "Phone Number" },
          { key: "aadhaar", label: "Aadhaar Number" },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "address", label: "Address" },
          { key: "password", label: "Password" },
        ].map((field) => (
          <input
            key={field.key}
            type={field.key === "password" ? "password" : "text"}
            placeholder={field.label}
            className="form-control"
            style={inputStyle}
            value={form[field.key]}
            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
          />
        ))}

        <button
          onClick={handleRegister}
          className="btn btn-success w-100 mt-2"
          style={btnStyle}
        >
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/" className="text-decoration-none fw-semibold text-primary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
