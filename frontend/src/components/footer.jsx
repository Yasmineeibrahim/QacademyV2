// src/components/footer.jsx
import React from 'react'
import logo from '../assets/logos/elongated_logo-removebg-preview.png'

const Footer = () => {
  return (
    <footer style={{
      background: '#EDF2F4',
      width: '100%',
      padding: '56px 0 32px',
    }}>
      <div className="container">

        {/* Main row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '48px',
        }}>

          {/* ── LEFT: Logo ── */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="QAcademy Logo"
              style={{ width: '180px', height: 'auto' }}
            />
          </div>

          {/* ── MIDDLE: Contact Us ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>

            {/* Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <p style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: '1.35rem',
                color: '#042a4e',
                letterSpacing: '0.5px',
              }}>Contact Us</p>
              <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: '#fff613' }} />
            </div>

            {/* Email */}
            <ContactItem href="mailto:qacademyyy@gmail.com" icon={<EmailIcon />} text="qacademyyy@gmail.com" />

            {/* Phone */}
            <ContactItem href="tel:+201010659462" icon={<PhoneIcon />} text="+20 101 065 9462" />
          </div>

          {/* ── RIGHT: Follow Us ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>

            {/* Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: '1.35rem',
                color: '#042a4e',
                letterSpacing: '0.5px',
              }}>Follow Us</p>
              <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: '#fff613' }} />
            </div>

            {/* Icons row */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>

              <SocialLink href="https://www.facebook.com" label="Facebook"
                color="#1877F2" gradient="linear-gradient(135deg,#1877F2,#0a5dc2)">
                <FacebookIcon />
              </SocialLink>

              <SocialLink
                href="https://www.instagram.com/qacademyy?igsh=MXRocHBjMmVmYnAybA=="
                label="Instagram" color="#E1306C"
                gradient="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)">
                <InstagramIcon />
              </SocialLink>

              <SocialLink
                href="https://www.tiktok.com/@qacademyy?_r=1&_t=ZS-94tiOrXNPfA"
                label="TikTok" color="#010101"
                gradient="linear-gradient(135deg,#010101,#69C9D0)">
                <TikTokIcon />
              </SocialLink>

              <SocialLink href="https://wa.me/201010659462" label="WhatsApp"
                color="#25D366" gradient="linear-gradient(135deg,#25D366,#128C7E)">
                <WhatsAppIcon />
              </SocialLink>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(4,42,78,0.18)',
          margin: '40px 0 22px',
        }} />

        {/* Bottom bar */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(4,42,78,0.55)',
          fontWeight: 500,
        }}>
          © {new Date().getFullYear()} QAcademy. All rights reserved.
        </p>

      </div>
    </footer>
  )
}

/* ── Contact row item ── */
const ContactItem = ({ href, icon, text }) => {
  const [hovered, setHovered] = React.useState(false)
  return (
    <a
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        textDecoration: 'none',
        background: hovered ? 'rgba(4,42,78,0.07)' : 'rgba(255,255,255,0.45)',
        border: '1.5px solid rgba(4,42,78,0.1)',
        borderRadius: '10px',
        padding: '10px 18px',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 18px rgba(4,42,78,0.12)' : '0 1px 4px rgba(4,42,78,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: '#042a4e', display: 'flex' }}>{icon}</span>
      <span style={{ color: '#042a4e', fontSize: '14px', fontWeight: 600 }}>{text}</span>
    </a>
  )
}

/* ── Circular social icon button ── */
const SocialLink = ({ href, label, color, gradient, children }) => {
  const [hovered, setHovered] = React.useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '54px', height: '54px',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? gradient : '#ffffff',
        color: hovered ? '#ffffff' : color,
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-5px) scale(1.1)' : 'scale(1)',
        boxShadow: hovered
          ? `0 12px 32px ${color}66, 0 4px 14px ${color}44`
          : '0 2px 10px rgba(4,42,78,0.15)',
        textDecoration: 'none',
        border: hovered ? `2px solid ${color}` : '2px solid rgba(4,42,78,0.12)',
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  )
}

/* ── SVG Icons ── */
const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.94 6.94l1.41-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)

export default Footer