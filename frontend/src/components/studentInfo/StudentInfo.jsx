import React from 'react'
import './StudentInfo.css'

const StudentInfo = ({ infoFields }) => {
  return (
    <section className="spp-card spp-card--info">
      <div className="spp-card-header">
        <span className="spp-card-icon">👤</span>
        <h2>Personal Information</h2>
      </div>
      <div className="spp-info-list">
        {infoFields.map((f) => (
          <div className="spp-info-row" key={f.label}>
            <div className="spp-info-label">
              <span className="spp-info-icon">{f.icon}</span>
              {f.label}
            </div>
            <div className="spp-info-value">{f.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StudentInfo