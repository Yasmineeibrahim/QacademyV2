import React from 'react'
import './StudentProfileHero.css'

const StudentProfileHero = ({ student }) => {
  const initials = [student?.first_name, student?.last_name]
    .filter(Boolean)
    .map((part) => part[0])
    .join('') || 'U'

  const displayName = [student?.first_name, student?.last_name]
    .filter(Boolean)
    .join(' ')
    || 'Student'

  return (
    <div className="spp-hero">
      <div className="spp-avatar">
        <span>{initials}</span>
        <div className="spp-avatar-ring" />
      </div>
      <div className="spp-hero-text">
        <h1 className="spp-name">{displayName}</h1>
      </div>
    </div>
  )
}

export default StudentProfileHero