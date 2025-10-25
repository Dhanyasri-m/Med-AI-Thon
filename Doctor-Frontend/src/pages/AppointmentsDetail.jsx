import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const AppointmentsDetail = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    prescription: "",
    report_url: "",
    billing_amount: "",
    billing_remarks: "",
    description: "",
    next_appointment: "",
  });

  // ✅ Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/get_all_appointments_doctor");
      setAppointments(res.data);
      setFiltered(res.data);
    } catch {
      alert("⚠️ Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Search by Unique ID
  const handleSearch = (e) => {
    const term = e.target.value.toUpperCase();
    setSearch(term);
    if (term.trim() === "") setFiltered(appointments);
    else setFiltered(appointments.filter((a) => a.unique_id.includes(term)));
  };

  // ✅ Open Patient Modal
  const openModal = (data) => {
    setSelected(data);
    setForm({
      prescription: "",
      report_url: "",
      billing_amount: "",
      billing_remarks: "",
      description: "",
      next_appointment: "",
    });
    const modal = new bootstrap.Modal(document.getElementById("patientModal"));
    modal.show();
  };

  // ✅ Submit Doctor Update
  const handleSubmit = async () => {
    if (!selected) return;

    const isEmpty =
      !form.prescription &&
      !form.report_url &&
      !form.billing_amount &&
      !form.description &&
      !form.next_appointment;

    if (isEmpty) {
      alert("⚠️ Please fill at least one field before saving!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/add_doctor_update", {
        unique_id: selected.unique_id,
        ...form,
      });
      alert("✅ Details saved successfully!");
      bootstrap.Modal.getInstance(document.getElementById("patientModal")).hide();
      fetchAppointments(); // refresh instantly
    } catch {
      alert("❌ Failed to update details");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #e8f5e9)",
    padding: "50px 0",
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    marginBottom: "20px",
    padding: "25px",
    background: "white",
  };

  return (
    <div style={containerStyle}>
      <div className="container">
        <h3 className="text-center text-primary fw-bold mb-4">
          📋 All Appointment Details
        </h3>

        {/* 🔍 Search Box */}
        <div className="d-flex justify-content-center mb-4">
          <input
            type="text"
            className="form-control w-50 shadow-sm"
            placeholder="🔍 Search by Unique ID (e.g., BVJ335)"
            value={search}
            onChange={handleSearch}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </div>

        {/* 🧠 Appointment List */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted">No matching records found.</p>
        ) : (
          filtered.map((a, index) => (
            <div key={index} className="card" style={cardStyle}>
              <div className="row">
                <div className="col-md-8">
                  <h5 className="fw-bold text-success">{a.name}</h5>
                  <p><b>Unique ID:</b> {a.unique_id}</p>
                  <p><b>Age:</b> {a.age} | <b>Sex:</b> {a.sex}</p>
                  <p><b>Reason:</b> {a.reason}</p>
                  <p><b>Phone:</b> {a.phone}</p>
                  <p><b>City:</b> {a.city}</p>
                  <p className="text-muted mb-0">
                    <small>🗓 Created: {a.created_at}</small>
                  </p>
                </div>

                <div className="col-md-4">
                  <h6 className="fw-bold text-secondary mt-2">Vitals</h6>
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

                  {a.appointment_time ? (
                    <p className="text-success fw-semibold mt-2">
                      ⏰ Fixed Time: {new Date(a.appointment_time).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-danger fw-semibold mt-2">⏰ Not yet fixed</p>
                  )}

                  <button
                    className="btn btn-primary fw-semibold w-100 mt-3"
                    onClick={() => openModal(a)}
                  >
                    👁 View / Update Patient
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🧾 Modal */}
      <div
        className="modal fade"
        id="patientModal"
        tabIndex="-1"
        aria-labelledby="patientModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold" id="patientModalLabel">
                Patient Details & Doctor Inputs
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {selected && (
                <>
                  <p><b>Patient:</b> {selected.name}</p>
                  <p><b>Unique ID:</b> {selected.unique_id}</p>

                  <hr />
                  <h6 className="fw-bold text-secondary">🧾 Prescription</h6>
                  <textarea
                    className="form-control mb-3"
                    rows="2"
                    placeholder="Enter prescribed medicines..."
                    value={form.prescription}
                    onChange={(e) =>
                      setForm({ ...form, prescription: e.target.value })
                    }
                  />

                  <h6 className="fw-bold text-secondary">📂 Lab Report URL</h6>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Paste uploaded report link..."
                    value={form.report_url}
                    onChange={(e) =>
                      setForm({ ...form, report_url: e.target.value })
                    }
                  />

                  <h6 className="fw-bold text-secondary">💳 Billing Details</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Total Amount"
                        value={form.billing_amount}
                        onChange={(e) =>
                          setForm({ ...form, billing_amount: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Remarks"
                        value={form.billing_remarks}
                        onChange={(e) =>
                          setForm({ ...form, billing_remarks: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <h6 className="fw-bold text-secondary">🩺 Doctor Description</h6>
                  <textarea
                    className="form-control mb-3"
                    rows="2"
                    placeholder="Additional notes..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />

                  <h6 className="fw-bold text-secondary">📅 Next Appointment</h6>
                  <input
                    type="datetime-local"
                    className="form-control mb-3"
                    value={form.next_appointment}
                    onChange={(e) =>
                      setForm({ ...form, next_appointment: e.target.value })
                    }
                  />
                </>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDetail;
