import React from 'react'
import './StudentProfileHero.css'

const StudentProfileHero = ({ student }) => {
  return (
    <div className="spp-hero">
      <div className="spp-avatar">
        <span>{student.avatar_initials}</span>
        <div className="spp-avatar-ring" />
      </div>
      <div className="spp-hero-text">
        <h1 className="spp-name">{student.first_name} {student.last_name}</h1>
      </div>
    </div>
  )
}

export default StudentProfileHero