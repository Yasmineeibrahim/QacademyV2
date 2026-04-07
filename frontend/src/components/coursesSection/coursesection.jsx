// src/components/coursesection.jsx
import React, { useState, useEffect } from 'react'
import CourseCard from '../coursecard/Coursecard'
import './coursesection.css'
import { API_BASE_URL } from '../../config/api'

const useVisibleCount = () => {
  const getCount = () => {
    if (window.innerWidth < 480) return 1
    if (window.innerWidth < 768) return 2
    return 3
  }
  const [count, setCount] = useState(getCount)

  useEffect(() => {
    const handleResize = () => setCount(getCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return count
}

const CoursesSection = () => {
  const [courses, setCourses] = useState([])
  const [index, setIndex] = useState(0)
  const visible = useVisibleCount()

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err)
        setCourses([])
      })
  }, [])

  // Reset index when visible count changes to avoid out-of-bounds
  useEffect(() => {
    setIndex(0)
  }, [visible])

  const maxIndex = Math.max(0, courses.length - visible)

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(maxIndex, i + 1))

  const visibleCourses = courses.slice(index, index + visible)

  return (
    <section className="courses-section">
      <div className="container">

        <div className="courses-header">
          <h2 className="courses-title">Courses You Can Join</h2>
        </div>

        <div className="courses-slider-wrapper">

          <button
            className={`slider-arrow${index === 0 ? ' slider-arrow--disabled' : ''}`}
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous"
          >‹</button>

          <div className={`courses-track courses-track--cols-${visible}`}>
            {visibleCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <button
            className={`slider-arrow${index >= maxIndex ? ' slider-arrow--disabled' : ''}`}
            onClick={next}
            disabled={index >= maxIndex}
            aria-label="Next"
          >›</button>

        </div>

        <div className="courses-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`courses-dot${i === index ? ' courses-dot--active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="courses-footer">
          <a href="/courses" className="view-all-btn">View All Courses →</a>
        </div>

      </div>
    </section>
  )
}

export default CoursesSection