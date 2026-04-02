import React, { useEffect, useState, useRef } from 'react'
import logo from '../../assets/logos/elongated_logo-removebg-preview.png'
import { useLocation, useNavigate } from 'react-router-dom'
import './navbar.css'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)   // mobile hamburger
  const [dropdownOpen, setDropdownOpen] = useState(false)   // profile dropdown
  const dropdownRef = useRef(null)
  const isLoginPage = location.pathname === '/login'

  const readStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch {
      return null
    }
  }

  // Read auth state (set by loginPage.jsx → localStorage)
  const [user, setUser] = useState(() => readStoredUser())




  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const syncAuthState = () => setUser(readStoredUser())

    window.addEventListener('storage', syncAuthState)
    window.addEventListener('auth-changed', syncAuthState)

    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener('auth-changed', syncAuthState)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-changed'))
    setUser(null)
    setDropdownOpen(false)
    navigate('/')
  }

  // Derive initials for avatar
  const displayName = user?.name || user?.first_name || user?.email || 'Account'
  const userRole = String(user?.role || '').trim().toLowerCase()
  const isStudent = userRole === 'student'
  const isEducator = userRole === 'educator'
  const isAdmin = userRole === 'admin' || userRole === 'administrator'

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.first_name
      ? user.first_name[0].toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : '?'

  const menuItems = []

  if (isStudent) {
    menuItems.push({ icon: '👤', label: 'Profile', path: '/profile' })
    menuItems.push({ icon: '📚', label: 'My Courses', path: '/student-courses' })
  }

  if (isEducator) {
    menuItems.push({ icon: '👤', label: 'Profile', path: '/profile' })
    menuItems.push({ icon: '📚', label: 'My Courses', path: '/educator-courses' })
    menuItems.push({ icon: '📈', label: 'My Analytics', path: '/educator-analytics' })
  }

  if (isAdmin) {
    menuItems.push({ icon: '📈', label: 'My Analytics', path: '/educator-analytics' })
    menuItems.push({ icon: '👤', label: 'Profile', path: '/profile' })
    menuItems.push({ icon: '🛠️', label: 'Control Nexus', path: '/control-nexus' })
  }

  if (!menuItems.length) {
    menuItems.push({ icon: '👤', label: 'Profile', path: '/profile' })
    menuItems.push({ icon: '📚', label: 'My Courses', path: '/student-courses' })
  }

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isLoginPage ? 'navbar-login' : ''}`}>
      {/* Logo */}
      <img src={logo} alt="Logo" />

      {/* Desktop links */}
      <div className="links">
        <a href="/">Home</a>
        <a href="/courses">Courses</a>
        <a href="/about">About Us</a>
      </div>

      {/* Auth area */}
      <div className="auth-buttons">
        {user ? (
          /* ── Profile button + dropdown ── */
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={() => setDropdownOpen(o => !o)}
              aria-label="Profile menu"
            >
              <span className="profile-avatar">{initials}</span>
              <span className={`profile-chevron ${dropdownOpen ? 'profile-chevron--open' : ''}`}>▾</span>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown__header">
                  <span className="profile-dropdown__name">{displayName}</span>
                  {user?.email && <span className="profile-dropdown__email">{user.email}</span>}
                </div>
                <div className="profile-dropdown__divider" />
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    className="profile-dropdown__item"
                    onClick={() => { navigate(item.path); setDropdownOpen(false) }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
                <div className="profile-dropdown__divider" />
                <button className="profile-dropdown__item profile-dropdown__item--danger" onClick={handleLogout}>
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className='loginBtn'    onClick={() => navigate('/login')}>Login</button>
            <button className='registerBtn' onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger__bar ${menuOpen ? 'hamburger__bar--open-1' : ''}`} />
        <span className={`hamburger__bar ${menuOpen ? 'hamburger__bar--open-2' : ''}`} />
        <span className={`hamburger__bar ${menuOpen ? 'hamburger__bar--open-3' : ''}`} />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="/"        onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/courses" onClick={() => setMenuOpen(false)}>Courses</a>
          <a href="/about"   onClick={() => setMenuOpen(false)}>About Us</a>
          <div className="mobile-menu__divider" />
          {user ? (
            <>
              {menuItems.map((item) => (
                <button key={item.path} onClick={() => { navigate(item.path); setMenuOpen(false) }}>
                  {item.icon} {item.label}
                </button>
              ))}
              <button className="mobile-menu__logout" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login');    setMenuOpen(false) }}>Login</button>
              <button onClick={() => { navigate('/register'); setMenuOpen(false) }}>Register</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}