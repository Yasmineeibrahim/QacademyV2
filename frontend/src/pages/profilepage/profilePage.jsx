import React, { useState } from 'react'
import './profilePage.css'

const ProfilePage = ({ role = 'student' }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    newMessages: true,
    promotions: false,
    weeklyDigest: true,
  })
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 234-5678',
    bio: 'Passionate learner exploring web development and UI/UX design.',
    location: 'New York, USA',
    website: 'alexjohnson.dev',
    timezone: 'EST (UTC-5)',
  })

  const achievements = [
    { icon: '🏆', label: 'Top Learner', desc: 'Completed 10+ courses' },
    { icon: '🔥', label: '30-Day Streak', desc: 'Consistent daily learning' },
    { icon: '⭐', label: 'Course Star', desc: '5-star reviewer' },
    { icon: '💡', label: 'Quick Starter', desc: 'First course in 24h' },
  ]

  const stats = [
    { value: '12', label: 'Courses Enrolled', icon: '📚', color: '#0ea5e9' },
    { value: '8', label: 'Completed', icon: '✅', color: '#10b981' },
    { value: '47h', label: 'Hours Learned', icon: '⏱️', color: '#8b5cf6' },
    { value: '4.8', label: 'Avg. Rating Given', icon: '⭐', color: '#f59e0b' },
  ]

  return (
    <main className="page profile-page">
      {/* ── Header banner ── */}
      <div className="profile-banner">
        <div className="profile-banner__bg" />
        <div className="profile-banner__content">
          <div className="profile-avatar-wrap">
            <div className="avatar profile-avatar" style={{ width: 96, height: 96, fontSize: '2rem' }}>AJ</div>
            <button className="avatar-edit-btn" title="Change photo">✏️</button>
          </div>
          <div className="profile-banner__info">
            <h1 className="profile-banner__name">{profile.name}</h1>
            <p className="profile-banner__meta">
              <span className="badge badge--blue">Student</span>
              <span className="profile-dot" />
              <span>📍 {profile.location}</span>
              <span className="profile-dot" />
              <span>Member since Jan 2024</span>
            </p>
          </div>
          <button className="btn btn--ghost profile-edit-btn" onClick={() => setEditMode(v => !v)}>
            {editMode ? '✔ Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* ── Stat strip ── */}
      <div className="profile-stats-strip grid-4">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card__icon" style={{ background: s.color + '18' }}>
              <span>{s.icon}</span>
            </div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        {['profile', 'settings', 'achievements'].map(t => (
          <button
            key={t}
            className={`profile-tab${activeTab === t ? ' profile-tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'profile' && (
        <div className="grid-2 profile-tab-content">
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">Personal Information</h2>
              {[
                { label: 'Full Name', key: 'name', icon: '👤' },
                { label: 'Email Address', key: 'email', icon: '✉️' },
                { label: 'Phone Number', key: 'phone', icon: '📱' },
                { label: 'Location', key: 'location', icon: '📍' },
                { label: 'Website', key: 'website', icon: '🌐' },
                { label: 'Timezone', key: 'timezone', icon: '🕐' },
              ].map(({ label, key, icon }) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{icon} {label}</label>
                  {editMode
                    ? <input className="form-input" value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                    : <div className="profile-field-val">{profile[key]}</div>}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">About Me</h2>
              <div className="form-group">
                <label className="form-label">💬 Bio</label>
                {editMode
                  ? <textarea className="form-input" rows={4} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                  : <div className="profile-bio">{profile.bio}</div>}
              </div>
              <div className="profile-divider" />
              <h3 className="profile-subsec">🎓 Learning Interests</h3>
              <div className="profile-tags">
                {['Web Development', 'UI/UX Design', 'React', 'Data Science', 'Mobile Apps'].map(t => (
                  <span key={t} className="badge badge--blue">{t}</span>
                ))}
              </div>
              <div className="profile-divider" />
              <h3 className="profile-subsec">📈 Learning Goal</h3>
              <div className="goal-track-wrap">
                <div className="goal-track-label">
                  <span>Monthly Target: 20h</span>
                  <span className="goal-track-pct">74%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: '74%' }} /></div>
                <p className="goal-track-hint">14.8h completed this month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid-2 profile-tab-content">
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">Notification Preferences</h2>
              {Object.entries(notifications).map(([key, val]) => {
                const labels = {
                  courseUpdates: { label: 'Course Updates', desc: 'New lectures and materials' },
                  newMessages: { label: 'New Messages', desc: 'From instructors & peers' },
                  promotions: { label: 'Promotions', desc: 'Deals and discount alerts' },
                  weeklyDigest: { label: 'Weekly Digest', desc: 'Your learning summary' },
                }
                return (
                  <div className="settings-row" key={key}>
                    <div>
                      <div className="settings-row__label">{labels[key].label}</div>
                      <div className="settings-row__desc">{labels[key].desc}</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={val} onChange={() => setNotifications(n => ({ ...n, [key]: !val }))} />
                      <span className="toggle__slider" />
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">Security</h2>
              <div className="form-group">
                <label className="form-label">🔒 Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">🔑 New Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">🔑 Confirm New Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 24 }}>Update Password</button>
              <div className="profile-divider" />
              <h3 className="profile-subsec" style={{ marginBottom: 16 }}>Danger Zone</h3>
              <button className="btn btn--danger" style={{ width: '100%', justifyContent: 'center' }}>🗑️ Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="profile-tab-content">
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {achievements.map(a => (
              <div className="card achievement-card" key={a.label}>
                <div className="card-inner" style={{ textAlign: 'center' }}>
                  <div className="achievement-icon">{a.icon}</div>
                  <div className="achievement-label">{a.label}</div>
                  <div className="achievement-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">Certificates Earned</h2>
              {[
                { course: 'React Fundamentals', date: 'Mar 2025', level: 'Beginner' },
                { course: 'Advanced CSS & Animations', date: 'Jan 2025', level: 'Intermediate' },
                { course: 'JavaScript ES6+', date: 'Nov 2024', level: 'Intermediate' },
              ].map(c => (
                <div className="cert-row" key={c.course}>
                  <div className="cert-row__icon">🎓</div>
                  <div>
                    <div className="cert-row__title">{c.course}</div>
                    <div className="cert-row__meta">{c.date} · {c.level}</div>
                  </div>
                  <button className="btn btn--ghost" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '.8rem' }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProfilePage