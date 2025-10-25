import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const DateAndTime = () => {
  const [appointment, setAppointment] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in patient UID
  const unique_id = localStorage.getItem("patientUID");

  useEffect(() => {
    if (!unique_id) {
      alert("⚠️ Please log in first!");
      window.location.href = "/";
      return;
    }

    const fetchDetails = async () => {
      try {
        const [appRes, emRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/get_patient_appointment/${unique_id}`),
          axios.get(`http://127.0.0.1:5000/get_patient_emergency/${unique_id}`),
        ]);

        setAppointment(appRes.data);
        setEmergency(emRes.data);
      } catch (err) {
        console.error("Error fetching date/time data", err);
        alert("⚠️ Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [unique_id]);

  // ✅ Loader
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>⏳ Loading your appointment details...</h4>
      </div>
    );
  }

  // ✅ Styles
  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    backgroundColor: "white",
    padding: "25px",
    maxWidth: "600px",
  };

  const formatDate = (dt) => (dt ? new Date(dt).toLocaleString() : "Not yet fixed");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        padding: "60px 0",
      }}
    >
      <div className="container text-center">
        <h2 className="fw-bold text-primary mb-5">📅 Your Scheduled Dates</h2>

        {/* Doctor Appointment Section */}
        <div className="card mb-5 mx-auto" style={cardStyle}>
          <h5 className="fw-bold text-success mb-3">🩺 Doctor Appointment</h5>
          {appointment && appointment.found ? (
            <>
              <p>
                <b>Doctor Consultation Time:</b>{" "}
                {formatDate(appointment.appointment_time)}
              </p>
              <p>
                <b>Reason:</b> {appointment.reason || "-"}
              </p>
              <p>
                <b>City:</b> {appointment.city || "-"}
              </p>
            </>
          ) : (
            <p className="text-muted">No appointment found.</p>
          )}
        </div>

        {/* Emergency Section */}
        <div className="card mx-auto" style={cardStyle}>
          <h5 className="fw-bold text-danger mb-3">🚑 Emergency Treatment</h5>
          {emergency && emergency.found ? (
            <>
              <p>
                <b>Treatment Time:</b>{" "}
                {formatDate(emergency.treatment_time)}
              </p>
              <p>
                <b>Emergency Type:</b> {emergency.emergency_type || "-"}
              </p>
              <p>
                <b>Immediate Treatment:</b>{" "}
                {emergency.immediate_treatment || "-"}
              </p>
            </>
          ) : (
            <p className="text-muted">No emergency record found.</p>
          )}
        </div>

        <button
          className="btn btn-outline-primary mt-5 fw-semibold"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DateAndTime;
