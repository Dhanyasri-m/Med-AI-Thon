import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const sidebarStyle = {
    width: "230px",
    height: "100vh",
    position: "fixed",
    top: "0",
    left: "0",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #ddd",
    paddingTop: "80px",
  };

  const linkStyle = {
    display: "block",
    padding: "12px 20px",
    color: "#333",
    fontWeight: "500",
    textDecoration: "none",
  };

  const hoverStyle = {
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Emergency Form", path: "/emergency" },
    { name: "Appointments", path: "/appointments" },
    { name: "Reports", path: "/reports" },
    { name: "Pharmacy", path: "/pharmacy" },
    { name: "Billing", path: "/billing" },
  ];

  return (
    <div style={sidebarStyle}>
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.path}
          style={linkStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseLeave={(e) =>
            Object.assign(e.target.style, { backgroundColor: "", color: "#333" })
          }
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
