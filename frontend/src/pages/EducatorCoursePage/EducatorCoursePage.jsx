import React, { useEffect, useMemo, useState } from 'react'

import './EducatorCoursePage.css'
import {
  EducatorCourse,
  EducatorCoursesAnalytics,
} from '../../models/courseModels'
import { API_BASE_URL } from '../../config/api'

const toInitials = (firstName = '', lastName = '', email = '') => {
  const letters = [firstName?.[0], lastName?.[0]].filter(Boolean)
  if (letters.length > 0) return letters.join('').toUpperCase()
  return (email?.[0] || 'E').toUpperCase()
}

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

const VideoRow = ({ video, maxStudents }) => {
  const pct = video.getRelativeReach(maxStudents)

  return (
    <div className="ecp-video-row">

      {/* Info */}
      <div className="ecp-video-row__info">
        <div className={`ecp-video-row__num ${video.free ? 'ecp-video-row__num--free' : ''}`}>
          {video.order}
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

const EducatorCourseCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false)
  const maxStudents = course.getMaxVideoStudents()
  const completionRate = course.getCompletionRate()

  return (
    <div className="ecp-course-card">

      {/* Top row */}
      <div className="ecp-course-card__top">

        {/* Color stripe */}
        <div className={`ecp-course-card__stripe ${course.getStripeClass()}`} />

        {/* Main info */}
        <div className="ecp-course-card__main">
          <div className="ecp-course-card__info">
            <div className="ecp-course-card__badges">
              <span className="ecp-badge ecp-badge--category">{course.category}</span>
              <span className="ecp-badge ecp-badge--semester">Semester {course.semester || '—'}</span>
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

const EducatorCoursePage = () => {
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState('default')
  const [educatorCourses, setEducatorCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  }, [])

  const EDUCATOR = useMemo(() => ({
    name:
      [storedUser?.first_name, storedUser?.last_name].filter(Boolean).join(' ') ||
      storedUser?.email ||
      'Educator',
    initials: toInitials(storedUser?.first_name, storedUser?.last_name, storedUser?.email),
    department: 'Mathematics & Engineering Sciences',
  }), [storedUser])

  useEffect(() => {
    const loadEducatorCourses = async () => {
      if (!storedUser?.id) {
        setError('No logged-in educator found.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const res = await fetch(`${API_BASE_URL}/api/courses/educator/${storedUser.id}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch educator courses (${res.status})`)
        }

        const data = await res.json()
        const mapped = (Array.isArray(data) ? data : []).map((course) => {
          const videos = (Array.isArray(course.videos) ? course.videos : []).map((video, index) => ({
            id: video.id ?? `${course.id}-${index + 1}`,
            order: Number(video.order_index) || index + 1,
            title: video.title || `Video ${index + 1}`,
            duration: video.duration || '0m 0s',
            free: Number(video.price) === 0,
            students: Number(video.students || 0),
          }))

          const lessons = videos.length > 0
            ? videos.length
            : Number(course.lessons || 0)
          const students = Number(course.students || 0)

          return new EducatorCourse({
            id: course.id,
            title: course.title,
            category: course.category,
            color: course.color,
            semester: course.semester,
            lessons,
            duration: course.duration || '0h 0m',
            students,
            status: lessons > 0 ? 'active' : 'draft',
            videos,
          })
        })

        setEducatorCourses(mapped)
      } catch (fetchErr) {
        console.error(fetchErr)
        setError('Failed to load educator courses from the server.')
      } finally {
        setLoading(false)
      }
    }

    loadEducatorCourses()
  }, [storedUser])

  const filtered = EducatorCoursesAnalytics.filterByTab(educatorCourses, tab)
  const sorted = EducatorCoursesAnalytics.sortCourses(filtered, sort)
  const { totalStudents, totalCourses, activeCourses, totalVideos } =
    EducatorCoursesAnalytics.getAggregateStats(educatorCourses)
  const tabCounts = EducatorCoursesAnalytics.getTabCounts(educatorCourses)

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
        {loading ? (
          <div className="ecp-empty">
            <div className="ecp-empty__emoji">⏳</div>
            <p className="ecp-empty__title">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="ecp-empty">
            <div className="ecp-empty__emoji">⚠️</div>
            <p className="ecp-empty__title">{error}</p>
          </div>
        ) : sorted.length === 0 ? (
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