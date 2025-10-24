import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
   
      </Routes>
    </Router>
  );
}

export default App;
