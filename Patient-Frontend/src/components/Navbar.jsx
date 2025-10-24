import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="/dashboard">
          🩺 MedAI Hospital
        </a>
        <button
          className="btn btn-outline-light ms-auto"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
