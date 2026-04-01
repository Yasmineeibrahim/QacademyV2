import React, { useState } from 'react'
import './StudentProfilePage.css'
import StudentProfileHero from '../../components/studentProfileHero/StudentProfileHero'
import StudentInfo from '../../components/studentInfo/StudentInfo'
import ChangePassword from '../../components/changePassword/ChangePassword'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faCalendarAlt, faUser} from '@fortawesome/free-solid-svg-icons'

const StudentProfilePage = () => {
  // Mock student data — replace with API fetch
  const [student] = useState({
    first_name: 'Layla',
    last_name: 'Hassan',
    email: 'layla.hassan@university.edu',
    phone_number: '+20 100 234 5678',
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
    {label:'first_name', value: student.first_name, icon: <FontAwesomeIcon icon={faUser} />},
    {label:'last_name', value: student.last_name, icon: <FontAwesomeIcon icon={faUser} />},
    { label: 'Email Address', value: student.email, icon: <FontAwesomeIcon icon={faEnvelope} /> },
    { label: 'Phone Number', value: student.phone_number, icon: <FontAwesomeIcon icon={faPhone} /> },
    { label: 'Enrolled Since', value: student.joined, icon: <FontAwesomeIcon icon={faCalendarAlt} /> },
  ]

  return (
    <div className="spp-root">
      {/* Decorative background blobs */}
      <div className="spp-blob spp-blob-1" />
      <div className="spp-blob spp-blob-2" />

      <div className="spp-container">

        {/* ── Header Card ── */}
        <StudentProfileHero student={student} />

        <div className="spp-grid">

          {/* ── Personal Information ── */}
          <StudentInfo infoFields={infoFields} />

          {/* ── Change Password ── */}
          <ChangePassword
            passwords={passwords}
            pwStatus={pwStatus}
            pwError={pwError}
            showCurrent={showCurrent}
            showNew={showNew}
            showConfirm={showConfirm}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
            setShowCurrent={setShowCurrent}
            setShowNew={setShowNew}
            setShowConfirm={setShowConfirm}
          />

        </div>
      </div>
    </div>
  )
}

export default StudentProfilePage