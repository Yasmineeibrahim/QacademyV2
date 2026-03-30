// src/components/EducatorCard.jsx
import React, { useState } from 'react'

const EducatorCard = ({ educator }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(4,42,78,0.09)',
        boxShadow: hovered
          ? '0 16px 48px rgba(4,42,78,0.2)'
          : '0 4px 20px rgba(4,42,78,0.08)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        position: 'relative',
        background: '#fff',
        cursor: 'default',
        height: '340px',
      }}
    >
      {/* Gradient background */}
      <div style={{
        height: '100%',
        background: `linear-gradient(160deg, ${educator.color} 0%, #0d3560 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '32px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative rings */}
        <div style={{
          position: 'absolute', width: '220px', height: '220px',
          borderRadius: '50%', border: '1px solid rgba(255,246,19,0.12)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', border: '1px solid rgba(255,246,19,0.06)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Avatar */}
        <div style={{
          width: '90px', height: '90px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: `3px solid ${educator.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', fontWeight: 800,
          color: educator.accent,
          fontFamily: "'Archivo Black', sans-serif",
          flexShrink: 0,
          zIndex: 1,
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.35s ease',
          transform: hovered ? 'scale(0.85)' : 'scale(1)',
        }}>
          {educator.initials}
        </div>

        {/* Name & role — hidden on hover */}
        <div style={{
          textAlign: 'center', zIndex: 1,
          opacity: hovered ? 0 : 1,
          transform: hovered ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          position: 'absolute',
          bottom: '80px',
          left: 0, right: 0,
          padding: '0 20px',
        }}>
          <p style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: '1rem', color: '#ffffff', marginBottom: '4px',
          }}>
            {educator.name}
          </p>
          <p style={{
            fontSize: '12px', color: educator.accent,
            fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {educator.role}
          </p>
        </div>

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4,42,78,0.92)',
          backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '28px 22px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          gap: '14px',
          zIndex: 2,
        }}>
          <p style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: '1rem', color: '#ffffff', textAlign: 'center',
          }}>
            {educator.name}
          </p>
          <span style={{
            fontSize: '11px', color: educator.accent, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            background: 'rgba(255,246,19,0.1)', padding: '3px 10px', borderRadius: '20px',
          }}>
            {educator.role}
          </span>
          <p style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.65, textAlign: 'center',
          }}>
            {educator.description}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.1rem', color: educator.accent }}>
                {educator.courses}
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Courses
              </p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.1rem', color: educator.accent }}>
                {educator.students.toLocaleString()}
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Students
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default EducatorCard