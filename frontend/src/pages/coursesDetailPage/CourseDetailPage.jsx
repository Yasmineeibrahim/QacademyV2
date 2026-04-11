// src/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'
import './CourseDetailPage.css'
import {
  formatDurationFromSeconds,
  getVideoProgressPercent,
  getVideoProgressRecord,
  getWatchedSeconds,
  normalizeDurationSeconds,
  readVideoProgressStore,
  upsertVideoProgress,
} from '../../utils/videoProgress'

const getCourseColorClass = (color) => (color === '#1a4a7a' ? 'cdp-player--blue' : 'cdp-player--dark')
const getSideBannerColorClass = (color) => (color === '#1a4a7a' ? 'cdp-side-card__banner--blue' : 'cdp-side-card__banner--dark')

const formatPrice = (price) => {
  if (typeof price === 'string' && price.startsWith('$')) return price
  const numeric = Number(price)
  return Number.isFinite(numeric) ? `$${numeric.toFixed(2)}` : '$0.00'
}

const mapCourse = (course) => ({
  ...course,
  lessons: Number(course.lessons ?? 0),
  duration: course.duration || '0h 0m',
  price: formatPrice(course.price),
  color: course.color || '#042a4e',
})

const mapVideo = (video, index) => ({
  id: video.id,
  title: video.title || `Video ${index + 1}`,
  duration: formatDurationFromSeconds(video.duration_seconds ?? video.duration),
  durationSeconds: normalizeDurationSeconds(video.duration_seconds ?? video.duration),
  free: Number(video.price) === 0 || index === 0,
  videoUrl: video.video_url || '',
})

const UnlockModal = ({ target, onClose, onUnlock }) => {
  const [code, setCode]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!code.trim()) { setError('Please enter a code.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Backend validation will go here
      onUnlock(target)
      onClose()
    }, 900)
  }

  return (
    <div className="cdp-overlay" onClick={onClose}>
      <div className="cdp-modal" onClick={e => e.stopPropagation()}>

        <div className="cdp-modal__header">
          <div>
            <p className="cdp-modal__tag">🔐 Access Required</p>
            <h2 className="cdp-modal__title">
              {target === 'full' ? 'Unlock Full Course' : 'Unlock Video'}
            </h2>
            <p className="cdp-modal__sub">
              {target === 'full'
                ? 'Enter your course code to access all videos instantly.'
                : 'Enter your video code to watch this lesson.'}
            </p>
          </div>
          <button className="cdp-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="cdp-modal__body">
          <label className="cdp-modal__label">Access Code</label>
          <input
            className={`cdp-modal__input${error ? ' cdp-modal__input--error' : ''}`}
            type="text"
            placeholder="e.g.  QAC-2025-XXXX"
            value={code}
            onChange={e => { setCode(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          {error && <p className="cdp-modal__error">{error}</p>}

          <button
            className="cdp-modal__submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Verifying…' : 'Unlock Now →'}
          </button>

          <p className="cdp-modal__hint">
            Don't have a code? Contact us 
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Video player ───────────────────────────────────────────────────────────
const VideoPlayer = ({ topic, unlocked, onRequestUnlock, courseColor, onWatchProgress }) => {
  if (!topic) {
    return (
      <div className="cdp-player cdp-player--empty">
        <span className="cdp-player__empty-emoji">🎬</span>
        <p className="cdp-player__empty-text">Select a video to start watching</p>
      </div>
    )
  }

  if (!topic.free && !unlocked) {
    return (
      <div className={`cdp-player cdp-player--locked ${getCourseColorClass(courseColor)}`}>
        <div className="cdp-player__lock-circle">🔒</div>
        <div className="cdp-player__locked-content">
          <p className="cdp-player__locked-title">{topic.title}</p>
          <p className="cdp-player__locked-sub">This video requires a valid access code.</p>
          <button className="cdp-player__unlock-btn" onClick={() => onRequestUnlock(topic)}>
            🔑 Enter Code to Watch
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`cdp-player cdp-player--playing ${getCourseColorClass(courseColor)}`}>
      {topic.videoUrl ? (
        <video
          className="cdp-player__video"
          src={topic.videoUrl}
          controls
          playsInline
          controlsList="nodownload"
          onLoadedMetadata={(event) => {
            onWatchProgress?.(topic, event.currentTarget.currentTime, event.currentTarget.duration)

            const progressRecord = getVideoProgressRecord(topic.id)
            const resumeSeconds = Math.min(
              topic.durationSeconds || event.currentTarget.duration || 0,
              getWatchedSeconds(progressRecord)
            )

            if (resumeSeconds > 0) {
              event.currentTarget.currentTime = resumeSeconds
            }
          }}
          onTimeUpdate={(event) => onWatchProgress?.(topic, event.currentTarget.currentTime, event.currentTarget.duration)}
          onPause={(event) => onWatchProgress?.(topic, event.currentTarget.currentTime, event.currentTarget.duration)}
          onEnded={() => onWatchProgress?.(topic, topic.durationSeconds, topic.durationSeconds, true)}
        />
      ) : (
        <>
          <div className="cdp-player__play-ring">▶</div>
          <p className="cdp-player__now-playing">Now Playing</p>
          <p className="cdp-player__playing-title">{topic.title}</p>
        </>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
const CourseDetailPage = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [course, setCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [activeTopic, setActiveTopic] = useState(null)
  const [unlockedTopics, setUnlockedTopics] = useState(new Set())
  const [fullCourseUnlocked, setFullCourseUnlocked] = useState(false)
  const [videoProgressById, setVideoProgressById] = useState(() => readVideoProgressStore())
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadCourseDetails = async () => {
      try {
        setLoading(true)
        setFetchError('')
        setCourse(null)
        setTopics([])
        setActiveTopic(null)
        setUnlockedTopics(new Set())
        setFullCourseUnlocked(false)
        setVideoProgressById(readVideoProgressStore())

        const res = await fetch(`${API_BASE_URL}/api/courses/${id}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch course details (${res.status})`)
        }

        const data = await res.json()
        if (!data?.course) {
          throw new Error('Invalid course payload')
        }

        const normalizedCourse = mapCourse(data.course)
        const normalizedTopics = Array.isArray(data.videos)
          ? data.videos.map(mapVideo)
          : []
        const requestedVideoId = Number(new URLSearchParams(location.search).get('videoId'))
        const openedFromSingleVideo = Number.isInteger(requestedVideoId) && requestedVideoId > 0

        let hasFullCoursePurchase = false
        let purchasedVideoIds = []
        const storedUserRaw = localStorage.getItem('user')
        if (storedUserRaw) {
          try {
            const storedUser = JSON.parse(storedUserRaw)
            if (storedUser?.id) {
              const purchasesRes = await fetch(`${API_BASE_URL}/api/purchases/student/${storedUser.id}`)
              if (purchasesRes.ok) {
                const purchasesData = await purchasesRes.json()
                hasFullCoursePurchase = (purchasesData.enrollments || []).some(
                  (enrollment) => Number(enrollment.course_id) === Number(id)
                )

                purchasedVideoIds = (purchasesData.videoPurchases || [])
                  .filter((videoPurchase) => Number(videoPurchase.course_id) === Number(id))
                  .map((videoPurchase) => Number(videoPurchase.video_id))
                  .filter((videoId) => Number.isInteger(videoId) && videoId > 0)
              }
            }
          } catch (purchaseCheckErr) {
            console.error('Failed to check full-course purchase status:', purchaseCheckErr)
          }
        }

        if (!cancelled) {
          setCourse(normalizedCourse)
          setTopics(normalizedTopics)
          const effectiveFullCourseUnlocked = hasFullCoursePurchase && !openedFromSingleVideo
          setFullCourseUnlocked(effectiveFullCourseUnlocked)

          if (normalizedTopics.length > 0) {
            const requestedTopic = Number.isInteger(requestedVideoId)
              ? normalizedTopics.find((topic) => Number(topic.id) === requestedVideoId)
              : null
            const initialTopic = requestedTopic || normalizedTopics[0]

            const singleVideoUnlockIds = new Set(
              normalizedTopics
                .filter((topic) => purchasedVideoIds.includes(Number(topic.id)))
                .map((topic) => topic.id)
            )

            setActiveTopic(initialTopic)
            setUnlockedTopics(
              effectiveFullCourseUnlocked
                ? new Set(normalizedTopics.map((topic) => topic.id))
                : singleVideoUnlockIds
            )
          }
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setFetchError('Failed to load course details.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCourseDetails()

    return () => {
      cancelled = true
    }
  }, [id, location.search])

  if (loading) {
    return (
      <div className="cdp-not-found">
        <p className="cdp-not-found__text">Loading course details...</p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="cdp-not-found">
        <p className="cdp-not-found__emoji">⚠️</p>
        <p className="cdp-not-found__text">{fetchError}</p>
        <button className="cdp-not-found__btn" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="cdp-not-found">
        <p className="cdp-not-found__emoji">📭</p>
        <p className="cdp-not-found__text">Course not found.</p>
        <button className="cdp-not-found__btn" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
      </div>
    )
  }

  const isTopicUnlocked = (t) => t.free || fullCourseUnlocked || unlockedTopics.has(t.id)

  const isTopicCompleted = (topic) =>
    getVideoProgressPercent(videoProgressById[topic.id], topic.durationSeconds) >= 100

  const handleUnlock = (target) => {
    if (target === 'full') {
      setFullCourseUnlocked(true)
    } else {
      setUnlockedTopics(prev => new Set([...prev, target.id]))
      if (activeTopic?.id === target.id) setActiveTopic({ ...target })
    }
  }

  const handleWatchProgress = (topic, watchedSeconds, fallbackDurationSeconds, completed = false) => {
    const durationSeconds = topic.durationSeconds || normalizeDurationSeconds(fallbackDurationSeconds)
    const nextRecord = upsertVideoProgress(topic.id, {
      watchedSeconds,
      durationSeconds,
      completed,
    })

    setVideoProgressById((prev) => ({
      ...prev,
      [topic.id]: nextRecord,
    }))
  }

  const handleTopicClick = (topic) => {
    setActiveTopic(topic)
    if (!isTopicUnlocked(topic)) setModal({ type: 'video', topic })
  }

  const completedCount = topics.filter((topic) => isTopicCompleted(topic)).length
  const progressPct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0
  const sideCardLessons = topics.length > 0 ? topics.length : course.lessons
  const sideCardDurationSeconds = topics.reduce(
    (sum, topic) => sum + normalizeDurationSeconds(topic.durationSeconds),
    0
  )
  const sideCardDuration = sideCardDurationSeconds > 0
    ? formatDurationFromSeconds(sideCardDurationSeconds)
    : course.duration

  return (
    <div className="cdp-page">

      {/* ── Page Header ── */}
      <div className="cdp-header">
        <div className="container cdp-header__inner">
          <button className="cdp-back-btn" onClick={() => navigate('/courses')}>← Back</button>
          <div>
            <span className="cdp-header__tag">{course.category}</span>
            <h1 className="cdp-header__title">{course.title}</h1>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container cdp-body">

        {/* LEFT */}
        <div className="cdp-left">

          <VideoPlayer
            topic={activeTopic}
            unlocked={activeTopic ? isTopicUnlocked(activeTopic) : false}
            onRequestUnlock={(topic) => setModal({ type: 'video', topic })}
            courseColor={course.color}
            onWatchProgress={handleWatchProgress}
          />

          {activeTopic && (
            <div className="cdp-video-meta">
              <div>
                <h2 className="cdp-video-meta__title">{activeTopic.title}</h2>
                <p className="cdp-video-meta__sub">
                  <span>⏱ {formatDurationFromSeconds(activeTopic.durationSeconds ?? activeTopic.duration)}</span>
                  <span>📚 {course.category}</span>
                  <span>👤 {course.instructor}</span>
                </p>
              </div>
              {!isTopicUnlocked(activeTopic) && (
                <button
                  className="cdp-inline-unlock-btn"
                  onClick={() => setModal({ type: 'video', topic: activeTopic })}
                >
                  🔑 Unlock this Video
                </button>
              )}
            </div>
          )}

          <div className="cdp-progress">
            <div className="cdp-progress__header">
              <span className="cdp-progress__label">Course Progress</span>
              <span className="cdp-progress__label">{completedCount} / {topics.length} videos completed</span>
            </div>
            <div className="cdp-progress__track">
              <div className="cdp-progress__fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cdp-right">

          {/* Course card */}
          <div className="cdp-side-card">
            <div className={`cdp-side-card__banner ${getSideBannerColorClass(course.color)}`}>
              <span className="cdp-side-card__category">{course.category}</span>
              <span className="cdp-side-card__price">{course.price}</span>
            </div>
            <div className="cdp-side-card__body">
              <h3 className="cdp-side-card__title">{course.title}</h3>
              <div className="cdp-side-card__stats">
                <span className="cdp-side-card__stat">🎥 {sideCardLessons} Videos</span>
                <span className="cdp-side-card__stat">⏱ {sideCardDuration}</span>
                <span className="cdp-side-card__stat">👤 {course.instructor}</span>
              </div>
            </div>
          </div>

          {/* Full course CTA */}
          {!fullCourseUnlocked && (
            <div className="cdp-full-course">
              <p className="cdp-full-course__eyebrow">🎓 Get Everything</p>
              <p className="cdp-full-course__title">Buy the Full Course</p>
              <p className="cdp-full-course__sub">
                Unlock all {topics.length} videos at once with a single course code.
              </p>
              <button className="cdp-full-course__btn" onClick={() => setModal({ type: 'full' })}>
                Enter Course Code →
              </button>
            </div>
          )}

          {/* Topics list */}
          <div className="cdp-topics">
            <p className="cdp-topics__heading">Course Content</p>
            {topics.map((topic, i) => {
              const unlocked = isTopicUnlocked(topic)
              const active   = activeTopic?.id === topic.id

              return (
                <button
                  key={topic.id}
                  className={`cdp-topic-item${active ? ' cdp-topic-item--active' : ''}`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <span className={`cdp-topic__num ${active ? 'cdp-topic__num--active' : unlocked ? 'cdp-topic__num--unlocked' : 'cdp-topic__num--locked'}`}>
                    {unlocked ? (active ? '▶' : '✓') : '🔒'}
                  </span>
                  <div className="cdp-topic__info">
                    <p className={`cdp-topic__title ${active ? 'cdp-topic__title--active' : unlocked ? 'cdp-topic__title--unlocked' : 'cdp-topic__title--locked'}`}>
                      {i + 1}. {topic.title}
                    </p>
                    <p className={`cdp-topic__dur ${active ? 'cdp-topic__dur--active' : 'cdp-topic__dur--default'}`}>
                      {topic.duration}
                    </p>
                  </div>
                  {!unlocked && <span className="cdp-topic__unlock-chip">Unlock</span>}
                </button>
              )
            })}
          </div>

        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <UnlockModal
          target={modal.type === 'full' ? 'full' : modal.topic}
          onClose={() => setModal(null)}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  )
}

export default CourseDetailPage