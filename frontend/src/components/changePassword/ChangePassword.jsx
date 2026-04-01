import React from 'react'
import './ChangePassword.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash ,faLock} from '@fortawesome/free-solid-svg-icons'
const ChangePassword = ({
  passwords,
  pwStatus,
  pwError,
  showCurrent,
  showNew,
  showConfirm,
  handlePasswordChange,
  handlePasswordSubmit,
  setShowCurrent,
  setShowNew,
  setShowConfirm
}) => {
  return (
    <section className="spp-card spp-card--password">
      <div className="spp-card-header">
        <span className="spp-card-icon"><FontAwesomeIcon icon={faLock} /></span>
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
              {showCurrent ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon  icon={faEyeSlash}/>}
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
              {showNew ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon  icon={faEyeSlash}/>}
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
              {showConfirm ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon  icon={faEyeSlash}/>}
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
  )
}

export default ChangePassword