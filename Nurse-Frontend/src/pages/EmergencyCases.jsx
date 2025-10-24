import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EmergencyCases = () => {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get_all_emergencies")
      .then((res) => setEmergencies(res.data))
      .catch(() => alert("⚠️ Failed to fetch emergency cases"));
  }, []);

  const handleFillData = (uid) => {
    localStorage.setItem("selectedUID", uid);
    window.location.href = "/add-emergency-data";
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffe2e2, #ffc3a0)",
    padding: "40px",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <div className="container">
        <h3 className="text-center text-danger fw-bold mb-4">
          🚨 Emergency Cases
        </h3>

        {emergencies.length === 0 ? (
          <p className="text-center text-muted">No emergency cases reported.</p>
        ) : (
          emergencies.map((e, index) => (
            <div className="card p-4" style={cardStyle} key={index}>
              <div className="row">
                <div className="col-md-8">
                  <h5 className="text-danger fw-bold">{e.name}</h5>
                  <p className="mb-1"><b>Unique ID:</b> {e.unique_id}</p>
                  <p className="mb-1"><b>Age/Sex:</b> {e.age} / {e.sex}</p>
                  <p className="mb-1"><b>Emergency Type:</b> {e.emergency_type}</p>
                  <p className="mb-1"><b>Contact:</b> {e.other_contact}</p>
                  <p className="mb-1"><b>Immediate Treatment:</b> {e.immediate_treatment}</p>
                  <p className="text-muted"><small>{e.date}</small></p>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-danger fw-semibold"
                    onClick={() => handleFillData(e.unique_id)}
                  >
                    🩺 Fill Medical Data
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyCases;
