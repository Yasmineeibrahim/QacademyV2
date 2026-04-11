// src/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'
import './CourseDetailPage.css'

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
  duration: video.duration || '0m 0s',
  free: Number(video.price) === 0 || index === 0,
  videoUrl: video.video_url || '',
})

const toYouTubeEmbedUrl = (url) => {
  if (!url) return ''

  const buildEmbedUrl = (videoId) => {
    if (!videoId) return ''

    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      playsinline: '1',
    })

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
  }

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')

    if (host === 'youtu.be') {
      const id = parsed.pathname.replace('/', '')
      return buildEmbedUrl(id)
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v')
        return buildEmbedUrl(id)
      }

      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/embed/')[1]
        return buildEmbedUrl(id)
      }
    }

    return ''
  } catch {
    return ''
  }
}

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
const VideoPlayer = ({ topic, unlocked, onRequestUnlock, courseColor }) => {
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

  const embedUrl = toYouTubeEmbedUrl(topic.videoUrl)

  return (
    <div className={`cdp-player cdp-player--playing ${getCourseColorClass(courseColor)}`}>
      {embedUrl ? (
        <iframe
          className="cdp-player__iframe"
          src={embedUrl}
          title={topic.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : topic.videoUrl ? (
        <video className="cdp-player__video" src={topic.videoUrl} controls playsInline />
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
  const [course, setCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [activeTopic, setActiveTopic] = useState(null)
  const [unlockedTopics, setUnlockedTopics] = useState(new Set())
  const [fullCourseUnlocked, setFullCourseUnlocked] = useState(false)
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

        if (!cancelled) {
          setCourse(normalizedCourse)
          setTopics(normalizedTopics)
          if (normalizedTopics.length > 0) {
            setActiveTopic(normalizedTopics[0])
            setUnlockedTopics(new Set([normalizedTopics[0].id]))
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
  }, [id])

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

  const handleUnlock = (target) => {
    if (target === 'full') {
      setFullCourseUnlocked(true)
    } else {
      setUnlockedTopics(prev => new Set([...prev, target.id]))
      if (activeTopic?.id === target.id) setActiveTopic({ ...target })
    }
  }

  const handleTopicClick = (topic) => {
    setActiveTopic(topic)
    if (!isTopicUnlocked(topic)) setModal({ type: 'video', topic })
  }

  const completedCount = topics.filter(t => isTopicUnlocked(t)).length
  const progressPct = topics.length > 0 ? (completedCount / topics.length) * 100 : 0

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
          />

          {activeTopic && (
            <div className="cdp-video-meta">
              <div>
                <h2 className="cdp-video-meta__title">{activeTopic.title}</h2>
                <p className="cdp-video-meta__sub">
                  <span>⏱ {activeTopic.duration}</span>
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
              <span className="cdp-progress__label">{completedCount} / {topics.length} unlocked</span>
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
                <span className="cdp-side-card__stat">🎥 {course.lessons} Videos</span>
                <span className="cdp-side-card__stat">⏱ {course.duration}</span>
                <span className="cdp-side-card__stat">👤 {course.instructor}</span>
              </div>
            </div>
          </div>

          {/* Full course CTA */}
          {!fullCourseUnlocked ? (
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
          ) : (
            <div className="cdp-full-course cdp-full-course--unlocked">
              <p className="cdp-full-course__unlocked-emoji">🎉</p>
              <p className="cdp-full-course__unlocked-title">Full Course Unlocked!</p>
              <p className="cdp-full-course__unlocked-sub">All videos are now available for you.</p>
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