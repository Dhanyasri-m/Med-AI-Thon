import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EmergencyForm = () => {
  const [form, setForm] = useState({
    unique_id: "",
    name: "",
    emergency_type: "",
    other_contact: "",
    immediate_treatment: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch patient info using unique_id
  useEffect(() => {
    const uniqueId = localStorage.getItem("uniqueId");
    if (uniqueId) {
      axios
        .get(`http://127.0.0.1:5000/get_patient/${uniqueId}`)
        .then((res) => {
          setForm((prev) => ({
            ...prev,
            unique_id: res.data.unique_id,
            name: res.data.name,
          }));
          setLoading(false);
        })
        .catch(() => alert("⚠️ Failed to load patient data"));
    } else {
      alert("⚠️ No patient ID found. Please log in again.");
      window.location.href = "/";
    }
  }, []);

  // ✅ Submit Emergency Case
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/add_emergency", form);
      alert(res.data.message);
      setForm({ ...form, emergency_type: "", other_contact: "", immediate_treatment: "" });
    } catch (err) {
      alert("❌ Failed to submit emergency record");
    }
  };

  // --- Internal CSS styles ---
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffdde1, #ee9ca7)",
    paddingTop: "100px",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    background: "white",
    padding: "30px",
    width: "600px",
  };

  const inputStyle = {
    borderRadius: "8px",
    marginBottom: "12px",
    padding: "10px",
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={containerStyle}>
        <h4>Loading patient data...</h4>
      </div>
    );

  return (
    <div className="d-flex justify-content-center align-items-center" style={containerStyle}>
      <div style={cardStyle}>
        <h3 className="text-center mb-4 fw-bold text-danger">
          🚨 Emergency Form
        </h3>

        {/* Auto-filled patient name */}
        <input
          type="text"
          className="form-control"
          style={inputStyle}
          placeholder="Patient Name"
          value={form.name}
          disabled
        />

        {/* Emergency type */}
        <input
          type="text"
          className="form-control"
          style={inputStyle}
          placeholder="Type of Emergency (e.g. Accident, Heart issue, etc.)"
          value={form.emergency_type}
          onChange={(e) => setForm({ ...form, emergency_type: e.target.value })}
        />

        {/* Other Contact Number */}
        <input
          type="text"
          className="form-control"
          style={inputStyle}
          placeholder="Other Contact Number"
          value={form.other_contact}
          onChange={(e) => setForm({ ...form, other_contact: e.target.value })}
        />

        {/* Immediate Treatment Provided */}
        <textarea
          className="form-control"
          rows="3"
          placeholder="Immediate Treatment Provided"
          style={inputStyle}
          value={form.immediate_treatment}
          onChange={(e) => setForm({ ...form, immediate_treatment: e.target.value })}
        ></textarea>

        <button
          onClick={handleSubmit}
          className="btn btn-danger w-100 fw-semibold"
          style={{ borderRadius: "8px", padding: "10px" }}
        >
          Submit Emergency Case
        </button>
      </div>
    </div>
  );
};

export default EmergencyForm;
