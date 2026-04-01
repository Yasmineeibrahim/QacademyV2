import React, { useState } from 'react'
import './StudentCoursePage.css'

// ── Mock enrolled courses — replace with API data ──
const MOCK_COURSES = [
  {
    id: 1,
    code: 'CS301',
    title: 'Data Structures & Algorithms',
    instructor: 'Dr. Amira Farouk',
    credits: 3,
    schedule: 'Sun / Tue  10:00 – 11:30 AM',
    room: 'Hall B-204',
    progress: 72,
    grade: 'A-',
    status: 'active',
    color: '#2e7d7a',
    icon: '🌐',
  },
  {
    id: 2,
    code: 'CS318',
    title: 'Database Systems',
    instructor: 'Prof. Karim Nour',
    credits: 3,
    schedule: 'Mon / Wed  12:00 – 1:30 PM',
    room: 'Hall A-101',
    progress: 58,
    grade: 'B+',
    status: 'active',
    color: '#c9962f',
    icon: '🗄️',
  },
  {
    id: 3,
    code: 'MATH202',
    title: 'Linear Algebra',
    instructor: 'Dr. Nadia Shawky',
    credits: 3,
    schedule: 'Tue / Thu  2:00 – 3:30 PM',
    room: 'Hall C-110',
    progress: 91,
    grade: 'A',
    status: 'active',
    color: '#6b4a9e',
    icon: '📐',
  },
  {
    id: 4,
    code: 'CS290',
    title: 'Operating Systems',
    instructor: 'Dr. Hossam Zaki',
    credits: 3,
    schedule: 'Sun / Thu  8:00 – 9:30 AM',
    room: 'Lab L-3',
    progress: 45,
    grade: 'B',
    status: 'active',
    color: '#c0392b',
    icon: '💻',
  },
  {
    id: 5,
    code: 'CS205',
    title: 'Introduction to AI',
    instructor: 'Prof. Rana Sobhy',
    credits: 2,
    schedule: 'Wed  4:00 – 6:00 PM',
    room: 'Hall B-301',
    progress: 100,
    grade: 'A+',
    status: 'completed',
    color: '#1a7abf',
    icon: '🤖',
  },
]

const gradeColor = (grade) => {
  if (!grade) return '#7b7b8e'
  if (grade.startsWith('A')) return '#276142'
  if (grade.startsWith('B')) return '#1a5a8c'
  if (grade.startsWith('C')) return '#b56300'
  return '#7b7b8e'
}

const StudentCoursePage = () => {
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'completed'
  const [expandedId, setExpandedId] = useState(null)

  const filtered = MOCK_COURSES.filter(c => filter === 'all' ? true : c.status === filter)
  const totalCredits = filtered.reduce((s, c) => s + c.credits, 0)

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="scp-root">
      <div className="scp-blob scp-blob-1" />
      <div className="scp-blob scp-blob-2" />

      <div className="scp-container">

        {/* ── Page Header ── */}
        <header className="scp-header">
          <div>
            <h1 className="scp-title">My Courses</h1>
            <p className="scp-desc">Track your enrolled courses, schedules, and progress.</p>
          </div>
          <div className="scp-stats">
            <div className="scp-stat">
              <span className="scp-stat-num">{MOCK_COURSES.filter(c => c.status === 'active').length}</span>
              <span className="scp-stat-lbl">Active</span>
            </div>
            <div className="scp-stat-divider" />
            <div className="scp-stat">
              <span className="scp-stat-num">{totalCredits}</span>
              <span className="scp-stat-lbl">Credits</span>
            </div>
            <div className="scp-stat-divider" />
            <div className="scp-stat">
              <span className="scp-stat-num">{MOCK_COURSES.length}</span>
              <span className="scp-stat-lbl">Total</span>
            </div>
          </div>
        </header>

        {/* ── Filter Tabs ── */}
        <div className="scp-tabs">
          {['all', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              className={`scp-tab ${filter === tab ? 'scp-tab--active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="scp-tab-count">
                {tab === 'all' ? MOCK_COURSES.length : MOCK_COURSES.filter(c => c.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Course Cards ── */}
        <div className="scp-list">
          {filtered.map((course, i) => (
            <div
              key={course.id}
              className={`scp-card ${expandedId === course.id ? 'scp-card--open' : ''} ${course.status === 'completed' ? 'scp-card--done' : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Card Top Bar */}
              <div className="scp-card-accent" style={{ background: course.color }} />

              {/* Summary Row (always visible) */}
              <div className="scp-card-summary" onClick={() => toggle(course.id)}>
                <div className="scp-course-icon" style={{ background: course.color + '18', color: course.color }}>
                  {course.icon}
                </div>

                <div className="scp-course-main">
                  <div className="scp-course-top">
                    <span className="scp-course-code" style={{ color: course.color }}>{course.code}</span>
                    {course.status === 'completed' && (
                      <span className="scp-badge scp-badge--done">Completed</span>
                    )}
                    {course.status === 'active' && (
                      <span className="scp-badge scp-badge--active">In Progress</span>
                    )}
                  </div>
                  <h3 className="scp-course-title">{course.title}</h3>
                  <p className="scp-course-instructor">👤 {course.instructor}</p>
                </div>

                {/* Progress + Grade */}
                <div className="scp-course-right">
                  <div className="scp-grade" style={{ color: gradeColor(course.grade) }}>
                    {course.grade}
                  </div>
                  <div className="scp-progress-wrap">
                    <div className="scp-progress-bar">
                      <div
                        className="scp-progress-fill"
                        style={{ width: `${course.progress}%`, background: course.color }}
                      />
                    </div>
                    <span className="scp-progress-pct">{course.progress}%</span>
                  </div>
                </div>

                <div className={`scp-chevron ${expandedId === course.id ? 'open' : ''}`}>›</div>
              </div>

              {/* Expanded Details */}
              {expandedId === course.id && (
                <div className="scp-card-details">
                  <div className="scp-detail-grid">
                    <div className="scp-detail-item">
                      <span className="scp-detail-icon">🕐</span>
                      <div>
                        <p className="scp-detail-label">Schedule</p>
                        <p className="scp-detail-value">{course.schedule}</p>
                      </div>
                    </div>
                    <div className="scp-detail-item">
                      <span className="scp-detail-icon">📍</span>
                      <div>
                        <p className="scp-detail-label">Room</p>
                        <p className="scp-detail-value">{course.room}</p>
                      </div>
                    </div>
                    <div className="scp-detail-item">
                      <span className="scp-detail-icon">📚</span>
                      <div>
                        <p className="scp-detail-label">Credit Hours</p>
                        <p className="scp-detail-value">{course.credits} Credits</p>
                      </div>
                    </div>
                    <div className="scp-detail-item">
                      <span className="scp-detail-icon">🎯</span>
                      <div>
                        <p className="scp-detail-label">Current Grade</p>
                        <p className="scp-detail-value" style={{ color: gradeColor(course.grade), fontWeight: 700 }}>
                          {course.grade}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="scp-empty">
              <span>📭</span>
              <p>No {filter} courses found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default StudentCoursePage