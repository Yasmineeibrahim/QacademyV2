import React, { useEffect, useState } from 'react'
import './StudentProfilePage.css'
import StudentProfileHero from '../../components/studentProfileHero/StudentProfileHero'
import StudentInfo from '../../components/studentInfo/StudentInfo'
import ChangePassword from '../../components/changePassword/ChangePassword'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faCalendarAlt, faUser} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
const API_BASE_URL = "https://debian-wed-tales-payments.trycloudflare.com" || "http://localhost:5000";
const PASSWORD_POLICY_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/

const StudentProfilePage = () => {
  const [student, setStudent] = useState(null)

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

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (!storedUser?.id) {
          setStudent(null)
          return
        }

        const res = await axios.get(
          `${API_BASE_URL}/api/accounts/${storedUser.id}`
        )

        setStudent(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchStudent()
  }, [])

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
    setPwStatus(null)
    setPwError('')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    const submitPasswordChange = async () => {
      if (!passwords.current) {
        setPwError('Please enter your current password.')
        setPwStatus('error')
        return
      }

      if (!PASSWORD_POLICY_REGEX.test(passwords.new)) {
        setPwError('New password must be at least 6 characters with one uppercase letter, one number, and one symbol.')
        setPwStatus('error')
        return
      }

      if (passwords.new !== passwords.confirm) {
        setPwError('New passwords do not match.')
        setPwStatus('error')
        return
      }

      try {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (!storedUser?.id) {
          setPwError('You are not logged in.')
          setPwStatus('error')
          return
        }

        await axios.patch(`${API_BASE_URL}/api/accounts/change-password`, {
          id: storedUser.id,
          currentPassword: passwords.current,
          newPassword: passwords.new,
        })

        setPwStatus('success')
        setPwError('')
        setPasswords({ current: '', new: '', confirm: '' })
      } catch (err) {
        setPwStatus('error')
        setPwError(err.response?.data?.message || 'Failed to update password. Please try again.')
      }
    }

    submitPasswordChange()
  }

  if (!student) {
    return <div>Loading...</div>
  }

  const infoFields = [
    { label: 'First name', value: student.first_name, icon: <FontAwesomeIcon icon={faUser} /> },
    { label: 'Last name', value: student.last_name, icon: <FontAwesomeIcon icon={faUser} /> },
    { label: 'Email Address', value: student.email, icon: <FontAwesomeIcon icon={faEnvelope} /> },
    { label: 'Phone Number', value: student.phone_number, icon: <FontAwesomeIcon icon={faPhone} /> },
    { label: 'Enrolled Since', value: student.created_at, icon: <FontAwesomeIcon icon={faCalendarAlt} /> },
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