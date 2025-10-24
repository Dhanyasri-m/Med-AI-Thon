import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Import all nurse pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewAppointments from "./pages/ViewAppointments";
import EmergencyCases from "./pages/EmergencyCases";
import AddMedicalDataForAppoiments from "./pages/AddMedicalDataForAppoiments";
import AddMedicalDataForEmermacy from "./pages/AddMedicalDataForEmermacy";

// ✅ App Router Component
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🔹 Default route (Login) */}
        <Route path="/" element={<Login />} />

        {/* 🔹 Dashboard after login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🔹 View all appointments (fetched from /get_all_appointments) */}
        <Route path="/view-appointments" element={<ViewAppointments />} />

        {/* 🔹 View all emergencies (fetched from /get_all_emergencies) */}
        <Route path="/emergency-cases" element={<EmergencyCases />} />

        {/* 🔹 Fill medical data for appointments */}
        <Route
          path="/add-appointment-data"
          element={<AddMedicalDataForAppoiments />}
        />

        {/* 🔹 Fill medical data for emergency cases */}
        <Route
          path="/add-emergency-data"
          element={<AddMedicalDataForEmermacy />}
        />
      </Routes>
    </Router>
  );
};

export default App;
