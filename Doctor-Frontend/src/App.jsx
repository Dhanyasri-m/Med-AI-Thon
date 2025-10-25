import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewAppointments from "./pages/ViewAppointments";
import ViewEmergencies from "./pages/ViewEmergencies";
import AppointmentsDetail from "./pages/AppointmentsDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Authentication */}
        <Route path="/" element={<Login />} />

        {/* 🔹 Doctor Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🔹 Doctor Functional Pages */}
        <Route path="/view-appointments" element={<ViewAppointments />} />
        <Route path="/view-emergencies" element={<ViewEmergencies />} />
        <Route path="/appointments-detail" element={<AppointmentsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
