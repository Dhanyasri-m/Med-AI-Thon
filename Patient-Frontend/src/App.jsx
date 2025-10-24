import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDetails from "./pages/PatientDetails";
import EmergencyForm from "./pages/EmergencyForm";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Pharmacy from "./pages/Pharmacy";
import Billing from "./pages/Billing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/emergency" element={<EmergencyForm />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </Router>
  );
}

export default App;
