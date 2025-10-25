import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  const cards = [
    { title: "Appointments", path: "/view-appointments", color: "success" },
    { title: "Emergencies", path: "/view-emergencies", color: "danger" },
    { title: "Appointments Detail", path: "/appointments-detail", color: "primary" }, // ✅ NEW CARD
  ];

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    paddingTop: "80px",
  };

  const cardStyle = {
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={containerStyle}>
      <div className="container text-center">
        <h2 className="fw-bold mb-2 text-dark">🏥 Doctor Dashboard</h2>
        <p className="text-muted mb-5">
          Welcome, <strong>Dr. {doctorName}</strong>
        </p>

        <div className="row g-4 justify-content-center">
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
                  <p className="text-muted">
                    {card.title === "Appointments Detail"
                      ? "🔍 Search or view all appointments"
                      : `📋 View all ${card.title.toLowerCase()} here.`}
                  </p>
                  <button className={`btn btn-${card.color} w-100 fw-semibold`}>
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
