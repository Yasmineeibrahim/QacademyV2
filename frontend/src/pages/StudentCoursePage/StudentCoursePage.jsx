import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentCoursePage.css'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'
import {
  formatDurationFromSeconds,
  getCourseProgressStats,
  getVideoProgressPercent,
  getVideoProgressRecord,
  getWatchedSeconds,
  normalizeDurationSeconds,
} from '../../utils/videoProgress'

const TABS = [
  { key: 'all', label: 'All Purchases' },
  { key: 'courses', label: 'Full Courses' },
  { key: 'videos', label: 'Single Videos' },
]

const SORTS = [
  { key: 'recent', label: 'Recent' },
  { key: 'title', label: 'A → Z' },
]

const getInitials = (value) => {
  if (!value) return 'SC'

  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const getProgressFillClass = (progressPercent) => {
  if (progressPercent >= 100) return 'scp-card__progress-fill--done'
  if (progressPercent >= 60) return 'scp-card__progress-fill--high'
  if (progressPercent >= 30) return 'scp-card__progress-fill--mid'
  return 'scp-card__progress-fill--low'
}

const formatWatchedMinutes = (watchedSeconds, durationSeconds) => {
  const totalMinutes = Math.max(1, Math.ceil(normalizeDurationSeconds(durationSeconds) / 60))
  const watchedMinutes = Math.min(totalMinutes, Math.floor(Math.max(0, watchedSeconds) / 60))

  return `${watchedMinutes} of ${totalMinutes} min watched`
}

const toCoursePurchaseCard = (purchase, index) => {
  const videos = Array.isArray(purchase.videos)
    ? purchase.videos.map((video) => ({
        id: video.id,
        title: video.title,
        durationSeconds: normalizeDurationSeconds(video.duration_seconds ?? video.duration),
      }))
    : []

  const totalDurationSeconds = videos.reduce(
    (sum, video) => sum + normalizeDurationSeconds(video.durationSeconds),
    0
  )
  const totalLessons = videos.length > 0
    ? videos.length
    : (Number(purchase.lessons) || 0)

  const progress = getCourseProgressStats(videos, totalLessons)

  return {
    id: `course-${purchase.id}`,
    kind: 'course',
    title: purchase.title,
    category: purchase.category,
    instructor: purchase.instructor,
    initials: getInitials(purchase.instructor),
    duration: totalDurationSeconds > 0
      ? formatDurationFromSeconds(totalDurationSeconds)
      : purchase.duration,
    semester: purchase.semester,
    color: index % 2 === 0 ? '#042a4e' : '#1a4a7a',
    purchasedAt: purchase.purchased_at,
    price: purchase.price,
    lessons: totalLessons,
    courseId: purchase.course_id,
    videos,
    completedLessons: progress.completedLessons,
    progressPercent: progress.progressPercent,
    progressLabel: progress.progressPercent >= 100 ? 'Completed' : 'In Progress',
    accessLevel: 'Full course access',
    lastAccessed: '2 hours ago',
    nextLesson:
      progress.completedLessons >= totalLessons
        ? 'All lessons completed'
        : `Lesson ${progress.completedLessons + 1} • Continue`,
  }
}

const toVideoPurchaseCard = (purchase) => {
  const durationSeconds = normalizeDurationSeconds(purchase.duration_seconds ?? purchase.raw_duration)
  const progressRecord = getVideoProgressRecord(purchase.video_id)
  const progressPercent = getVideoProgressPercent(progressRecord, durationSeconds)
  const watchedSeconds = progressRecord?.completed
    ? durationSeconds
    : Math.min(durationSeconds, getWatchedSeconds(progressRecord))

  return {
    id: `video-${purchase.id}`,
    kind: 'video',
    title: purchase.video_title,
    courseTitle: purchase.course_title,
    category: purchase.category,
    instructor: purchase.instructor,
    initials: getInitials(purchase.instructor),
    duration: formatDurationFromSeconds(durationSeconds),
    durationSeconds,
    watchedSeconds,
    purchasedAt: purchase.purchased_at,
    price: purchase.video_price,
    videoId: purchase.video_id,
    courseId: purchase.course_id,
    color: '#1a4a7a',
    lessons: 1,
    completedLessons: progressPercent >= 100 ? 1 : 0,
    progressPercent,
    progressLabel: progressPercent >= 100 ? 'Completed' : 'In Progress',
    progressNote: formatWatchedMinutes(watchedSeconds, durationSeconds),
    accessLevel: 'Instant access',
    videoTitle: purchase.video_title,
  }
}

const formatPurchasedAt = (value) => {
  if (!value) return 'Recently purchased'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently purchased'

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const PurchasedCourseCard = ({ course }) => {
  const navigate = useNavigate()

  return (
    <div className="scp-card">
      <div className={`scp-card__banner ${course.color === '#1a4a7a' ? 'scp-card__banner--blue' : 'scp-card__banner--dark'}`}>
        <span className="scp-card__category">{course.category}</span>
        <span className="scp-card__status-badge scp-card__status-badge--active">
          Purchased
        </span>
      </div>

      <div className="scp-card__body">
        <h3 className="scp-card__title">{course.title}</h3>
        <div className="scp-card__meta">
          <span className="scp-card__meta-item">🎥 {course.lessons} Videos</span>
          <span className="scp-card__meta-item">⏱ {course.duration}</span>
          <span className="scp-card__meta-item">💳 {course.price}</span>
          <span className="scp-card__meta-item">🕐 {formatPurchasedAt(course.purchasedAt)}</span>
          <span className="scp-card__meta-item">📍 {course.nextLesson}</span>
        </div>
      </div>

      <div className="scp-card__progress">
        <div className="scp-card__progress-header">
          <span className="scp-card__progress-label">Progress</span>
          <span className="scp-card__progress-pct">{course.progressPercent}%</span>
        </div>
        <div className="scp-card__progress-track">
          <div
            className={`scp-card__progress-fill ${getProgressFillClass(course.progressPercent)}`}
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <p className="scp-card__progress-lessons">
          {course.completedLessons} of {course.lessons} videos completed
        </p>
      </div>

      <div className="scp-card__footer">
        <div className="scp-card__instructor">
          <div className="scp-card__avatar">{course.initials}</div>
          <span className="scp-card__instructor-name">{course.instructor}</span>
        </div>
        <button
          className="scp-card__continue-btn"
          onClick={() => navigate(`/courses/${course.courseId}`)}
        >
          Continue Course →
        </button>
      </div>
    </div>
  )
}

const PurchasedVideoCard = ({ video }) => {
  const navigate = useNavigate()

  return (
    <div className="scp-card">
      <div className={`scp-card__banner ${video.color === '#1a4a7a' ? 'scp-card__banner--blue' : 'scp-card__banner--dark'}`}>
        <span className="scp-card__category">{video.category}</span>
        <span className="scp-card__status-badge scp-card__status-badge--active">
          Single Video
        </span>
      </div>

      <div className="scp-card__body">
        <h3 className="scp-card__title">{video.title}</h3>
        <div className="scp-card__meta">
          <span className="scp-card__meta-item">📘 {video.courseTitle}</span>
          <span className="scp-card__meta-item">⏱ {video.duration || '18m'}</span>
          <span className="scp-card__meta-item">🕐 {formatPurchasedAt(video.purchasedAt)}</span>
        </div>
      </div>

      <div className="scp-card__progress">
        <div className="scp-card__progress-header">
          <span className="scp-card__progress-label">Progress</span>
          <span className="scp-card__progress-pct">{video.progressPercent}%</span>
        </div>
        <div className="scp-card__progress-track">
          <div
            className={`scp-card__progress-fill ${getProgressFillClass(video.progressPercent)}`}
            style={{ width: `${video.progressPercent}%` }}
          />
        </div>
        <p className="scp-card__progress-lessons">
          {video.progressPercent >= 100 ? 'Video fully watched' : video.progressNote}
        </p>
      </div>

      <div className="scp-card__footer">
        <div className="scp-card__instructor">
          <div className="scp-card__avatar">{video.initials}</div>
          <span className="scp-card__instructor-name">{video.instructor}</span>
        </div>
        <button
          className="scp-card__continue-btn"
          onClick={() => navigate(`/courses/${video.courseId}?videoId=${video.videoId}`)}
        >
          Open Video →
        </button>
      </div>
    </div>
  )
}

const StudentCoursePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [activeSort, setActiveSort] = useState('recent')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollmentsRaw, setEnrollmentsRaw] = useState([])
  const [videoPurchasesRaw, setVideoPurchasesRaw] = useState([])
  const [progressTick, setProgressTick] = useState(0)

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true)
        setError('')

        const storedUser = JSON.parse(localStorage.getItem('user'))

        if (!storedUser?.id) {
          setEnrollmentsRaw([])
          setVideoPurchasesRaw([])
          setError('You are not logged in.')
          return
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/purchases/student/${storedUser.id}`
        )

        setEnrollmentsRaw(response.data.enrollments || [])
        setVideoPurchasesRaw(response.data.videoPurchases || [])
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load your purchases.')
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  useEffect(() => {
    const handleProgressRefresh = () => {
      setProgressTick((value) => value + 1)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleProgressRefresh()
      }
    }

    window.addEventListener('qacademy-video-progress-updated', handleProgressRefresh)
    window.addEventListener('focus', handleProgressRefresh)
    window.addEventListener('storage', handleProgressRefresh)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('qacademy-video-progress-updated', handleProgressRefresh)
      window.removeEventListener('focus', handleProgressRefresh)
      window.removeEventListener('storage', handleProgressRefresh)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const coursePurchases = useMemo(
    () => enrollmentsRaw.map((purchase, index) => toCoursePurchaseCard(purchase, index)),
    [enrollmentsRaw, progressTick]
  )

  const videoPurchases = useMemo(
    () => videoPurchasesRaw.map((purchase) => toVideoPurchaseCard(purchase)),
    [videoPurchasesRaw, progressTick]
  )

  const allPurchases = [...coursePurchases, ...videoPurchases]

  const filtered = allPurchases.filter((purchase) => {
    if (activeTab === 'all') return true
    if (activeTab === 'courses') return purchase.kind === 'course'
    if (activeTab === 'videos') return purchase.kind === 'video'
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === 'title') return a.title.localeCompare(b.title)

    const aTime = new Date(a.purchasedAt || 0).getTime()
    const bTime = new Date(b.purchasedAt || 0).getTime()
    return bTime - aTime
  })

  const tabCounts = {
    all: allPurchases.length,
    courses: coursePurchases.length,
    videos: videoPurchases.length,
  }

  return (
    <div className="scp-page">

      {/* ── Header ── */}
      <div className="scp-header">
        <div className="scp-header__inner">
          <div className="scp-header__left">
            <span className="scp-header__tag">My Learning</span>
            <h1 className="scp-header__title">My Courses</h1>
            <p className="scp-header__sub">Review the courses and videos you have purchased</p>
          </div>
          <div className="scp-header__stats">
            <div className="scp-header__stat-pill">
              <span className="scp-header__stat-num">{coursePurchases.length}</span>
              <span className="scp-header__stat-label">Courses</span>
            </div>
            <div className="scp-header__stat-pill">
              <span className="scp-header__stat-num">{videoPurchases.length}</span>
              <span className="scp-header__stat-label">Videos</span>
            </div>
            <div className="scp-header__stat-pill">
              <span className="scp-header__stat-num">{allPurchases.length}</span>
              <span className="scp-header__stat-label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="scp-tabs">
        <div className="scp-tabs__inner">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`scp-tab-btn ${activeTab === tab.key ? 'scp-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="scp-tab-btn__count">{tabCounts[tab.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="scp-body">

        {loading && (
          <div className="scp-empty">
            <div className="scp-empty__emoji">⌛</div>
            <p className="scp-empty__title">Loading your purchases...</p>
            <p className="scp-empty__sub">Fetching your enrolled courses and video purchases.</p>
          </div>
        )}

        {!loading && error && (
          <div className="scp-empty">
            <div className="scp-empty__emoji">⚠️</div>
            <p className="scp-empty__title">{error}</p>
            <p className="scp-empty__sub">Log in again and refresh the page.</p>
          </div>
        )}

        {/* Toolbar */}
        {!loading && !error && (
          <div className="scp-toolbar">
            <p className="scp-toolbar__left">
              Showing <strong>{sorted.length}</strong> purchase{sorted.length !== 1 ? 's' : ''}
            </p>
            <div className="scp-toolbar__right">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  className={`scp-sort-btn ${activeSort === s.key ? 'scp-sort-btn--active' : ''}`}
                  onClick={() => setActiveSort(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid or Empty */}
        {!loading && !error && sorted.length === 0 && (
          <div className="scp-empty">
            <div className="scp-empty__emoji">📭</div>
            <p className="scp-empty__title">No purchases yet.</p>
            <p className="scp-empty__sub">Browse the catalog and buy a course or a single video.</p>
            <button className="scp-empty__btn" onClick={() => navigate('/courses')}>
              Browse Courses →
            </button>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="scp-grid">
            {sorted.map((purchase) =>
              purchase.kind === 'course' ? (
                <PurchasedCourseCard key={purchase.id} course={purchase} />
              ) : (
                <PurchasedVideoCard key={purchase.id} video={purchase} />
              )
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default StudentCoursePage