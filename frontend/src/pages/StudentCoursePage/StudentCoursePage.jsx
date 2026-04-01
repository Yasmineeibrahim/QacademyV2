import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentCoursePage.css'
import { StudentCourse, StudentCoursesAnalytics } from '../../models/courseModels'

const enrolledCourses = [
  new StudentCourse({
    id: 1,
    title: 'Calculus I – Limits & Derivatives',
    category: 'Mathematics',
    instructor: 'Dr. Ahmed Nour',
    initials: 'AN',
    lessons: 8,
    completedLessons: 6,
    duration: '4h 20m',
    color: '#042a4e',
    semester: 1,
    status: 'active',
    lastAccessed: '2 hours ago',
  }),
  new StudentCourse({
    id: 2,
    title: 'Physics I – Mechanics & Motion',
    category: 'Physics',
    instructor: 'Dr. Sara Mahmoud',
    initials: 'SM',
    lessons: 8,
    completedLessons: 8,
    duration: '5h 10m',
    color: '#1a4a7a',
    semester: 1,
    status: 'completed',
    lastAccessed: '3 days ago',
  }),
  new StudentCourse({
    id: 3,
    title: 'Engineering Drawing & CAD Basics',
    category: 'Drawing',
    instructor: 'Eng. Omar Fathi',
    initials: 'OF',
    lessons: 8,
    completedLessons: 2,
    duration: '3h 45m',
    color: '#042a4e',
    semester: 1,
    status: 'active',
    lastAccessed: '1 day ago',
  }),
  new StudentCourse({
    id: 4,
    title: 'Introduction to Programming – C++',
    category: 'CS',
    instructor: 'Dr. Layla Hassan',
    initials: 'LH',
    lessons: 8,
    completedLessons: 5,
    duration: '6h 00m',
    color: '#1a4a7a',
    semester: 2,
    status: 'active',
    lastAccessed: '5 hours ago',
  }),
  new StudentCourse({
    id: 5,
    title: 'Electrical Circuits – DC Analysis',
    category: 'Electrical',
    instructor: 'Dr. Karim Saleh',
    initials: 'KS',
    lessons: 8,
    completedLessons: 0,
    duration: '4h 55m',
    color: '#042a4e',
    semester: 2,
    status: 'paused',
    lastAccessed: '2 weeks ago',
  }),
  new StudentCourse({
    id: 6,
    title: 'Technical English for Engineers',
    category: 'Language',
    instructor: 'Ms. Nadia Youssef',
    initials: 'NY',
    lessons: 8,
    completedLessons: 7,
    duration: '2h 30m',
    color: '#1a4a7a',
    semester: 2,
    status: 'active',
    lastAccessed: '1 hour ago',
  }),
]

const TABS = [
  { key: 'all',       label: 'All Courses' },
  { key: 'active',    label: 'In Progress'  },
  { key: 'completed', label: 'Completed'    },
  { key: 'paused',    label: 'Paused'       },
]

const SORTS = [
  { key: 'recent',   label: 'Recent'   },
  { key: 'progress', label: 'Progress' },
  { key: 'title',    label: 'A → Z'    },
]

const EnrolledCourseCard = ({ course }) => {
  const navigate = useNavigate()
  const pct = course.getProgressPercent()

  return (
    <div className="scp-card">

      {/* Banner */}
      <div className={`scp-card__banner ${course.getBannerClass()}`}>
        <span className="scp-card__category">{course.category}</span>
        <span className={`scp-card__status-badge ${course.getStatusBadgeClass()}`}>
          {course.getStatusLabel()}
        </span>
      </div>

      {/* Body */}
      <div className="scp-card__body">
        <h3 className="scp-card__title">{course.title}</h3>
        <div className="scp-card__meta">
          <span className="scp-card__meta-item">🎥 {course.lessons} Videos</span>
          <span className="scp-card__meta-item">⏱ {course.duration}</span>
          <span className="scp-card__meta-item">🕐 {course.lastAccessed}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="scp-card__progress">
        <div className="scp-card__progress-header">
          <span className="scp-card__progress-label">Progress</span>
          <span className="scp-card__progress-pct">{pct}%</span>
        </div>
        <div className="scp-card__progress-track">
          <div
            className={`scp-card__progress-fill ${course.getProgressFillClass()}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="scp-card__progress-lessons">
          {course.completedLessons} of {course.lessons} lessons unlocked
        </p>
      </div>

      {/* Footer */}
      <div className="scp-card__footer">
        <div className="scp-card__instructor">
          <div className="scp-card__avatar">{course.initials}</div>
          <span className="scp-card__instructor-name">{course.instructor}</span>
        </div>
        <button
          className={`scp-card__continue-btn ${pct >= 100 ? 'scp-card__continue-btn--done' : ''}`}
          onClick={() => navigate(`/courses/${course.id}`)}
        >
          {pct >= 100 ? 'Review →' : 'Continue →'}
        </button>
      </div>

    </div>
  )
}

const StudentCoursePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [activeSort, setActiveSort] = useState('recent')

  const filtered = StudentCoursesAnalytics.filterByTab(enrolledCourses, activeTab)
  const sorted = StudentCoursesAnalytics.sortCourses(filtered, activeSort)
  const { totalCourses, completedCourses, unlockedLessons, overallPct } =
    StudentCoursesAnalytics.getHeaderStats(enrolledCourses)
  const tabCounts = StudentCoursesAnalytics.getTabCounts(enrolledCourses)

  return (
    <div className="scp-page">

      {/* ── Header ── */}
      <div className="scp-header">
        <div className="scp-header__inner">
          <div className="scp-header__left">
            <span className="scp-header__tag">My Learning</span>
            <h1 className="scp-header__title">My Courses</h1>
            <p className="scp-header__sub">Track your progress across all enrolled courses</p>
          </div>
          <div className="scp-header__stats">
            <div className="scp-header__stat-pill">
              <span className="scp-header__stat-num">{totalCourses}</span>
              <span className="scp-header__stat-label">Enrolled</span>
            </div>
            <div className="scp-header__stat-pill">
              <span className="scp-header__stat-num">{completedCourses}</span>
              <span className="scp-header__stat-label">Completed</span>
            </div>
            <div className="scp-header__stat-pill">
              <span className="scp-header__stat-num">{unlockedLessons}</span>
              <span className="scp-header__stat-label">Videos Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Overall progress bar ── */}
      <div className="scp-overall-progress">
        <div className="scp-overall-progress__inner">
          <div className="scp-overall-progress__row">
            <span className="scp-overall-progress__label">Overall Progress</span>
            <div className="scp-overall-progress__track">
              <div
                className="scp-overall-progress__fill"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="scp-overall-progress__pct">{overallPct}%</span>
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

        {/* Toolbar */}
        <div className="scp-toolbar">
          <p className="scp-toolbar__left">
            Showing <strong>{sorted.length}</strong> course{sorted.length !== 1 ? 's' : ''}
          </p>
          <div className="scp-toolbar__right">
            {SORTS.map(s => (
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

        {/* Grid or Empty */}
        {sorted.length === 0 ? (
          <div className="scp-empty">
            <div className="scp-empty__emoji">📭</div>
            <p className="scp-empty__title">No courses here yet.</p>
            <p className="scp-empty__sub">Browse the course catalog and enroll in your first course.</p>
            <button className="scp-empty__btn" onClick={() => navigate('/courses')}>
              Browse Courses →
            </button>
          </div>
        ) : (
          <div className="scp-grid">
            {sorted.map(course => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default StudentCoursePage