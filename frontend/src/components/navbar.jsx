import React, { useEffect, useState } from 'react'
import logo from '../assets/logos/elongated_logo-removebg-preview.png'
import { useLocation, useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const isLoginPage = location.pathname === '/login'

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isLoginPage ? 'navbar-login' : ''}`}>
            <img src={logo} alt="Logo" />
            <div className="links">
                <a href="/">Home</a>
                <a href="/courses">Courses</a>
                <a href="/about">About Us</a>
            </div>
            <div className="auth-buttons">
            <button className='loginBtn' onClick={() => navigate('/login')}>Login</button>
            <button className='registerBtn' onClick={() => navigate('/register')}>Register</button>
            </div>
        </nav>
    )
}