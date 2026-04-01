import React, { useState } from 'react'
import './studentCourses.css'

const courses = [
  {
    id: 1, title: 'React: The Complete Guide', instructor: 'Sarah Mitchell',
    category: 'Web Development', progress: 78, totalLessons: 42, doneLessons: 33,
    thumb: '⚛️', rating: 4.9, lastAccessed: '2 days ago', status: 'in-progress',
    nextLesson: 'Custom Hooks Deep Dive', duration: '14h 30m',
  },
  {
    id: 2, title: 'UI/UX Design Fundamentals', instructor: 'Marco Rossi',
    category: 'Design', progress: 100, totalLessons: 28, doneLessons: 28,
    thumb: '🎨', rating: 4.7, lastAccessed: '1 week ago', status: 'completed',
    nextLesson: null, duration: '9h 15m',
  },
  {
    id: 3, title: 'Python for Data Science', instructor: 'Dr. Aisha Khan',
    category: 'Data Science', progress: 35, totalLessons: 56, doneLessons: 20,
    thumb: '🐍', rating: 4.8, lastAccessed: 'Yesterday', status: 'in-progress',
    nextLesson: 'Pandas DataFrames', duration: '22h 00m',
  },
  {
    id: 4, title: 'Advanced JavaScript Patterns', instructor: 'James O\'Brien',
    category: 'Web Development', progress: 0, totalLessons: 30, doneLessons: 0,
    thumb: '💛', rating: 4.6, lastAccessed: 'Not started', status: 'not-started',
    nextLesson: 'Module Introduction', duration: '11h 45m',
  },
  {
    id: 5, title: 'Node.js & Express Backend', instructor: 'Priya Sharma',
    category: 'Backend', progress: 62, totalLessons: 38, doneLessons: 24,
    thumb: '🟢', rating: 4.5, lastAccessed: '3 days ago', status: 'in-progress',
    nextLesson: 'JWT Authentication', duration: '13h 20m',
  },
  {
    id: 6, title: 'CSS Animations & Motion', instructor: 'Lena Weber',
    category: 'Design', progress: 100, totalLessons: 18, doneLessons: 18,
    thumb: '✨', rating: 4.9, lastAccessed: '2 weeks ago', status: 'completed',
    nextLesson: null, duration: '6h 30m',
  },
]

const categoryColors = {
  'Web Development': 'badge--blue',
  'Design': 'badge--purple',
  'Data Science': 'badge--teal',
  'Backend': 'badge--green',
}

const statusConfig = {
  'in-progress': { label: 'In Progress', cls: 'badge--amber' },
  'completed':   { label: 'Completed',   cls: 'badge--green' },
  'not-started': { label: 'Not Started', cls: 'badge--rose'  },
}

const StudentCourses = () => {
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [view, setView]       = useState('grid') // 'grid' | 'list'
  const [sortBy, setSortBy]   = useState('recent')

  const filtered = courses
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) ||
                 c.instructor.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress
      if (sortBy === 'name')     return a.title.localeCompare(b.title)
      return 0
    })

  const inProgress = courses.filter(c => c.status === 'in-progress').length
  const completed  = courses.filter(c => c.status === 'completed').length
  const totalH     = 77

  return (
    <main className="page courses-page">
      {/* ── Page header ── */}
      <div className="courses-header">
        <div>
          <h1 className="courses-title">My Courses</h1>
          <p className="courses-sub">Continue learning from where you left off.</p>
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid-4 courses-summary">
        {[
          { value: courses.length, label: 'Enrolled',      icon: '📚', color: '#0ea5e9' },
          { value: inProgress,     label: 'In Progress',   icon: '🔄', color: '#f59e0b' },
          { value: completed,      label: 'Completed',     icon: '✅', color: '#10b981' },
          { value: totalH + 'h',   label: 'Total Hours',   icon: '⏱️', color: '#8b5cf6' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card__icon" style={{ background: s.color + '18' }}><span>{s.icon}</span></div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="courses-controls">
        <div className="courses-filters">
          {[['all','All'], ['in-progress','In Progress'], ['completed','Completed'], ['not-started','Not Started']].map(([val, lbl]) => (
            <button key={val} className={`courses-filter-btn${filter===val?' courses-filter-btn--active':''}`} onClick={() => setFilter(val)}>{lbl}</button>
          ))}
        </div>
        <div className="courses-controls-right">
          <div className="courses-search-wrap">
            <span className="courses-search-icon">🔍</span>
            <input className="courses-search" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select courses-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent">Recent</option>
            <option value="progress">Progress</option>
            <option value="name">Name</option>
          </select>
          <div className="view-toggle">
            <button className={`view-btn${view==='grid'?' view-btn--active':''}`} onClick={() => setView('grid')}>▦</button>
            <button className={`view-btn${view==='list'?' view-btn--active':''}`} onClick={() => setView('list')}>☰</button>
          </div>
        </div>
      </div>

      {/* ── Course cards ── */}
      {view === 'grid' ? (
        <div className="courses-grid">
          {filtered.map(c => (
            <div className="course-card card" key={c.id}>
              <div className="course-card__thumb">
                <span className="course-card__emoji">{c.thumb}</span>
                <span className={`badge ${statusConfig[c.status].cls} course-card__status`}>{statusConfig[c.status].label}</span>
              </div>
              <div className="course-card__body">
                <div className="course-card__cats">
                  <span className={`badge ${categoryColors[c.category] || 'badge--blue'}`}>{c.category}</span>
                </div>
                <h3 className="course-card__title">{c.title}</h3>
                <p className="course-card__instructor">👤 {c.instructor}</p>
                <div className="course-card__progress-row">
                  <div className="bar-track" style={{ flex: 1 }}><div className="bar-fill" style={{ width: c.progress + '%' }} /></div>
                  <span className="course-card__pct">{c.progress}%</span>
                </div>
                <div className="course-card__meta">
                  <span>📖 {c.doneLessons}/{c.totalLessons} lessons</span>
                  <span>⏱️ {c.duration}</span>
                </div>
                {c.nextLesson && (
                  <div className="course-card__next">▶ Next: <b>{c.nextLesson}</b></div>
                )}
                <div className="course-card__footer">
                  <span className="course-card__last">🕐 {c.lastAccessed}</span>
                  <button className="btn btn--primary course-card__cta">
                    {c.status === 'not-started' ? 'Start' : c.status === 'completed' ? 'Review' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Progress</th>
                <th>Lessons</th>
                <th>Status</th>
                <th>Last Accessed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.4rem' }}>{c.thumb}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{c.title}</div>
                        <div style={{ fontSize: '.78rem', color: 'var(--text-soft)' }}>👤 {c.instructor}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${categoryColors[c.category] || 'badge--blue'}`}>{c.category}</span></td>
                  <td style={{ minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="bar-track" style={{ flex: 1 }}><div className="bar-fill" style={{ width: c.progress + '%' }} /></div>
                      <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--accent)' }}>{c.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '.85rem', color: 'var(--text-soft)' }}>{c.doneLessons}/{c.totalLessons}</td>
                  <td><span className={`badge ${statusConfig[c.status].cls}`}>{statusConfig[c.status].label}</span></td>
                  <td style={{ fontSize: '.82rem', color: 'var(--text-soft)' }}>{c.lastAccessed}</td>
                  <td>
                    <button className="btn btn--ghost" style={{ padding: '6px 14px', fontSize: '.8rem' }}>
                      {c.status === 'not-started' ? 'Start' : c.status === 'completed' ? 'Review' : 'Continue'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="courses-empty">
          <div className="courses-empty__icon">🔍</div>
          <div className="courses-empty__title">No courses found</div>
          <div className="courses-empty__sub">Try adjusting your filters or search.</div>
        </div>
      )}
    </main>
  )
}

export default StudentCourses