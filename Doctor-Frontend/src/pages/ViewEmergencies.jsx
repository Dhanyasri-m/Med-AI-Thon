import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const ViewEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedUID, setSelectedUID] = useState("");
  const [treatmentTime, setTreatmentTime] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get_all_emergencies_doctor")
      .then((res) => setEmergencies(res.data))
      .catch(() => alert("⚠️ Failed to load emergency data"));
  }, []);

  const openModal = (uid) => {
    setSelectedUID(uid);
    setTreatmentTime("");
    const modalElement = document.getElementById("fixEmergencyModal");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  };

  const handleSave = async () => {
    if (!treatmentTime) return alert("⚠️ Please select a treatment date & time");

    try {
      await axios.put("http://127.0.0.1:5000/update_emergency_time", {
        unique_id: selectedUID,
        treatment_time: treatmentTime,
      });

      alert("🚑 Emergency treatment time fixed successfully!");

      const modalElement = document.getElementById("fixEmergencyModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

      setEmergencies((prev) =>
        prev.map((e) =>
          e.unique_id === selectedUID
            ? { ...e, treatment_time: treatmentTime }
            : e
        )
      );

      setSelectedUID("");
    } catch {
      alert("❌ Failed to update treatment time");
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffebee, #fce4ec)",
      }}
    >
      <h3 className="text-center text-danger fw-bold mb-5">
        🚑 Emergency Cases (Vitals Verified)
      </h3>

      {emergencies.length === 0 ? (
        <p className="text-center text-muted">No verified emergency cases yet.</p>
      ) : (
        emergencies.map((e, index) => (
          <div
            key={index}
            className="card shadow-sm border-danger mb-4"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body">
              <h5 className="fw-bold text-danger">{e.name}</h5>
              <p><b>Unique ID:</b> {e.unique_id}</p>
              <p><b>Emergency Type:</b> {e.emergency_type}</p>
              <p><b>Phone:</b> {e.phone}</p>
              <p><b>City:</b> {e.city}</p>
              <p><b>Immediate Treatment:</b> {e.immediate_treatment}</p>

              <div className="mt-2">
                <h6 className="fw-bold text-secondary">🧠 Nurse Vitals:</h6>
                <p>
                  <b>BP:</b> {e.blood_pressure || "-"} |{" "}
                  <b>Pulse:</b> {e.pulse_rate || "-"} |{" "}
                  <b>Temp:</b> {e.temperature || "-"}
                </p>
                <p>
                  <b>Weight:</b> {e.weight || "-"} kg |{" "}
                  <b>Height:</b> {e.height || "-"} cm |{" "}
                  <b>Resp:</b> {e.respiratory_rate || "-"}
                </p>
              </div>

              <p className="text-muted">
                <small>📅 {e.created_at}</small>
              </p>

              {e.treatment_time ? (
                <p className="text-success fw-semibold">
                  ⏰ Fixed for:{" "}
                  {new Date(e.treatment_time).toLocaleString()}
                </p>
              ) : (
                <button
                  className="btn btn-danger fw-semibold"
                  onClick={() => openModal(e.unique_id)}
                >
                  Fix Treatment Time
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* ✅ MODAL */}
      <div
        className="modal fade"
        id="fixEmergencyModal"
        tabIndex="-1"
        aria-labelledby="fixEmergencyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="fixEmergencyModalLabel">
                Fix Emergency Treatment Time
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p><b>Patient ID:</b> {selectedUID}</p>
              <input
                type="datetime-local"
                className="form-control"
                value={treatmentTime}
                onChange={(e) => setTreatmentTime(e.target.value)}
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
              <button type="button" className="btn btn-danger" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmergencies;
