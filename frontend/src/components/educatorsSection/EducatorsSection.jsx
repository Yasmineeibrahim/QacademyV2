// src/components/EducatorsSection.jsx
import React, { useState, useEffect } from 'react'
import { educators  } from '../../assets/data/educators'
import EducatorCard from '../educatorcard/Educatorcard'
import './EducatorsSection.css'

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
    <section className="educators-section">
      <div className="container">

        {/* Header */}
        <div className="educators-section__header">
          <span className="educators-section__badge">Our Team</span>
          <h2 className="educators-section__title">Meet Your Educators</h2>
          <p className="educators-section__subtitle">
            Expert instructors who've spent years turning hard engineering concepts into clear, practical knowledge.
          </p>
        </div>

        {/* Slider */}
        <div className="educators-section__slider">

          <button
            onClick={prev}
            className={`slider-arrow${index === 0 ? ' slider-arrow--disabled' : ''}`}
            aria-label="Previous"
          >‹</button>

          <div className={`educators-section__grid educators-section__grid--cols-${visible}`}>
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
        <div className="courses-dots educators-section__dots">
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