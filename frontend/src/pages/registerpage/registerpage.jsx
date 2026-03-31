import React from 'react'
import BeamGridBackground from '../../components/registerBackground/registerPagebackground'
import './registerpage.css'
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://street-helena-oakland-mistakes.trycloudflare.com" || "http://localhost:5000";

const registerpage = () => {
   const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { confirmPassword, ...payload } = form;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/accounts`,
        payload
      );

      console.log(res.data);
      alert("Account created successfully");

    } catch (err) {
      console.error(err);
      const apiMessage = err?.response?.data?.message;
      alert(apiMessage || "Error creating account");
    }
  };
  return (
    <div className="register-page">
      <BeamGridBackground
        gridSize={40}
        gridColor="#31313150"
        darkGridColor="#fff"
        beamColor="#002d59"
        darkBeamColor="rgba(0, 3, 47, 0.8)"
        beamCount={8}
        extraBeamCount={3}
        beamThickness={3}
        beamGlow
        glowIntensity={50}
        idleSpeed={1.15}
        asBackground
      />

      <div className="register-content">
        <div className="register-panel">
          <h1>Create Account</h1>
          <p>Join QAcademy and start building your engineering path.</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-row">
              <input type="text" placeholder="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
              <input type="text" placeholder="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>

            <input type="email" placeholder="Email Address" name="email" value={form.email} onChange={handleChange} />
            <input type="tel" placeholder="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
            <input type="password" placeholder="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

            <button type="submit">Register</button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="social-auth">
            <button type="button" className="social-btn social-btn--google" aria-label="Continue with Google">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.26-.96 2.33-2.04 3.05l3.3 2.56c1.92-1.77 3.04-4.38 3.04-7.49 0-.72-.06-1.42-.18-2.1H12z"/>
                <path fill="#34A853" d="M12 22c2.7 0 4.97-.89 6.63-2.41l-3.3-2.56c-.92.62-2.09.99-3.33.99-2.56 0-4.72-1.73-5.49-4.05l-3.42 2.64C4.74 19.86 8.09 22 12 22z"/>
                <path fill="#4A90E2" d="M6.51 13.97c-.2-.62-.31-1.27-.31-1.97 0-.69.11-1.35.31-1.97l-3.42-2.64C2.39 8.79 2 10.36 2 12s.39 3.21 1.09 4.61l3.42-2.64z"/>
                <path fill="#FBBC05" d="M12 5.98c1.47 0 2.8.51 3.84 1.5l2.88-2.88C16.96 2.98 14.69 2 12 2 8.09 2 4.74 4.14 3.09 7.39l3.42 2.64c.77-2.32 2.93-4.05 5.49-4.05z"/>
              </svg>
              Google
            </button>

            <button type="button" className="social-btn social-btn--facebook" aria-label="Continue with Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default registerpage