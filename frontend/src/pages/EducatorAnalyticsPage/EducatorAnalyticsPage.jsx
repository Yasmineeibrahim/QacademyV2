// src/pages/EducatorAnalyticsPage.jsx
import React, { useEffect, useMemo, useState } from 'react'
import './EducatorAnalyticsPage.css'
import { API_BASE_URL } from '../../config/api'

const PERIODS = ['This Month', 'Last Month', 'All Time']
const TABS = ['Overview', 'All Transactions']
const FILTERS = ['All', 'Paid', 'Free']

const parseMoney = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value !== 'string') return 0
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

const toInitials = (firstName = '', lastName = '', email = '') => {
  const letters = [firstName?.[0], lastName?.[0]].filter(Boolean)
  if (letters.length > 0) return letters.join('').toUpperCase()
  return (email?.[0] || 'E').toUpperCase()
}

const fmt = (n) => `${Math.round(n).toLocaleString()} EGP`

const VideoFeeRow = ({ video, index }) => {
  const status = video.price > 0 ? 'paid' : 'free'

  return (
    <div className="eap-fee-row">
      <div className="eap-fee-row__student">
        <div className="eap-fee-row__avatar">{index + 1}</div>
        <span className="eap-fee-row__name">{video.title}</span>
      </div>
      <div className="eap-fee-row__cell">{video.duration || '—'}</div>
      <div className="eap-fee-row__fee">{fmt(video.price)}</div>
      <div className="eap-fee-row__status">
        <span className={`eap-status-chip eap-status-chip--${status}`}>
          {status === 'paid' ? '✓ Paid' : '🔓 Free'}
        </span>
      </div>
    </div>
  )
}

const CourseRevenueCard = ({ course, maxValue }) => {
  const [expanded, setExpanded] = useState(false)
  const videos = course.videos || []
  const revPct = maxValue > 0 ? Math.round((course.catalogValue / maxValue) * 100) : 0
  const isBlueFill = course.color === '#1a4a7a'

  return (
    <div className="eap-course-card">
      <div className={`eap-course-card__banner eap-course-card__banner--${isBlueFill ? 'blue' : 'dark'}`} />

      <div className="eap-course-card__body">
        <div className="eap-course-card__top-row">
          <div className="eap-course-card__badges">
            <span className="eap-cbadge eap-cbadge--cat">{course.category}</span>
            <span className="eap-cbadge eap-cbadge--sem">Sem {course.semester}</span>
          </div>
          <span className="eap-course-card__revenue">{fmt(course.catalogValue)}</span>
        </div>

        <h3 className="eap-course-card__title">{course.title}</h3>

        <div className="eap-course-card__stats">
          <div className="eap-mini-stat">
            <span className="eap-mini-stat__num">{course.videosCount}</span>
            <span className="eap-mini-stat__label">Videos</span>
          </div>
          <div className="eap-mini-stat">
            <span className="eap-mini-stat__num">{course.paidVideos}</span>
            <span className="eap-mini-stat__label">Paid</span>
          </div>
          <div className="eap-mini-stat">
            <span className="eap-mini-stat__num">{course.freeVideos}</span>
            <span className="eap-mini-stat__label">Free</span>
          </div>
        </div>

        <div className="eap-course-card__rev-bar">
          <div className="eap-course-card__rev-track">
            <div
              className={`eap-course-card__rev-fill${isBlueFill ? ' eap-course-card__rev-fill--blue' : ''}`}
              style={{ width: `${revPct}%` }}
            />
          </div>
          <div className="eap-course-card__rev-caption">
            <span>{revPct}% of top course catalog value</span>
            <span>{course.videosCount > 0 ? fmt(course.catalogValue / course.videosCount) : '—'} / video</span>
          </div>
        </div>

        {videos.length > 0 && (
          <>
            <button
              className="eap-course-card__expand-btn"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? '▲ Hide videos' : `▼ Show ${videos.length} videos`}
            </button>

            {expanded && (
              <div className="eap-fee-table">
                <div className="eap-fee-table__header">
                  <span>Video</span>
                  <span>Duration</span>
                  <span>Fee</span>
                  <span>Status</span>
                </div>
                {videos.map((video, index) => (
                  <VideoFeeRow key={video.id || index} video={video} index={index} />
                ))}
              </div>
            )}
          </>
        )}

        {videos.length === 0 && (
          <p style={{ fontSize: 12, color: 'rgba(4,42,78,0.35)', marginTop: 8, textAlign: 'center' }}>
            No videos yet
          </p>
        )}
      </div>
    </div>
  )
}

const TransactionsTable = ({ rows }) => {
  const [filter, setFilter] = useState('All')

  const filteredRows = useMemo(() => {
    if (filter === 'All') return rows
    return rows.filter((row) => row.status === filter.toLowerCase())
  }, [rows, filter])

  return (
    <div className="eap-full-table-wrap">
      <div className="eap-full-table-toolbar">
        <span className="eap-full-table-toolbar__title">
          All Video Fee Records · {filteredRows.length} record{filteredRows.length !== 1 ? 's' : ''}
        </span>
        <div className="eap-full-table-toolbar__right">
          {FILTERS.map((f) => (
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
              <th>Course</th>
              <th>Video</th>
              <th>Duration</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(4,42,78,0.3)' }}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="eap-table-course" title={row.courseTitle}>
                      {row.courseTitle}
                    </span>
                  </td>
                  <td>{row.videoTitle}</td>
                  <td>{row.duration || '—'}</td>
                  <td><span className="eap-table-fee">{fmt(row.fee)}</span></td>
                  <td>
                    <span className={`eap-status-chip eap-status-chip--${row.status}`}>
                      {row.status === 'paid' ? '✓ Paid' : '🔓 Free'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const EducatorAnalyticsPage = () => {
  const [period, setPeriod] = useState('All Time')
  const [tab, setTab] = useState('Overview')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  }, [])

  const educator = useMemo(() => ({
    name:
      [storedUser?.first_name, storedUser?.last_name].filter(Boolean).join(' ') ||
      storedUser?.email ||
      'Educator',
    initials: toInitials(storedUser?.first_name, storedUser?.last_name, storedUser?.email),
    department: 'Mathematics & Engineering Sciences',
  }), [storedUser])

  useEffect(() => {
    const loadCourses = async () => {
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
        const normalized = (Array.isArray(data) ? data : []).map((course) => ({
          ...course,
          videos: (Array.isArray(course.videos) ? course.videos : []).map((video, index) => ({
            ...video,
            id: video.id ?? `${course.id}-${index + 1}`,
            title: video.title || `Video ${index + 1}`,
            duration: video.duration || '—',
            price: parseMoney(video.price),
          })),
        }))

        setCourses(normalized)
      } catch (fetchErr) {
        console.error(fetchErr)
        setError('Failed to load educator analytics data.')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [storedUser])

  const courseStats = useMemo(() => {
    return courses.map((course) => {
      const videos = course.videos || []
      const paidVideos = videos.filter((video) => video.price > 0).length
      const freeVideos = videos.length - paidVideos
      const catalogValue = videos.reduce((sum, video) => sum + video.price, 0)

      return {
        id: course.id,
        title: course.title,
        category: course.category,
        color: course.color || '#042a4e',
        semester: Number(course.semester || 0),
        videos,
        videosCount: Number(course.lessons || videos.length),
        paidVideos,
        freeVideos,
        catalogValue,
      }
    })
  }, [courses])

  const transactionRows = useMemo(() => {
    return courseStats.flatMap((course) =>
      course.videos.map((video) => ({
        id: `${course.id}-${video.id}`,
        courseTitle: course.title,
        videoTitle: video.title,
        duration: video.duration,
        fee: video.price,
        status: video.price > 0 ? 'paid' : 'free',
      }))
    )
  }, [courseStats])

  const totalRevenue = useMemo(
    () => courseStats.reduce((sum, course) => sum + course.catalogValue, 0),
    [courseStats]
  )

  const totalVideos = useMemo(
    () => courseStats.reduce((sum, course) => sum + course.videosCount, 0),
    [courseStats]
  )

  const totalPaidVideos = useMemo(
    () => courseStats.reduce((sum, course) => sum + course.paidVideos, 0),
    [courseStats]
  )

  const totalFreeVideos = useMemo(
    () => courseStats.reduce((sum, course) => sum + course.freeVideos, 0),
    [courseStats]
  )

  const maxRevenue = useMemo(
    () => Math.max(...courseStats.map((course) => course.catalogValue), 1),
    [courseStats]
  )

  return (
    <div className="eap-page">

      {/* ── Header ── */}
      <div className="eap-header">
        <div className="eap-header__inner">

          {/* Profile */}
          <div className="eap-header__profile">
            <div className="eap-header__avatar">{educator.initials}</div>
            <div>
              <span className="eap-header__tag">Revenue Analytics</span>
              <h1 className="eap-header__name">{educator.name}</h1>
              <p className="eap-header__dept">{educator.department}</p>
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
              <span className="eap-rev-stat__label">Total Catalog Value</span>
              <span className="eap-rev-stat__val">{fmt(totalRevenue)}</span>
              <span className="eap-rev-stat__sub">Based on current video prices</span>
            </div>

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Paid Videos</span>
              <span className="eap-rev-stat__val eap-rev-stat__val--white">{totalPaidVideos}</span>
              <span className="eap-rev-stat__sub">of {totalVideos} total videos</span>
            </div>

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Free Videos</span>
              <span className="eap-rev-stat__val eap-rev-stat__val--white">{totalFreeVideos}</span>
              <span className="eap-rev-stat__sub">Open-access video count</span>
            </div>

            <div className="eap-rev-stat">
              <span className="eap-rev-stat__label">Avg. Fee / Video</span>
              <span className="eap-rev-stat__val">
                {totalVideos > 0 ? fmt(totalRevenue / totalVideos) : '—'}
              </span>
              <span className="eap-rev-stat__sub">Average across all current videos</span>
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

        {loading && (
          <div className="eap-empty">
            <div className="eap-empty__emoji">⏳</div>
            <p className="eap-empty__title">Loading analytics...</p>
          </div>
        )}

        {!loading && error && (
          <div className="eap-empty">
            <div className="eap-empty__emoji">⚠️</div>
            <p className="eap-empty__title">{error}</p>
          </div>
        )}

        {!loading && !error && tab === 'Overview' && (
          <>
            <h2 className="eap-section-heading">Video Fee Analytics by Course</h2>
            <div className="eap-course-grid">
              {courseStats.length === 0 ? (
                <div className="eap-empty">
                  <div className="eap-empty__emoji">📭</div>
                  <p className="eap-empty__title">No courses found for this educator.</p>
                </div>
              ) : (
                courseStats.map((course) => (
                  <CourseRevenueCard key={course.id} course={course} maxValue={maxRevenue} />
                ))
              )}
            </div>
          </>
        )}

        {!loading && !error && tab === 'All Transactions' && (
          <>
            <h2 className="eap-section-heading">All Video Fee Records</h2>
            <TransactionsTable rows={transactionRows} />
          </>
        )}

      </div>
    </div>
  )
}

export default EducatorAnalyticsPage