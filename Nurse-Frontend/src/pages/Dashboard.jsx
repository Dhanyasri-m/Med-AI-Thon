import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const nurseName = localStorage.getItem("nurseName") || "Nurse";

  const cards = [
    { title: "View Appointments", path: "/view-appointments", color: "success" },
    { title: "Emergency Cases", path: "/emergency-cases", color: "danger" },
    { title: "Add Data for Appointments", path: "/add-appointment-data", color: "primary" },
    { title: "Add Data for Emergencies", path: "/add-emergency-data", color: "warning" },
  ];

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    paddingTop: "80px",
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "0.3s",
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={containerStyle}>
      <div className="container text-center">
        <h2 className="fw-bold mb-3 text-dark">🏥 Nurse Dashboard</h2>
        <p className="text-muted mb-4">
          Welcome, <strong>{nurseName}</strong>
        </p>

        <div className="row g-4">
          {cards.map((card, index) => (
            <div key={index} className="col-md-6 col-lg-3">
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
                  <button
                    className={`btn btn-${card.color} w-100 mt-2 fw-semibold`}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-outline-danger mt-5 fw-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
