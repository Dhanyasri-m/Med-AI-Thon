import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
    paddingTop: "80px",
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "0.3s",
  };

  const cards = [
    { title: "Appointments", path: "/appointments", color: "success" },
    { title: "Emergency Form", path: "/emergency", color: "danger" },
    { title: "Reports", path: "/reports", color: "warning" },
    { title: "Pharmacy", path: "/pharmacy", color: "info" },
    { title: "Billing", path: "/billing", color: "secondary" },
    { title: "Date & Time", path: "/date-and-time", color: "primary" }, // ✅ NEW
  ];

  return (
    <div style={containerStyle}>
      <div className="container text-center">
        <h2 className="fw-bold mb-5 text-dark">🏥 Patient Dashboard</h2>

        <div className="row g-4">
          {cards.map((card, index) => (
            <div key={index} className="col-md-4">
              <div
                className={`card border-${card.color}`}
                style={cardStyle}
                onClick={() => (window.location.href = card.path)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div className={`card-body bg-${card.color} bg-opacity-25`}>
                  <h5 className={`card-title text-${card.color} fw-bold`}>
                    {card.title}
                  </h5>
                  <p className="card-text text-muted">
                    Access your {card.title.toLowerCase()} section here.
                  </p>
                  <button
                    className={`btn btn-${card.color} w-100 mt-2 fw-semibold`}
                  >
                    Go to {card.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
