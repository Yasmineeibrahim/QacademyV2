// src/components/aboutus.jsx
import React, { useState, useEffect } from 'react'

const educators = [
  {
    id: 1,
    name: 'Dr. Sarah Ahmed',
    initials: 'SA',
    role: 'Calculus & Analysis',
    color: '#042a4e',
    accent: '#fff613',
    description:
      'PhD in Applied Mathematics from Cairo University. 12+ years teaching calculus and real analysis. Published researcher with a passion for making complex theory feel intuitive for engineering students.',
    courses: 3,
    students: 1240,
  },
  {
    id: 2,
    name: 'Prof. Omar Hassan',
    initials: 'OH',
    role: 'Linear Algebra',
    color: '#1a4a7a',
    accent: '#fff613',
    description:
      'Professor of Mathematics with 15 years at the Faculty of Engineering. Specialises in matrix theory and its applications in computer graphics, structural analysis, and data science.',
    courses: 2,
    students: 980,
  },
  {
    id: 3,
    name: 'Dr. Layla Nasser',
    initials: 'LN',
    role: 'Physics & Mechanics',
    color: '#042a4e',
    accent: '#fff613',
    description:
      'Mechanical engineer turned educator. Dr. Nasser bridges theory and real-world application with a teaching style renowned for clarity. Her mechanics course is among our highest-rated.',
    courses: 4,
    students: 1580,
  },
  {
    id: 4,
    name: 'Prof. Karim Adel',
    initials: 'KA',
    role: 'Statistics & Probability',
    color: '#1a4a7a',
    accent: '#fff613',
    description:
      'Industrial engineer and statistician with expertise in quality control and probabilistic modelling. Brings real data from industry projects into every lecture for maximum relevance.',
    courses: 2,
    students: 760,
  },
  {
    id: 5,
    name: 'Dr. Nour Ibrahim',
    initials: 'NI',
    role: 'Thermodynamics',
    color: '#042a4e',
    accent: '#fff613',
    description:
      'Thermal systems expert with a decade of research in heat transfer and energy efficiency. Consultant for several Egyptian manufacturing firms and a beloved mentor on campus.',
    courses: 3,
    students: 1100,
  },
  {
    id: 6,
    name: 'Prof. Hana Zaki',
    initials: 'HZ',
    role: 'Differential Equations',
    color: '#1a4a7a',
    accent: '#fff613',
    description:
      'Specialises in ODE and PDE with applications in fluid dynamics and electrical systems. Known for step-by-step problem solving sessions that students describe as "finally making it click".',
    courses: 2,
    students: 870,
  },
]

function getVisible() {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth < 640)  return 1
  if (window.innerWidth < 1024) return 2
  return 4
}

const AboutUs = () => {
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(getVisible())

  useEffect(() => {
    const onResize = () => setVisible(getVisible())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const maxIndex = educators.length - visible



  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  const visibleCards = educators.slice(index, index + visible)

  return (
    <section style={{ width: '100%', padding: '80px 0', background: '#ffffff' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '48px', gap: '10px' }}>
          <span style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '2.5px',
            textTransform: 'uppercase', color: '#fff613',
            background: '#042a4e', padding: '4px 14px',
            borderRadius: '4px', display: 'inline-block',
          }}>Our Team</span>
          <h2 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: '2.4rem', color: '#042a4e', lineHeight: 1.15,
          }}>Meet Your Educators</h2>
          <p style={{ color: 'rgba(4,42,78,0.5)', fontSize: '15px', maxWidth: '460px', marginTop: '4px' }}>
            Expert instructors who've spent years turning hard engineering concepts into clear, practical knowledge.
          </p>
        </div>

        {/* Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Left arrow */}
          <button
            onClick={prev}
            className={`slider-arrow${index === 0 ? ' slider-arrow--disabled' : ''}`}
            aria-label="Previous"
          >‹</button>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visible}, 1fr)`,
            gap: '24px',
            flex: 1,
            minWidth: 0,
          }}>
            {visibleCards.map(edu => (
              <EducatorCard key={edu.id} educator={edu} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className={`slider-arrow${index === maxIndex ? ' slider-arrow--disabled' : ''}`}
            aria-label="Next"
          >›</button>

        </div>

        {/* Dots */}
        <div className="courses-dots" style={{ marginTop: '32px' }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`courses-dot${i === index ? ' courses-dot--active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── Single educator card ── */
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
      {/* Photo area — avatar placeholder */}
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

        {/* Decorative ring */}
        <div style={{
          position: 'absolute',
          width: '220px', height: '220px',
          borderRadius: '50%',
          border: `1px solid rgba(255,246,19,0.12)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px', height: '300px',
          borderRadius: '50%',
          border: `1px solid rgba(255,246,19,0.06)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Avatar circle */}
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

        {/* Name & role — shown when NOT hovered */}
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
          <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>
            {educator.name}
          </p>
          <p style={{ fontSize: '12px', color: educator.accent, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {educator.role}
          </p>
        </div>

        {/* Description overlay — shown on hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4,42,78,0.92)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 22px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          gap: '14px',
          zIndex: 2,
        }}>
          <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1rem', color: '#ffffff', textAlign: 'center' }}>
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
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.1rem', color: educator.accent }}>{educator.courses}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Courses</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.1rem', color: educator.accent }}>{educator.students.toLocaleString()}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Students</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AboutUs