// src/pages/CourseDetailPage.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courses } from '../../assets/data/courses'
import './CourseDetailPage.css'

const getCourseColorClass = (color) => (color === '#1a4a7a' ? 'cdp-player--blue' : 'cdp-player--dark')
const getSideBannerColorClass = (color) => (color === '#1a4a7a' ? 'cdp-side-card__banner--blue' : 'cdp-side-card__banner--dark')

// ── Mock topics per course (replace with real data later) ──────────────────
const generateTopics = () => [
  { id: 1, title: 'Introduction & Overview',        duration: '12:30', free: true  },
  { id: 2, title: 'Core Concepts Explained',        duration: '18:45', free: false },
  { id: 3, title: 'Hands-on Practice Session',      duration: '24:10', free: false },
  { id: 4, title: 'Deep Dive: Advanced Techniques', duration: '31:05', free: false },
  { id: 5, title: 'Mid term revision',     duration: '22:50', free: false },
  { id: 6, title: 'Common Pitfalls & How to Avoid', duration: '15:20', free: false },
  { id: 7, title: 'Project Walkthrough',            duration: '28:40', free: false },
  { id: 8, title: 'Final Revision',      duration: '10:15', free: false },
]

// ── Code-unlock modal ──────────────────────────────────────────────────────
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
            Don't have a code? Contact your instructor or visit our{' '}
            <a href="/contact">support page</a>.
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

  // Playing state — swap with real <video> or <iframe> later
  return (
    <div className={`cdp-player cdp-player--playing ${getCourseColorClass(courseColor)}`}>
      <div className="cdp-player__play-ring">▶</div>
      <p className="cdp-player__now-playing">Now Playing</p>
      <p className="cdp-player__playing-title">{topic.title}</p>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
const CourseDetailPage = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const course   = courses.find(c => String(c.id) === String(id))

  const [topics]                            = useState(() => course ? generateTopics() : [])
  const [activeTopic, setActiveTopic]       = useState(topics[0] || null)
  const [unlockedTopics, setUnlockedTopics] = useState(new Set([1]))
  const [fullCourseUnlocked, setFullCourseUnlocked] = useState(false)
  const [modal, setModal]                   = useState(null)

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
  const progressClass = `cdp-progress__fill--${completedCount}`

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
              <div className={`cdp-progress__fill ${progressClass}`} />
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