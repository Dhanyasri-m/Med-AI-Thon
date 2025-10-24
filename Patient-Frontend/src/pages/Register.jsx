import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    phone: "",
    aadhaar: "",
    city: "",
    state: "",
    address: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/register", form);
      alert(`${res.data.message}\nYour Unique ID: ${res.data.unique_id}`);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[450px]">
        <h2 className="text-2xl font-bold text-center mb-6">🩺 Patient Registration</h2>

        {[
          { key: "name", label: "Full Name" },
          { key: "age", label: "Age" },
          { key: "sex", label: "Sex (Male/Female/Other)" },
          { key: "phone", label: "Phone Number" },
          { key: "aadhaar", label: "Aadhaar Number" },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "address", label: "Address" },
          { key: "password", label: "Password" },
        ].map((field) => (
          <input
            key={field.key}
            type={field.key === "password" ? "password" : "text"}
            placeholder={field.label}
            value={form[field.key]}
            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            className="border rounded-md w-full mb-3 p-2"
          />
        ))}

        <button
          onClick={handleRegister}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded"
        >
          Register
        </button>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
