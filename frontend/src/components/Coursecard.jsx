// src/components/CourseCard.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className="course-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <div className="course-card__banner" style={{ background: course.color }}>
        <span className="course-card__category">{course.category}</span>
        <span className="course-card__price">{course.price}</span>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.title}</h3>
        <div className="course-card__stats">
          <span className="course-card__stat">
            <span className="stat-icon">🎥</span> {course.lessons} Videos
          </span>
          <span className="course-card__stat">
            <span className="stat-icon">⏱</span> {course.duration}
          </span>
        </div>
        <div className="course-card__footer">
          <div className="course-card__instructor">
            <div className="instructor-avatar">{course.initials}</div>
            <span className="instructor-name">{course.instructor}</span>
          </div>
          {/* Clicking Enroll → goes to the course detail page */}
          <button
            className="enroll-btn"
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            Enroll →
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard