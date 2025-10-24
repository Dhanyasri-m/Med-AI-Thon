import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AddMedicalDataForAppoiments = () => {
  const unique_id = localStorage.getItem("selectedUID");

  const [form, setForm] = useState({
    blood_pressure: "",
    pulse_rate: "",
    weight: "",
    height: "",
    temperature: "",
    respiratory_rate: "",
  });

  const handleSubmit = async () => {
    try {
      await axios.put("http://127.0.0.1:5000/update_appointment_vitals", {
        unique_id,
        ...form,
      });
      alert("✅ Medical data updated successfully for Appointment!");
      window.location.href = "/view-appointments";
    } catch (err) {
      alert("❌ Failed to update data");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fff4, #c6f6d5)",
    paddingTop: "60px",
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    padding: "30px",
    background: "white",
    width: "500px",
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={containerStyle}>
      <div style={cardStyle}>
        <h3 className="text-center text-success fw-bold mb-3">🩺 Add Medical Data</h3>
        <p className="text-center text-muted mb-4">Patient ID: {unique_id}</p>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.replaceAll("_", " ").toUpperCase()}
            className="form-control mb-3"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <button
          className="btn btn-success w-100 fw-semibold"
          onClick={handleSubmit}
        >
          Save Medical Data
        </button>
      </div>
    </div>
  );
};

export default AddMedicalDataForAppoiments;
