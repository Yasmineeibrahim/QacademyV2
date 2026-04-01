// src/pages/EducatorAnalyticsPage.jsx
import React, { useState, useMemo } from 'react'
import './EducatorAnalyticsPage.css'

// ── Constants ──────────────────────────────────────────────────────────────
const EDUCATOR = {
  name: 'Dr. Ahmed Nour',
  initials: 'AN',
  department: 'Mathematics & Engineering Sciences',
}

const VIDEO_FEE  = 50   // EGP per video unlock
const COURSE_FEE = 350  // EGP for full course unlock

// ── Mock Data ──────────────────────────────────────────────────────────────
const COURSES = [
  { id: 1, title: 'Calculus I – Limits & Derivatives',      category: 'Mathematics', color: '#042a4e', semester: 1 },
  { id: 2, title: 'Calculus II – Integration Techniques',    category: 'Mathematics', color: '#1a4a7a', semester: 2 },
  { id: 3, title: 'Linear Algebra & Matrix Theory',          category: 'Mathematics', color: '#042a4e', semester: 3 },
  { id: 4, title: 'Differential Equations for Engineers',    category: 'Mathematics', color: '#1a4a7a', semester: 4 },
]

// Generate realistic student fee records
const generateStudents = (courseId, count) => {
  const firstNames = ['Omar', 'Layla', 'Ahmed', 'Sara', 'Karim', 'Nour', 'Youssef', 'Dina', 'Hassan', 'Mona', 'Tarek', 'Rana', 'Mahmoud', 'Hana', 'Sherif']
  const lastNames  = ['Hassan', 'Mahmoud', 'Ali', 'Ibrahim', 'Saleh', 'Fathi', 'Nour', 'Youssef', 'Kamal', 'Adel']
  const statuses   = ['paid', 'paid', 'paid', 'pending', 'free']

  return Array.from({ length: count }, (_, i) => {
    const fn  = firstNames[i % firstNames.length]
    const ln  = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const status = statuses[i % statuses.length]
    const videosUnlocked = status === 'free' ? 1 : Math.floor(Math.random() * 7) + 2
    const usedFullCode   = status === 'paid' && videosUnlocked === 8
    const fee = status === 'free' ? 0
              : usedFullCode ? COURSE_FEE
              : videosUnlocked * VIDEO_FEE

    return {
      id:             `${courseId}-${i + 1}`,
      studentId:      `ST-${1000 + courseId * 100 + i}`,
      name:           `${fn} ${ln}`,
      initials:       `${fn[0]}${ln[0]}`,
      courseId,
      videosUnlocked,
      usedFullCode,
      fee,
      status,
      date:           `2025-0${Math.min(courseId + i % 3 + 1, 9)}-${String(10 + (i % 18)).padStart(2, '0')}`,
    }
  })
}

const ALL_STUDENTS = [
  ...generateStudents(1, 12),
  ...generateStudents(2, 9),
  ...generateStudents(3, 7),
  ...generateStudents(4, 0),
]

// Pre-compute course stats
const COURSE_STATS = COURSES.map(course => {
  const students = ALL_STUDENTS.filter(s => s.courseId === course.id)
  const revenue  = students.reduce((s, st) => s + st.fee, 0)
  const paid     = students.filter(s => s.status === 'paid').length
  const pending  = students.filter(s => s.status === 'pending').length
  return { ...course, students: students.length, revenue, paid, pending }
})

const TOTAL_REVENUE  = COURSE_STATS.reduce((s, c) => s + c.revenue, 0)
const TOTAL_STUDENTS = ALL_STUDENTS.length
const TOTAL_PAID     = ALL_STUDENTS.filter(s => s.status === 'paid').length
const TOTAL_PENDING  = ALL_STUDENTS.filter(s => s.status === 'pending').length
const MAX_REVENUE    = Math.max(...COURSE_STATS.map(c => c.revenue), 1)

const PERIODS = ['This Month', 'Last Month', 'All Time']
const TABS    = ['Overview', 'All Transactions']
const FILTERS = ['All', 'Paid', 'Pending', 'Free']

const fmt = (n) => `${n.toLocaleString()} EGP`

// ── Student Fee Row (inside card) ──────────────────────────────────────────
const FeeRow = ({ student }) => (
  <div className="eap-fee-row">
    <div className="eap-fee-row__student">
      <div className="eap-fee-row__avatar">{student.initials}</div>
      <span className="eap-fee-row__name">{student.name}</span>
    </div>
    <div className="eap-fee-row__cell">{student.videosUnlocked} / 8</div>
    <div className="eap-fee-row__fee">{fmt(student.fee)}</div>
    <div className="eap-fee-row__status">
      <span className={`eap-status-chip eap-status-chip--${student.status}`}>
        {student.status === 'paid' ? '✓ Paid' : student.status === 'pending' ? '⏳ Pending' : '🔓 Free'}
      </span>
    </div>
  </div>
)

// ── Course Revenue Card ────────────────────────────────────────────────────
const CourseRevenueCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false)
  const students = ALL_STUDENTS.filter(s => s.courseId === course.id)
  const revPct   = Math.round((course.revenue / MAX_REVENUE) * 100)
  const isBlueFill = course.color === '#1a4a7a'

  return (
    <div className="eap-course-card">
      <div className={`eap-course-card__banner eap-course-card__banner--${isBlueFill ? 'blue' : 'dark'}`} />

      <div className="eap-course-card__body">

        {/* Top row: badges + total revenue */}
        <div className="eap-course-card__top-row">
          <div className="eap-course-card__badges">
            <span className="eap-cbadge eap-cbadge--cat">{course.category}</span>
            <span className="eap-cbadge eap-cbadge--sem">Sem {course.semester}</span>
          </div>
          <span className="eap-course-card__revenue">{fmt(course.revenue)}</span>
        </div>

        <h3 className="eap-course-card__title">{course.title}</h3>

        {/* Mini stats */}
        <div className="eap-course-card__stats">
          <div className="eap-mini-stat">
            <span className="eap-mini-stat__num">{course.students}</span>
            <span className="eap-mini-stat__label">Students</span>
          </div>
          <div className="eap-mini-stat">
            <span className="eap-mini-stat__num">{course.paid}</span>
            <span className="eap-mini-stat__label">Paid</span>
          </div>
          <div className="eap-mini-stat">
            <span className="eap-mini-stat__num">{course.pending}</span>
            <span className="eap-mini-stat__label">Pending</span>
          </div>
        </div>

        {/* Revenue bar relative to best course */}
        <div className="eap-course-card__rev-bar">
          <div className="eap-course-card__rev-track">
            <div
              className={`eap-course-card__rev-fill${isBlueFill ? ' eap-course-card__rev-fill--blue' : ''}`}
              style={{ width: `${revPct}%` }}
            />
          </div>
          <div className="eap-course-card__rev-caption">
            <span>{revPct}% of top course revenue</span>
            <span>{course.students > 0 ? fmt(Math.round(course.revenue / course.students)) : '—'} / student</span>
          </div>
        </div>

        {/* Expand students */}
        {students.length > 0 && (
          <>
            <button
              className="eap-course-card__expand-btn"
              onClick={() => setExpanded(v => !v)}
            >
              {expanded ? '▲ Hide students' : `▼ Show ${students.length} students`}
            </button>

            {expanded && (
              <div className="eap-fee-table">
                <div className="eap-fee-table__header">
                  <span>Student</span>
                  <span>Videos</span>
                  <span>Fee</span>
                  <span>Status</span>
                </div>
                {students.map(s => <FeeRow key={s.id} student={s} />)}
              </div>
            )}
          </>
        )}

        {students.length === 0 && (
          <p style={{ fontSize: 12, color: 'rgba(4,42,78,0.35)', marginTop: 8, textAlign: 'center' }}>
            No enrollments yet
          </p>
        )}
      </div>
    </div>
  )
}

// ── Full Transactions Table ────────────────────────────────────────────────
const TransactionsTable = () => {
  const [filter, setFilter] = useState('All')

  const rows = useMemo(() => {
    const list = filter === 'All'
      ? ALL_STUDENTS
      : ALL_STUDENTS.filter(s => s.status === filter.toLowerCase())
    return list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [filter])

  const courseTitle = (id) => COURSES.find(c => c.id === id)?.title ?? '—'

  return (
    <div className="eap-full-table-wrap">
      <div className="eap-full-table-toolbar">
        <span className="eap-full-table-toolbar__title">
          All Student Transactions · {rows.length} record{rows.length !== 1 ? 's' : ''}
        </span>
        <div className="eap-full-table-toolbar__right">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`eap-filter-btn ${filter === f ? 'eap-filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="eap-full-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Videos</th>
              <th>Date</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(4,42,78,0.3)' }}>
                  No records found
                </td>
              </tr>
            ) : rows.map(s => (
              <tr key={s.id}>
                <td>
                  <div className="eap-table-student">
                    <div className="eap-table-avatar">{s.initials}</div>
                    <div>
                      <div className="eap-table-student-name">{s.name}</div>
                      <div className="eap-table-student-id">{s.studentId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="eap-table-course" title={courseTitle(s.courseId)}>
                    {courseTitle(s.courseId)}
                  </span>
                </td>
                <td>{s.videosUnlocked} / 8</td>
                <td>{s.date}</td>
                <td><span className="eap-table-fee">{fmt(s.fee)}</span></td>
                <td>
                  <span className={`eap-status-chip eap-status-chip--${s.status}`}>
                    {s.status === 'paid' ? '✓ Paid' : s.status === 'pending' ? '⏳ Pending' : '🔓 Free'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
const EducatorAnalyticsPage = () => {
  const [period, setPeriod] = useState('All Time')
  const [tab, setTab]       = useState('Overview')

  return (
    <div className="eap-page">

      {/* ── Header ── */}
      <div className="eap-header">
        <div className="eap-header__inner">

          {/* Profile */}
          <div className="eap-header__profile">
            <div className="eap-header__avatar">{EDUCATOR.initials}</div>
            <div>
              <span className="eap-header__tag">Revenue Analytics</span>
              <h1 className="eap-header__name">{EDUCATOR.name}</h1>
              <p className="eap-header__dept">{EDUCATOR.department}</p>
            </div>
          </div>

          {/* Period selector */}
          <div className="eap-header__controls">
            <span className="eap-period-label">Period</span>
            <div className="eap-period-pills">
              {PERIODS.map(p => (
                <button
                  key={p}
                  className={`eap-period-btn ${period === p ? 'eap-period-btn--active' : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue summary bar */}
        <div className="eap-rev-bar">
          <div className="eap-rev-bar__inner">

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Total Revenue</span>
              <span className="eap-rev-stat__val">{fmt(TOTAL_REVENUE)}</span>
              <span className="eap-rev-stat__delta eap-rev-stat__delta--up">↑ 12.4% vs last month</span>
            </div>

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Paid Enrollments</span>
              <span className="eap-rev-stat__val eap-rev-stat__val--white">{TOTAL_PAID}</span>
              <span className="eap-rev-stat__sub">of {TOTAL_STUDENTS} total students</span>
            </div>

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Pending Payments</span>
              <span className="eap-rev-stat__val eap-rev-stat__val--white">{TOTAL_PENDING}</span>
              <span className="eap-rev-stat__sub">
                {fmt(TOTAL_PENDING * VIDEO_FEE * 2)} est. outstanding
              </span>
            </div>

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Avg. Revenue / Student</span>
              <span className="eap-rev-stat__val">
                {TOTAL_STUDENTS > 0 ? fmt(Math.round(TOTAL_REVENUE / TOTAL_STUDENTS)) : '—'}
              </span>
              <span className="eap-rev-stat__delta eap-rev-stat__delta--up">↑ 8.1% vs last month</span>
            </div>

          </div>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="eap-subnav">
        <div className="eap-subnav__inner">
          {TABS.map(t => (
            <button
              key={t}
              className={`eap-subnav__tab ${tab === t ? 'eap-subnav__tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="eap-body">

        {tab === 'Overview' && (
          <>
            <h2 className="eap-section-heading">Revenue by Course</h2>
            <div className="eap-course-grid">
              {COURSE_STATS.map(course => (
                <CourseRevenueCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}

        {tab === 'All Transactions' && (
          <>
            <h2 className="eap-section-heading">All Student Fee Records</h2>
            <TransactionsTable />
          </>
        )}

      </div>
    </div>
  )
}

export default EducatorAnalyticsPage