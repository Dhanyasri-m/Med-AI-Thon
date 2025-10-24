import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Pharmacy = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const uid = localStorage.getItem("uniqueId");
    axios
      .get(`http://127.0.0.1:5000/get_pharmacy/${uid}`)
      .then((res) => setRecords(res.data))
      .catch(() => alert("⚠️ Failed to load pharmacy data"));
  }, []);

  return (
    <div className="container py-5">
      <h3 className="text-center fw-bold text-info mb-4">💊 Prescribed Medicines</h3>

      {records.length === 0 ? (
        <p className="text-center text-muted">No pharmacy records available</p>
      ) : (
        <table className="table table-bordered shadow-sm">
          <thead className="table-info">
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Prescribed By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((p, index) => (
              <tr key={index}>
                <td>{p.medicine_name}</td>
                <td>{p.dosage}</td>
                <td>{p.frequency}</td>
                <td>{p.duration}</td>
                <td>{p.prescribed_by}</td>
                <td>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Pharmacy;
