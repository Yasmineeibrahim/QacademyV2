// src/pages/AdminControlPage.jsx
import React, { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import './AdminControlPage.css'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const initAccounts = [
  { id: 1,  name: 'Dr. Ahmed Nour',    email: 'ahmed.nour@qa.edu',    role: 'doctor',  status: 'active',  joined: '2024-09-01' },
  { id: 2,  name: 'Dr. Sara Mahmoud',  email: 'sara.m@qa.edu',        role: 'doctor',  status: 'active',  joined: '2024-09-03' },
  { id: 3,  name: 'Dr. Karim Saleh',   email: 'karim.s@qa.edu',       role: 'doctor',  status: 'active',  joined: '2024-09-10' },
  { id: 4,  name: 'Dr. Layla Hassan',  email: 'layla.h@qa.edu',       role: 'doctor',  status: 'blocked', joined: '2024-10-01' },
  { id: 5,  name: 'Omar Ibrahim',      email: 'omar.i@student.qa',    role: 'student', status: 'active',  joined: '2024-09-15' },
  { id: 6,  name: 'Nour Fathi',        email: 'nour.f@student.qa',    role: 'student', status: 'active',  joined: '2024-09-16' },
  { id: 7,  name: 'Youssef Ali',       email: 'youssef.a@student.qa', role: 'student', status: 'blocked', joined: '2024-09-20' },
  { id: 8,  name: 'Dina Kamal',        email: 'dina.k@student.qa',    role: 'student', status: 'active',  joined: '2024-10-05' },
  { id: 9,  name: 'Platform Admin',    email: 'admin@qa.edu',         role: 'admin',   status: 'active',  joined: '2024-08-01' },
  { id: 10, name: 'Hassan Saleh',      email: 'hassan.s@student.qa',  role: 'student', status: 'active',  joined: '2024-10-12' },
]

const initCourses = [
  { id: 1, title: 'Calculus I – Limits & Derivatives', doctor: 'Dr. Ahmed Nour',   category: 'Mathematics', color: '#042a4e', semester: 1, videos: 8, students: 148 },
  { id: 2, title: 'Calculus II – Integration',          doctor: 'Dr. Ahmed Nour',   category: 'Mathematics', color: '#1a4a7a', semester: 2, videos: 8, students: 112 },
  { id: 3, title: 'Physics I – Mechanics',              doctor: 'Dr. Sara Mahmoud', category: 'Physics',     color: '#042a4e', semester: 1, videos: 8, students: 98  },
  { id: 4, title: 'Intro to Programming – C++',         doctor: 'Dr. Layla Hassan', category: 'CS',         color: '#1a4a7a', semester: 2, videos: 8, students: 160 },
  { id: 5, title: 'DC Circuits Analysis',               doctor: 'Dr. Karim Saleh',  category: 'Electrical',  color: '#042a4e', semester: 3, videos: 8, students: 80  },
]

const GROWTH_DATA = [
  { month: 'Sep', students: 40,  doctors: 3, views: 320  },
  { month: 'Oct', students: 95,  doctors: 4, views: 610  },
  { month: 'Nov', students: 180, doctors: 4, views: 1100 },
  { month: 'Dec', students: 220, doctors: 5, views: 1450 },
  { month: 'Jan', students: 290, doctors: 5, views: 1980 },
  { month: 'Feb', students: 349, doctors: 5, views: 2640 },
]

const ROLE_PIE = [
  { name: 'Students', value: 6 },
  { name: 'Doctors',  value: 3 },
  { name: 'Admins',   value: 1 },
]

const PIE_COLORS = ['#042a4e', '#1a4a7a', '#fff613']

const TOOLTIP_STYLE = {
  background: '#042a4e', border: 'none', borderRadius: 8,
  color: '#fff', fontSize: 12, fontWeight: 600, padding: '8px 14px',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={TOOLTIP_STYLE}>
      {label && <p style={{ color: '#fff613', marginBottom: 4, fontSize: 11 }}>{label}</p>}
      {payload.map((p, i) => <p key={i} style={{ margin: 0 }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'overview',  label: 'Overview',    icon: '📊' },
  { key: 'accounts',  label: 'Accounts',    icon: '👥', section: 'MANAGE' },
  { key: 'courses',   label: 'Courses',     icon: '📚' },
]

// ─────────────────────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, footer }) => (
  <div className="acp-overlay" onClick={onClose}>
    <div className="acp-modal" onClick={e => e.stopPropagation()}>
      <div className="acp-modal__header">
        <h3 className="acp-modal__title">{title}</h3>
        <button className="acp-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="acp-modal__body">{children}</div>
      {footer && <div className="acp-modal__footer">{footer}</div>}
    </div>
  </div>
)

const FormGroup = ({ label, children }) => (
  <div className="acp-form-group">
    <label className="acp-form-label">{label}</label>
    {children}
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW PANEL
// ─────────────────────────────────────────────────────────────────────────────
const OverviewPanel = ({ accounts, courses }) => {
  const totalStudents = accounts.filter(a => a.role === 'student').length
  const totalDoctors  = accounts.filter(a => a.role === 'doctor').length
  const totalCourses  = courses.length
  const totalVideos   = courses.reduce((s, c) => s + c.videos, 0)

  const rolePie = [
    { name: 'Students', value: totalStudents },
    { name: 'Doctors',  value: totalDoctors  },
    { name: 'Admins',   value: accounts.filter(a => a.role === 'admin').length },
  ]

  return (
    <>
      {/* KPI cards */}
      <div className="acp-kpi-grid">
        {[
          { icon: '🎓', iconClass: 'acp-kpi-card__icon--blue',   val: totalStudents, label: 'Total Students',  delta: '+12%', up: true },
          { icon: '👨‍🏫', iconClass: 'acp-kpi-card__icon--yellow', val: totalDoctors,  label: 'Instructors',     delta: '+1',   up: true },
          { icon: '📚', iconClass: '',                            val: totalCourses,  label: 'Active Courses',  delta: '+2',   up: true },
          { icon: '🎥', iconClass: 'acp-kpi-card__icon--green',  val: totalVideos,   label: 'Total Videos',    delta: '+16',  up: true },
        ].map((k, i) => (
          <div key={i} className="acp-kpi-card">
            <div className={`acp-kpi-card__icon ${k.iconClass}`}>{k.icon}</div>
            <div>
              <span className="acp-kpi-card__val">{k.val}</span>
              <span className="acp-kpi-card__label">{k.label}</span>
              <span className={`acp-kpi-card__delta ${k.up ? 'acp-kpi-card__delta--up' : 'acp-kpi-card__delta--down'}`}>
                {k.up ? '↑' : '↓'} {k.delta} this month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="acp-charts-2col">
        <div className="acp-chart-card">
          <div className="acp-chart-card__header">
            <div>
              <p className="acp-chart-title">Platform Growth</p>
              <p className="acp-chart-sub">Student registrations & video views over time</p>
            </div>
            <span className="acp-chart-badge">Line Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={GROWTH_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(4,42,78,0.07)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="students" name="Students" stroke="#042a4e" strokeWidth={2.5}
                dot={{ fill: '#fff613', stroke: '#042a4e', strokeWidth: 2, r: 3 }} />
              <Line type="monotone" dataKey="views" name="Views" stroke="#1a4a7a" strokeWidth={2} strokeDasharray="4 2"
                dot={false} />
              <Legend formatter={v => <span style={{ fontSize: 11, color: 'rgba(4,42,78,0.6)', fontWeight: 600 }}>{v}</span>} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="acp-chart-card">
          <div className="acp-chart-card__header">
            <div>
              <p className="acp-chart-title">Users by Role</p>
              <p className="acp-chart-sub">Distribution across platform</p>
            </div>
            <span className="acp-chart-badge">Pie Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={rolePie} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {rolePie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={TOOLTIP_STYLE} />
              <Legend formatter={v => <span style={{ fontSize: 11, color: 'rgba(4,42,78,0.6)', fontWeight: 600 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enrollments bar */}
      <div className="acp-chart-card">
        <div className="acp-chart-card__header">
          <div>
            <p className="acp-chart-title">Enrollments per Course</p>
            <p className="acp-chart-sub">Number of students enrolled in each course</p>
          </div>
          <span className="acp-chart-badge">Bar Chart</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={courses.map(c => ({ name: c.title.split('–')[0].trim(), students: c.students }))} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(4,42,78,0.07)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="students" fill="#042a4e" radius={[5,5,0,0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNTS PANEL
// ─────────────────────────────────────────────────────────────────────────────
const AccountsPanel = ({ accounts, setAccounts }) => {
  const [search, setSearch]     = useState('')
  const [roleFilter, setRole]   = useState('all')
  const [modal, setModal]       = useState(null)   // 'add' | 'delete:{id}' | 'confirm-block:{id}'
  const [form, setForm]         = useState({ name: '', email: '', role: 'student', password: '' })

  const filtered = useMemo(() => accounts.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || a.role === roleFilter
    return matchSearch && matchRole
  }), [accounts, search, roleFilter])

  const toggleBlock = (id) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'blocked' : 'active' } : a))
    setModal(null)
  }

  const deleteAccount = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
    setModal(null)
  }

  const addAccount = () => {
    if (!form.name || !form.email) return
    const newAcc = { id: Date.now(), ...form, status: 'active', joined: new Date().toISOString().split('T')[0] }
    setAccounts(prev => [newAcc, ...prev])
    setModal(null)
    setForm({ name: '', email: '', role: 'student', password: '' })
  }

  const targetAccount = modal?.startsWith('confirm-') ? accounts.find(a => a.id === Number(modal.split(':')[1])) : null
  const deleteTarget  = modal?.startsWith('delete:')   ? accounts.find(a => a.id === Number(modal.split(':')[1])) : null

  return (
    <>
      <div className="acp-table-card">
        <div className="acp-table-toolbar">
          <span className="acp-table-toolbar__title">All Accounts · {filtered.length} records</span>
          <div className="acp-table-toolbar__right">
            <div className="acp-search-wrap">
              <input className="acp-search-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {['all','student','doctor','admin'].map(r => (
              <button key={r} className={`acp-btn acp-btn--sm ${roleFilter === r ? 'acp-btn--primary' : 'acp-btn--ghost'}`}
                onClick={() => setRole(r)}>
                {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
              </button>
            ))}
            <button className="acp-btn acp-btn--primary" onClick={() => setModal('add')}>＋ Add Account</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="acp-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(acc => (
                <tr key={acc.id}>
                  <td>
                    <div className="acp-table-user">
                      <div className="acp-table-avatar">{acc.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                      <div>
                        <div className="acp-table-name">{acc.name}</div>
                        <div className="acp-table-email">{acc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`acp-role-badge acp-role-badge--${acc.role}`}>{acc.role}</span></td>
                  <td><span className={`acp-status-badge acp-status-badge--${acc.status}`}>
                    {acc.status === 'active' ? '● Active' : '⊘ Blocked'}
                  </span></td>
                  <td>{acc.joined}</td>
                  <td>
                    <div className="acp-table-actions">
                      <button
                        className={`acp-btn acp-btn--sm ${acc.status === 'active' ? 'acp-btn--warn' : 'acp-btn--ghost'}`}
                        onClick={() => setModal(`confirm-block:${acc.id}`)}
                      >
                        {acc.status === 'active' ? '⊘ Block' : '✓ Unblock'}
                      </button>
                      <button className="acp-btn acp-btn--sm acp-btn--danger" onClick={() => setModal(`delete:${acc.id}`)}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {modal === 'add' && (
        <Modal title="➕ Create New Account" onClose={() => setModal(null)}
          footer={<>
            <button className="acp-btn acp-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="acp-btn acp-btn--primary" onClick={addAccount}>Create Account</button>
          </>}>
          <FormGroup label="Full Name">
            <input className="acp-form-input" placeholder="e.g. Dr. Ahmed Nour" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </FormGroup>
          <FormGroup label="Email Address">
            <input className="acp-form-input" type="email" placeholder="user@qa.edu" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </FormGroup>
          <FormGroup label="Role">
            <select className="acp-form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="student">Student</option>
              <option value="doctor">Doctor / Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </FormGroup>
          <FormGroup label="Temporary Password">
            <input className="acp-form-input" type="password" placeholder="Min. 8 characters" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </FormGroup>
        </Modal>
      )}

      {/* Block/Unblock Confirm */}
      {modal?.startsWith('confirm-block:') && targetAccount && (
        <Modal title={targetAccount.status === 'active' ? '⊘ Block Account' : '✓ Unblock Account'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="acp-btn acp-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className={`acp-btn ${targetAccount.status === 'active' ? 'acp-btn--danger' : 'acp-btn--primary'}`}
              onClick={() => toggleBlock(targetAccount.id)}>
              {targetAccount.status === 'active' ? 'Yes, Block' : 'Yes, Unblock'}
            </button>
          </>}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(4,42,78,0.7)', lineHeight: 1.6 }}>
            Are you sure you want to <strong>{targetAccount.status === 'active' ? 'block' : 'unblock'}</strong>{' '}
            <strong>{targetAccount.name}</strong>?{' '}
            {targetAccount.status === 'active'
              ? 'They will lose access to the platform immediately.'
              : 'They will regain full access to the platform.'}
          </p>
        </Modal>
      )}

      {/* Delete Confirm */}
      {modal?.startsWith('delete:') && deleteTarget && (
        <Modal title="🗑 Delete Account" onClose={() => setModal(null)}
          footer={<>
            <button className="acp-btn acp-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="acp-btn acp-btn--danger" onClick={() => deleteAccount(deleteTarget.id)}>Delete Permanently</button>
          </>}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(4,42,78,0.7)', lineHeight: 1.6 }}>
            This will <strong>permanently delete</strong> the account of <strong>{deleteTarget.name}</strong>.
            This action cannot be undone.
          </p>
        </Modal>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSES PANEL
// ─────────────────────────────────────────────────────────────────────────────
const CoursesPanel = ({ courses, setCourses }) => {
  const [search, setSearch] = useState('')
  const [modal, setModal]   = useState(null)
  const [form, setForm]     = useState({ title: '', doctor: '', category: '', semester: 1, color: '#042a4e' })
  const [videoModal, setVideoModal] = useState(null)
  const [videoForm, setVideoForm]   = useState({ title: '', duration: '', free: false })

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.doctor.toLowerCase().includes(search.toLowerCase())
  )

  const addCourse = () => {
    if (!form.title || !form.doctor) return
    setCourses(prev => [{ id: Date.now(), ...form, videos: 0, students: 0, semester: Number(form.semester) }, ...prev])
    setModal(null)
    setForm({ title: '', doctor: '', category: '', semester: 1, color: '#042a4e' })
  }

  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id))

  const addVideo = (courseId) => {
    if (!videoForm.title) return
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, videos: c.videos + 1 } : c))
    setVideoModal(null)
    setVideoForm({ title: '', duration: '', free: false })
  }

  const deleteModal = modal?.startsWith('delete:') ? courses.find(c => c.id === Number(modal.split(':')[1])) : null

  return (
    <>
      <div className="acp-table-card">
        <div className="acp-table-toolbar">
          <span className="acp-table-toolbar__title">All Courses · {filtered.length} total</span>
          <div className="acp-table-toolbar__right">
            <div className="acp-search-wrap">
              <input className="acp-search-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="acp-btn acp-btn--primary" onClick={() => setModal('add')}>＋ Add Course</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="acp-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Semester</th>
                <th>Videos</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 4, height: 36, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                      <div>
                        <div className="acp-table-name" style={{ fontSize: 12.5, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                        <div className="acp-table-email">{c.category} · Sem {c.semester}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{c.doctor}</td>
                  <td style={{ fontSize: 12.5 }}>Sem {c.semester}</td>
                  <td style={{ fontSize: 12.5 }}>{c.videos}</td>
                  <td style={{ fontSize: 12.5 }}>{c.students}</td>
                  <td>
                    <div className="acp-table-actions">
                      <button className="acp-btn acp-btn--sm acp-btn--ghost" onClick={() => setVideoModal(c.id)}>
                        ＋ Video
                      </button>
                      <button className="acp-btn acp-btn--sm acp-btn--danger" onClick={() => setModal(`delete:${c.id}`)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {modal === 'add' && (
        <Modal title="📚 Add New Course" onClose={() => setModal(null)}
          footer={<>
            <button className="acp-btn acp-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="acp-btn acp-btn--primary" onClick={addCourse}>Create Course</button>
          </>}>
          <FormGroup label="Course Title">
            <input className="acp-form-input" placeholder="e.g. Calculus I – Limits & Derivatives" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </FormGroup>
          <FormGroup label="Instructor">
            <select className="acp-form-select" value={form.doctor} onChange={e => setForm(p => ({ ...p, doctor: e.target.value }))}>
              <option value="">Select instructor…</option>
              {['Dr. Ahmed Nour','Dr. Sara Mahmoud','Dr. Karim Saleh','Dr. Layla Hassan','Eng. Omar Fathi'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormGroup>
          <FormGroup label="Category">
            <input className="acp-form-input" placeholder="e.g. Mathematics, Physics, CS…" value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          </FormGroup>
          <FormGroup label="Semester">
            <select className="acp-form-select" value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Banner Color">
            <select className="acp-form-select" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}>
              <option value="#042a4e">Dark Navy</option>
              <option value="#1a4a7a">Ocean Blue</option>
            </select>
          </FormGroup>
        </Modal>
      )}

      {/* Add Video Modal */}
      {videoModal && (
        <Modal title="🎥 Add Video to Course" onClose={() => setVideoModal(null)}
          footer={<>
            <button className="acp-btn acp-btn--ghost" onClick={() => setVideoModal(null)}>Cancel</button>
            <button className="acp-btn acp-btn--primary" onClick={() => addVideo(videoModal)}>Add Video</button>
          </>}>
          <FormGroup label="Video Title">
            <input className="acp-form-input" placeholder="e.g. Introduction & Overview" value={videoForm.title}
              onChange={e => setVideoForm(p => ({ ...p, title: e.target.value }))} />
          </FormGroup>
          <FormGroup label="Duration">
            <input className="acp-form-input" placeholder="e.g. 12:30" value={videoForm.duration}
              onChange={e => setVideoForm(p => ({ ...p, duration: e.target.value }))} />
          </FormGroup>
          <FormGroup label="Access Type">
            <select className="acp-form-select" value={videoForm.free ? 'free' : 'paid'}
              onChange={e => setVideoForm(p => ({ ...p, free: e.target.value === 'free' }))}>
              <option value="paid">Paid (requires code)</option>
              <option value="free">Free (publicly accessible)</option>
            </select>
          </FormGroup>
        </Modal>
      )}

      {/* Delete Course Confirm */}
      {deleteModal && (
        <Modal title="🗑 Delete Course" onClose={() => setModal(null)}
          footer={<>
            <button className="acp-btn acp-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="acp-btn acp-btn--danger" onClick={() => { deleteCourse(deleteModal.id); setModal(null) }}>
              Delete Permanently
            </button>
          </>}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(4,42,78,0.7)', lineHeight: 1.6 }}>
            This will permanently delete <strong>{deleteModal.title}</strong> and all its videos.
            This action cannot be undone.
          </p>
        </Modal>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AdminControlPage = () => {
  const [activeNav, setActiveNav] = useState('overview')
  const [accounts, setAccounts]   = useState(initAccounts)
  const [courses, setCourses]     = useState(initCourses)

  const panelTitle = NAV.find(n => n.key === activeNav)?.label ?? 'Dashboard'

  return (
    <div className="acp-page">

      {/* ── Sidebar ── */}
      <aside className="acp-sidebar">
        <div className="acp-sidebar__header">
          <span className="acp-sidebar__label">QAcademy</span>
          <div className="acp-sidebar__title">Admin Panel</div>
        </div>
        <nav className="acp-sidebar__nav">
          {NAV.map((item, i) => (
            <React.Fragment key={item.key}>
              {item.section && <div className="acp-nav-section">{item.section}</div>}
              <button
                className={`acp-nav-btn ${activeNav === item.key ? 'acp-nav-btn--active' : ''}`}
                onClick={() => setActiveNav(item.key)}
              >
                <span className="acp-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="acp-main">
        <div className="acp-topbar">
          <span className="acp-topbar__title">{panelTitle}</span>
        </div>

        <div className="acp-content">
          {activeNav === 'overview' && <OverviewPanel accounts={accounts} courses={courses} />}
          {activeNav === 'accounts' && <AccountsPanel accounts={accounts} setAccounts={setAccounts} />}
          {activeNav === 'courses'  && <CoursesPanel  courses={courses}   setCourses={setCourses}   />}
        </div>
      </div>

    </div>
  )
}

export default AdminControlPage