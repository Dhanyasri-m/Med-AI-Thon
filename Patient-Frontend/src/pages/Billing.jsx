import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Billing = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const uid = localStorage.getItem("uniqueId");
    axios
      .get(`http://127.0.0.1:5000/get_billing/${uid}`)
      .then((res) => setBills(res.data))
      .catch(() => alert("⚠️ Failed to load billing info"));
  }, []);

  return (
    <div className="container py-5">
      <h3 className="text-center fw-bold text-secondary mb-4">🧾 Billing Information</h3>

      {bills.length === 0 ? (
        <p className="text-center text-muted">No billing records available</p>
      ) : (
        <table className="table table-bordered shadow-sm">
          <thead className="table-secondary">
            <tr>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b, index) => (
              <tr key={index}>
                <td>{b.billing_date}</td>
                <td>₹{b.total_amount}</td>
                <td
                  className={
                    b.payment_status.toLowerCase() === "paid"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }
                >
                  {b.payment_status}
                </td>
                <td>{b.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Billing;
