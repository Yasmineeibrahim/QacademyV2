// src/components/EducatorCard.jsx
import React, { useState } from 'react'
import './Educatorcard.css'

const getBgClass = (color) => (color === '#1a4a7a' ? 'educator-card__bg--blue' : 'educator-card__bg--dark')

const EducatorCard = ({ educator }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`educator-card ${hovered ? 'educator-card--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient background */}
      <div className={`educator-card__bg ${getBgClass(educator.color)}`}>

        {/* Decorative rings */}
        <div className="educator-card__ring educator-card__ring--small" />
        <div className="educator-card__ring educator-card__ring--large" />

        {/* Avatar */}
        <div className={`educator-card__avatar ${hovered ? 'educator-card__avatar--hovered' : ''}`}>
          {educator.initials}
        </div>

        {/* Name & role — hidden on hover */}
        <div className={`educator-card__summary ${hovered ? 'educator-card__summary--hidden' : 'educator-card__summary--visible'}`}>
          <p className="educator-card__name">
            {educator.name}
          </p>
          <p className="educator-card__role">
            {educator.role}
          </p>
        </div>

        {/* Hover overlay */}
        <div className={`educator-card__overlay ${hovered ? 'educator-card__overlay--visible' : 'educator-card__overlay--hidden'}`}>
          <p className="educator-card__overlay-name">
            {educator.name}
          </p>
          <span className="educator-card__overlay-role">
            {educator.role}
          </span>
          <p className="educator-card__overlay-desc">
            {educator.description}
          </p>
          <div className="educator-card__stats">
            <div className="educator-card__stat">
              <p className="educator-card__stat-value">
                {educator.courses}
              </p>
              <p className="educator-card__stat-label">
                Courses
              </p>
            </div>
            <div className="educator-card__divider" />
            <div className="educator-card__stat">
              <p className="educator-card__stat-value">
                {educator.students.toLocaleString()}
              </p>
              <p className="educator-card__stat-label">
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