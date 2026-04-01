import React from 'react'
import bgVideo from '../../assets/loginpage/bg.mp4'
import './loginPage.css'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = " https://paragraph-tex-wanting-extensions.trycloudflare.com" || "http://localhost:5000";

const loginPage = () => {
  const navigate = useNavigate();
    const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const loginService = async (data) => {
    return await axios.post(
      `${API_BASE_URL}/api/accounts/login`,
      data
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginService(form);

      console.log(res.data);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/');

    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <section className="login-page">
      <video
        className="login-bg-video"
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = 0.85
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="login-content">
        <h1>Welcome Back!</h1>
        <p>Please enter your credentials to log in.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} required />
          <input type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} required />
          <button type="submit">Login</button>
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
    </section>
  )
}

export default loginPage