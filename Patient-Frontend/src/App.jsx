import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import EmergencyForm from "./pages/EmergencyForm";
import Reports from "./pages/Reports";
import Pharmacy from "./pages/Pharmacy";
import Billing from "./pages/Billing";
import DateAndTime from "./pages/DateAndTime"; // ✅ added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/appointments"
          element={
            <>
              <Navbar />
              <Appointments />
            </>
          }
        />

        <Route
          path="/emergency"
          element={
            <>
              <Navbar />
              <EmergencyForm />
            </>
          }
        />

        <Route
          path="/reports"
          element={
            <>
              <Navbar />
              <Reports />
            </>
          }
        />

        <Route
          path="/pharmacy"
          element={
            <>
              <Navbar />
              <Pharmacy />
            </>
          }
        />

        <Route
          path="/billing"
          element={
            <>
              <Navbar />
              <Billing />
            </>
          }
        />

        {/* ✅ NEW Date & Time Route */}
        <Route
          path="/date-and-time"
          element={
            <>
              <Navbar />
              <DateAndTime />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
