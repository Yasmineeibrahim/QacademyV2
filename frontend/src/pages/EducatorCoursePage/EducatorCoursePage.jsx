// src/pages/EducatorCoursePage.jsx
import React, { useState} from 'react'

import './EducatorCoursePage.css'

// ── Mock Data (replace with real API data) ─────────────────────────────────
const EDUCATOR = {
  name: 'Dr. Ahmed Nour',
  initials: 'AN',
  department: 'Mathematics & Engineering Sciences',
}

const generateVideos = (courseStudents) => [
  { id: 1, title: 'Introduction & Overview',        duration: '12:30', free: true,  students: courseStudents },
  { id: 2, title: 'Core Concepts Explained',        duration: '18:45', free: false, students: Math.round(courseStudents * 0.82) },
  { id: 3, title: 'Hands-on Practice Session',      duration: '24:10', free: false, students: Math.round(courseStudents * 0.74) },
  { id: 4, title: 'Deep Dive: Advanced Techniques', duration: '31:05', free: false, students: Math.round(courseStudents * 0.61) },
  { id: 5, title: 'Mid-Term Revision',              duration: '22:50', free: false, students: Math.round(courseStudents * 0.55) },
  { id: 6, title: 'Common Pitfalls & How to Avoid', duration: '15:20', free: false, students: Math.round(courseStudents * 0.49) },
  { id: 7, title: 'Project Walkthrough',            duration: '28:40', free: false, students: Math.round(courseStudents * 0.42) },
  { id: 8, title: 'Final Revision',                duration: '10:15', free: false, students: Math.round(courseStudents * 0.38) },
]

const educatorCourses = [
  {
    id: 1,
    title: 'Calculus I – Limits & Derivatives',
    category: 'Mathematics',
    color: '#042a4e',
    semester: 1,
    lessons: 8,
    duration: '4h 20m',
    students: 148,
    status: 'active',
    videos: generateVideos(148),
  },
  {
    id: 2,
    title: 'Calculus II – Integration Techniques',
    category: 'Mathematics',
    color: '#1a4a7a',
    semester: 2,
    lessons: 8,
    duration: '5h 05m',
    students: 112,
    status: 'active',
    videos: generateVideos(112),
  },
  {
    id: 3,
    title: 'Linear Algebra & Matrix Theory',
    category: 'Mathematics',
    color: '#042a4e',
    semester: 3,
    lessons: 8,
    duration: '4h 50m',
    students: 89,
    status: 'active',
    videos: generateVideos(89),
  },
  {
    id: 4,
    title: 'Differential Equations for Engineers',
    category: 'Mathematics',
    color: '#1a4a7a',
    semester: 4,
    lessons: 8,
    duration: '5h 30m',
    students: 0,
    status: 'draft',
    videos: generateVideos(0),
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────
const getStripeClass = (color) =>
  color === '#1a4a7a' ? 'ecp-course-card__stripe--blue' : 'ecp-course-card__stripe--dark'

const SORTS = [
  { key: 'default',  label: 'Default'   },
  { key: 'students', label: 'Students ↓' },
  { key: 'semester', label: 'Semester'  },
  { key: 'title',    label: 'A → Z'     },
]

const TABS = [
  { key: 'all',    label: 'All Courses' },
  { key: 'active', label: 'Active'      },
  { key: 'draft',  label: 'Draft'       },
]

// ── Video Row ──────────────────────────────────────────────────────────────
const VideoRow = ({ video, maxStudents }) => {
  const pct = maxStudents > 0 ? Math.round((video.students / maxStudents) * 100) : 0

  return (
    <div className="ecp-video-row">

      {/* Info */}
      <div className="ecp-video-row__info">
        <div className={`ecp-video-row__num ${video.free ? 'ecp-video-row__num--free' : ''}`}>
          {video.id}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="ecp-video-row__title">{video.title}</p>
            {video.free && <span className="ecp-video-row__free-chip">Free</span>}
          </div>
          <p className="ecp-video-row__dur">⏱ {video.duration}</p>
        </div>
      </div>

      {/* Students count */}
      <div className="ecp-video-row__cell">
        <span className={`ecp-video-row__students ${video.students === 0 ? 'ecp-video-row__students--zero' : ''}`}>
          {video.students === 0 ? '—' : video.students}
        </span>
      </div>

      {/* Relative bar */}
      <div className="ecp-video-row__cell">
        <div className="ecp-video-row__bar-wrap">
          <div className="ecp-video-row__bar-track">
            <div
              className="ecp-video-row__bar-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="ecp-video-row__bar-pct">{pct}%</span>
        </div>
      </div>

      {/* Access type */}
      <div className="ecp-video-row__cell">
        <span className={`ecp-video-row__access ${video.free ? 'ecp-video-row__access--free' : 'ecp-video-row__access--paid'}`}>
          {video.free ? 'Free' : 'Code'}
        </span>
      </div>

    </div>
  )
}

// ── Course Card ────────────────────────────────────────────────────────────
const EducatorCourseCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false)
  const maxStudents = course.videos[0]?.students || 1

  const completionRate = course.students > 0
    ? Math.round((course.videos[course.videos.length - 1].students / course.students) * 100)
    : 0

  return (
    <div className="ecp-course-card">

      {/* Top row */}
      <div className="ecp-course-card__top">

        {/* Color stripe */}
        <div className={`ecp-course-card__stripe ${getStripeClass(course.color)}`} />

        {/* Main info */}
        <div className="ecp-course-card__main">
          <div className="ecp-course-card__info">
            <div className="ecp-course-card__badges">
              <span className="ecp-badge ecp-badge--category">{course.category}</span>
              <span className="ecp-badge ecp-badge--semester">Semester {course.semester}</span>
              <span className={`ecp-badge ${course.status === 'active' ? 'ecp-badge--active' : 'ecp-badge--draft'}`}>
                {course.status === 'active' ? '● Active' : '○ Draft'}
              </span>
            </div>
            <h3 className="ecp-course-card__title">{course.title}</h3>
            <div className="ecp-course-card__meta">
              <span className="ecp-course-card__meta-item">🎥 {course.lessons} Videos</span>
              <span className="ecp-course-card__meta-item">⏱ {course.duration}</span>
              <span className="ecp-course-card__meta-item">
                📈 {completionRate}% completion rate
              </span>
            </div>
          </div>

          {/* KPI mini-tiles */}
          <div className="ecp-course-card__kpis">
            <div className="ecp-card-kpi">
              <span className="ecp-card-kpi__num">{course.students}</span>
              <span className="ecp-card-kpi__label">Students</span>
            </div>
            <div className="ecp-card-kpi">
              <span className="ecp-card-kpi__num ecp-card-kpi__num--accent">{completionRate}%</span>
              <span className="ecp-card-kpi__label">Completion</span>
            </div>
            <div className="ecp-card-kpi">
              <span className="ecp-card-kpi__num">{course.lessons}</span>
              <span className="ecp-card-kpi__label">Videos</span>
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          className={`ecp-course-card__toggle ${expanded ? 'ecp-course-card__toggle--open' : ''}`}
          onClick={() => setExpanded(v => !v)}
          title={expanded ? 'Collapse' : 'View video breakdown'}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expanded video breakdown */}
      {expanded && (
        <div className="ecp-videos-panel">
          <div className="ecp-videos-panel__header">
            <span>Video</span>
            <span>Students</span>
            <span>Relative Reach</span>
            <span>Access</span>
          </div>
          {course.videos.map(video => (
            <VideoRow key={video.id} video={video} maxStudents={maxStudents} />
          ))}
        </div>
      )}

    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
const EducatorCoursePage = () => {
  const [tab, setTab]       = useState('all')
  const [sort, setSort]     = useState('default')

  // Filter
  const filtered = educatorCourses.filter(c =>
    tab === 'all' ? true : c.status === tab
  )

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'students') return b.students - a.students
    if (sort === 'semester') return a.semester - b.semester
    if (sort === 'title')    return a.title.localeCompare(b.title)
    return 0
  })

  // Aggregate KPIs
  const totalStudents  = educatorCourses.reduce((s, c) => s + c.students, 0)
  const totalCourses   = educatorCourses.length
  const activeCourses  = educatorCourses.filter(c => c.status === 'active').length
  const totalVideos    = educatorCourses.reduce((s, c) => s + c.lessons, 0)

  const tabCounts = {
    all:    educatorCourses.length,
    active: educatorCourses.filter(c => c.status === 'active').length,
    draft:  educatorCourses.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="ecp-page">

      {/* ── Header ── */}
      <div className="ecp-header">
        <div className="ecp-header__inner">

          {/* Profile */}
          <div className="ecp-header__profile">
            <div className="ecp-header__avatar">{EDUCATOR.initials}</div>
            <div className="ecp-header__info">
              <span className="ecp-header__tag">Educator Dashboard</span>
              <h1 className="ecp-header__name">{EDUCATOR.name}</h1>
              <p className="ecp-header__dept">{EDUCATOR.department}</p>
            </div>
          </div>

          {/* KPI pills */}
          <div className="ecp-header__kpis">
            <div className="ecp-kpi">
              <span className="ecp-kpi__num">{totalCourses}</span>
              <span className="ecp-kpi__label">Courses</span>
            </div>
            <div className="ecp-kpi">
              <span className="ecp-kpi__num">{activeCourses}</span>
              <span className="ecp-kpi__label">Active</span>
            </div>
            <div className="ecp-kpi">
              <span className="ecp-kpi__num">{totalVideos}</span>
              <span className="ecp-kpi__label">Videos</span>
            </div>
            <div className="ecp-kpi">
              <span className="ecp-kpi__num">{totalStudents}</span>
              <span className="ecp-kpi__label">Students</span>
            </div>
          </div>
        </div>

        {/* Tab strip inside header */}
        <div className="ecp-tabs">
          <div className="ecp-tabs__inner">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`ecp-tab-btn ${tab === t.key ? 'ecp-tab-btn--active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label} ({tabCounts[t.key]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky sub-nav ── */}
      <div className="ecp-subnav">
        <div className="ecp-subnav__inner">
          <p className="ecp-subnav__left">
            Showing <strong>{sorted.length}</strong> course{sorted.length !== 1 ? 's' : ''}
            {' · '}click <strong>▼</strong> on any card to see per-video stats
          </p>
          <div className="ecp-subnav__right">
            {SORTS.map(s => (
              <button
                key={s.key}
                className={`ecp-sort-btn ${sort === s.key ? 'ecp-sort-btn--active' : ''}`}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="ecp-body">
        {sorted.length === 0 ? (
          <div className="ecp-empty">
            <div className="ecp-empty__emoji">📭</div>
            <p className="ecp-empty__title">No courses found.</p>
            <p className="ecp-empty__sub">Try switching tabs or check back later.</p>
          </div>
        ) : (
          sorted.map(course => (
            <EducatorCourseCard key={course.id} course={course} />
          ))
        )}
      </div>

    </div>
  )
}

export default EducatorCoursePage