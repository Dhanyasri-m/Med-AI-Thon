import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", { phone, password });
      alert(`${res.data.message}\nWelcome ${res.data.name} (${res.data.unique_id})`);
      localStorage.setItem("patientPhone", res.data.phone);
      localStorage.setItem("uniqueId", res.data.unique_id);
      window.location.href = "/patient-details";
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">🔑 Patient Login</h2>

        <input
          type="text"
          placeholder="Phone Number"
          className="border rounded-md w-full mb-3 p-2"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border rounded-md w-full mb-3 p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
