import React, { useState } from 'react'
import './StudentProfilePage.css'

const StudentProfilePage = () => {
  // Mock student data — replace with API fetch
  const [student] = useState({
    first_name: 'Layla',
    last_name: 'Hassan',
    email: 'layla.hassan@university.edu',
    phone_number: '+20 100 234 5678',
    student_id: 'STU-2024-0391',
    department: 'Computer Science',
    year: '3rd Year',
    gpa: '3.87',
    joined: 'September 2022',
    avatar_initials: 'LH',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [pwStatus, setPwStatus] = useState(null) // 'success' | 'error' | null
  const [pwError, setPwError] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
    setPwStatus(null)
    setPwError('')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!passwords.current) { setPwError('Please enter your current password.'); setPwStatus('error'); return }
    if (passwords.new.length < 8) { setPwError('New password must be at least 8 characters.'); setPwStatus('error'); return }
    if (passwords.new !== passwords.confirm) { setPwError('New passwords do not match.'); setPwStatus('error'); return }
    // TODO: call API to update password
    setPwStatus('success')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const infoFields = [
    { label: 'Student ID', value: student.student_id, icon: '🪪' },
    { label: 'Email Address', value: student.email, icon: '✉️' },
    { label: 'Phone Number', value: student.phone_number, icon: '📞' },
    { label: 'Department', value: student.department, icon: '🏛️' },
    { label: 'Academic Year', value: student.year, icon: '📅' },
    { label: 'GPA', value: student.gpa, icon: '⭐' },
    { label: 'Enrolled Since', value: student.joined, icon: '🗓️' },
  ]

  return (
    <div className="spp-root">
      {/* Decorative background blobs */}
      <div className="spp-blob spp-blob-1" />
      <div className="spp-blob spp-blob-2" />

      <div className="spp-container">

        {/* ── Header Card ── */}
        <div className="spp-hero">
          <div className="spp-avatar">
            <span>{student.avatar_initials}</span>
            <div className="spp-avatar-ring" />
          </div>
          <div className="spp-hero-text">
            <h1 className="spp-name">{student.first_name} {student.last_name}</h1>
            <p className="spp-subtitle">{student.department} · {student.year}</p>
          </div>
          <div className="spp-gpa-badge">
            <span className="spp-gpa-label">GPA</span>
            <span className="spp-gpa-value">{student.gpa}</span>
          </div>
        </div>

        <div className="spp-grid">

          {/* ── Personal Information ── */}
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

          {/* ── Change Password ── */}
          <section className="spp-card spp-card--password">
            <div className="spp-card-header">
              <span className="spp-card-icon">🔒</span>
              <h2>Change Password</h2>
            </div>

            {pwStatus === 'success' && (
              <div className="spp-alert spp-alert--success">
                ✅ Password updated successfully!
              </div>
            )}
            {pwStatus === 'error' && (
              <div className="spp-alert spp-alert--error">
                ⚠️ {pwError}
              </div>
            )}

            <form className="spp-pw-form" onSubmit={handlePasswordSubmit}>
              <div className="spp-field">
                <label>Current Password</label>
                <div className="spp-input-wrap">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <button type="button" className="spp-eye" onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="spp-field">
                <label>New Password</label>
                <div className="spp-input-wrap">
                  <input
                    type={showNew ? 'text' : 'password'}
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                  />
                  <button type="button" className="spp-eye" onClick={() => setShowNew(!showNew)}>
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwords.new && (
                  <div className="spp-strength">
                    <div
                      className={`spp-strength-bar ${passwords.new.length >= 12 ? 'strong' : passwords.new.length >= 8 ? 'medium' : 'weak'}`}
                      style={{ width: `${Math.min(100, (passwords.new.length / 14) * 100)}%` }}
                    />
                    <span>{passwords.new.length >= 12 ? 'Strong' : passwords.new.length >= 8 ? 'Medium' : 'Weak'}</span>
                  </div>
                )}
              </div>

              <div className="spp-field">
                <label>Confirm New Password</label>
                <div className="spp-input-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                  <button type="button" className="spp-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwords.confirm && passwords.new && (
                  <p className={`spp-match-hint ${passwords.new === passwords.confirm ? 'match' : 'no-match'}`}>
                    {passwords.new === passwords.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button type="submit" className="spp-btn-submit">
                Update Password
              </button>
            </form>
          </section>

        </div>
      </div>
    </div>
  )
}

export default StudentProfilePage