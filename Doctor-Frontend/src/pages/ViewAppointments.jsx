import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedUID, setSelectedUID] = useState("");
  const [appointmentTime, setAppointmentTime] = useState(""); // ✅ fixed variable name

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get_all_appointments_doctor")
      .then((res) => setAppointments(res.data))
      .catch(() => alert("⚠️ Failed to load appointments"));
  }, []);

  const openModal = (uid) => {
    setSelectedUID(uid);
    setAppointmentTime("");
    const modalElement = document.getElementById("fixTimeModal");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const handleSave = async () => {
    if (!appointmentTime) return alert("⚠️ Please select a date & time");

    try {
      await axios.put("http://127.0.0.1:5000/update_appointment_time", {
        unique_id: selectedUID,
        appointment_time: appointmentTime, // ✅ FIXED key name
      });

      alert("✅ Appointment time fixed successfully!");

      const modalElement = document.getElementById("fixTimeModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      setAppointments((prev) =>
        prev.map((a) =>
          a.unique_id === selectedUID
            ? { ...a, appointment_time: appointmentTime } // ✅ update UI instantly
            : a
        )
      );

      setSelectedUID("");
    } catch {
      alert("❌ Failed to update appointment time");
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #bbdefb)",
      }}
    >
      <h3 className="text-center text-success fw-bold mb-5">
        🩺 Verified Appointments
      </h3>

      {appointments.length === 0 ? (
        <p className="text-center text-muted">No verified appointments yet.</p>
      ) : (
        appointments.map((a, index) => (
          <div
            key={index}
            className="card shadow-sm border-success mb-4"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body">
              <h5 className="fw-bold text-success">{a.name}</h5>
              <p><b>Unique ID:</b> {a.unique_id}</p>
              <p><b>Age:</b> {a.age} | <b>Sex:</b> {a.sex}</p>
              <p><b>Reason:</b> {a.reason}</p>
              <p><b>Phone:</b> {a.phone}</p>
              <p><b>City:</b> {a.city}</p>

              <div className="mt-2">
                <h6 className="fw-bold text-secondary">🧠 Nurse Vitals:</h6>
                <p>
                  <b>BP:</b> {a.blood_pressure || "-"} |{" "}
                  <b>Pulse:</b> {a.pulse_rate || "-"} |{" "}
                  <b>Temp:</b> {a.temperature || "-"}
                </p>
                <p>
                  <b>Weight:</b> {a.weight || "-"} kg |{" "}
                  <b>Height:</b> {a.height || "-"} cm |{" "}
                  <b>Resp:</b> {a.respiratory_rate || "-"}
                </p>
              </div>

              <p className="text-muted">
                <small>📅 {a.created_at}</small>
              </p>

              {a.appointment_time ? (
                <p className="text-success fw-semibold">
                  ⏰ Fixed for:{" "}
                  {new Date(a.appointment_time).toLocaleString()}
                </p>
              ) : (
                <button
                  className="btn btn-success fw-semibold"
                  onClick={() => openModal(a.unique_id)}
                >
                  Fix Appointment
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* ✅ MODAL */}
      <div
        className="modal fade"
        id="fixTimeModal"
        tabIndex="-1"
        aria-labelledby="fixTimeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="fixTimeModalLabel">
                Fix Appointment Time
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <p><b>Patient ID:</b> {selectedUID}</p>
              <input
                type="datetime-local"
                className="form-control"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-success" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointments;
