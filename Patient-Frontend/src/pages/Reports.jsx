import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const uid = localStorage.getItem("uniqueId");
    axios
      .get(`http://127.0.0.1:5000/get_reports/${uid}`)
      .then((res) => setReports(res.data))
      .catch(() => alert("⚠️ Failed to load reports"));
  }, []);

  return (
    <div className="container py-5">
      <h3 className="text-center fw-bold text-warning mb-4">🧾 Medical Reports</h3>

      {reports.length === 0 ? (
        <p className="text-center text-muted">No reports available</p>
      ) : (
        <div className="row">
          {reports.map((r, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <div className="card shadow-sm border-warning">
                <div className="card-body">
                  <h5 className="card-title text-warning">{r.report_title}</h5>
                  <p className="card-text">
                    <strong>Diagnosis:</strong> {r.diagnosis}<br />
                    <strong>Doctor:</strong> {r.doctor_name}<br />
                    <strong>Date:</strong> {r.date}
                  </p>
                  {r.file_url && (
                    <a
                      href={`http://127.0.0.1:5000/${r.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-warning fw-semibold"
                    >
                      📂 View Report
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
