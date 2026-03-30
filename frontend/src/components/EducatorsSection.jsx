// src/components/EducatorsSection.jsx
import React, { useState, useEffect } from 'react'
import { educators  } from '../assets/data/educators'
import EducatorCard from './Educatorcard'

function getVisible() {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth < 640)  return 1
  if (window.innerWidth < 1024) return 2
  return 4
}

const EducatorsSection = () => {
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
    <section style={{ width: '100%', padding: '40px 0', background: '#ffffff' }}>
      <div className="container">

        {/* Header */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', marginBottom: '32px', gap: '6px',
        }}>
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

          <button
            onClick={prev}
            className={`slider-arrow${index === 0 ? ' slider-arrow--disabled' : ''}`}
            aria-label="Previous"
          >‹</button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visible}, 1fr)`,
            gap: '24px', flex: 1, minWidth: 0,
          }}>
            {visibleCards.map(edu => (
              <EducatorCard key={edu.id} educator={edu} />
            ))}
          </div>

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

export default EducatorsSection