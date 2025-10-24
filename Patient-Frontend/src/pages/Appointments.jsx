import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Appointments = () => {
  const [form, setForm] = useState({
    unique_id: "",
    name: "",
    age: "",
    sex: "",
    phone: "",
    aadhaar: "",
    city: "",
    state: "",
    address: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch patient details using unique_id from localStorage
  useEffect(() => {
    const uniqueId = localStorage.getItem("uniqueId");
    if (uniqueId) {
      axios
        .get(`http://127.0.0.1:5000/get_patient/${uniqueId}`)
        .then((res) => {
          setForm((prev) => ({ ...prev, ...res.data }));
          setLoading(false);
        })
        .catch(() => alert("⚠️ Failed to load patient data"));
    } else {
      alert("⚠️ No patient ID found. Please log in again.");
      window.location.href = "/";
    }
  }, []);

  // ✅ Submit appointment
  const handleSubmit = async () => {
    try {
      const payload = {
        unique_id: form.unique_id,
        reason: form.reason,
      };
      const res = await axios.post("http://127.0.0.1:5000/add_appointment", payload);
      alert(res.data.message);
      setForm({ ...form, reason: "" }); // reset only the reason field
    } catch (err) {
      alert("❌ Failed to submit appointment");
    }
  };

  // --- Inline Styling ---
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3e7e9, #e3eeff)",
    paddingTop: "100px",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    background: "white",
    padding: "30px",
    width: "600px",
  };

  const inputStyle = {
    borderRadius: "8px",
    marginBottom: "12px",
    padding: "10px",
  };

  // --- Loading View ---
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={containerStyle}>
        <h4>Loading patient data...</h4>
      </div>
    );

  // --- Render Form ---
  return (
    <div className="d-flex justify-content-center align-items-center" style={containerStyle}>
      <div style={cardStyle}>
        <h3 className="text-center mb-4 fw-bold text-success">
          📅 Book Appointment
        </h3>

        {/* ✅ Show Unique ID */}
        <input
          type="text"
          className="form-control"
          style={inputStyle}
          value={form.unique_id}
          placeholder="Unique ID"
          disabled
        />

        {/* ✅ Patient Info (auto-filled) */}
        {[
          { key: "name", label: "Full Name" },
          { key: "age", label: "Age" },
          { key: "sex", label: "Sex (Male/Female/Other)" },
          { key: "phone", label: "Phone Number" },
          { key: "aadhaar", label: "Aadhaar Number" },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "address", label: "Address" },
        ].map((field) => (
          <input
            key={field.key}
            type="text"
            className="form-control"
            style={inputStyle}
            placeholder={field.label}
            value={form[field.key]}
            disabled
          />
        ))}

        {/* ✅ Reason input */}
        <textarea
          className="form-control"
          rows="3"
          placeholder="Reason for Appointment"
          style={inputStyle}
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        ></textarea>

        {/* ✅ Submit Button */}
        <button
          onClick={handleSubmit}
          className="btn btn-success w-100 fw-semibold"
          style={{ borderRadius: "8px", padding: "10px" }}
        >
          Submit Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointments;
