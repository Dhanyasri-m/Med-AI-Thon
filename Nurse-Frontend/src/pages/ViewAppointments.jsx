import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get_all_appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => alert("⚠️ Failed to fetch appointments"));
  }, []);

  const handleFillData = (uid) => {
    localStorage.setItem("selectedUID", uid);
    window.location.href = "/add-appointment-data";
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    padding: "40px",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <div className="container">
        <h3 className="text-center text-success fw-bold mb-4">
          🩺 Patient Appointments
        </h3>

        {appointments.length === 0 ? (
          <p className="text-center text-muted">No appointments available.</p>
        ) : (
          appointments.map((a, index) => (
            <div className="card p-4" style={cardStyle} key={index}>
              <div className="row">
                <div className="col-md-8">
                  <h5 className="text-success fw-bold">{a.name}</h5>
                  <p className="mb-1"><b>Unique ID:</b> {a.unique_id}</p>
                  <p className="mb-1"><b>Age/Sex:</b> {a.age} / {a.sex}</p>
                  <p className="mb-1"><b>Phone:</b> {a.phone}</p>
                  <p className="mb-1"><b>City:</b> {a.city}</p>
                  <p className="mb-1"><b>Reason:</b> {a.reason}</p>
                  <p className="text-muted"><small>{a.date}</small></p>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-success fw-semibold"
                    onClick={() => handleFillData(a.unique_id)}
                  >
                    🩹 Fill Medical Data
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

export default ViewAppointments;
