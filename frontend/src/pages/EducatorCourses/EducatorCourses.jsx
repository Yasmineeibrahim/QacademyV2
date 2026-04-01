import React, { useState } from 'react'
import './EducatorCourses.css'

const myCourses = [
  {
    id: 1, title: 'React: The Complete Guide', category: 'Web Development',
    thumb: '⚛️', status: 'published', students: 1243, rating: 4.9, reviews: 312,
    revenue: 18640, lessons: 42, duration: '14h 30m', lastUpdated: 'Mar 2025',
    enrolled7d: 54, completionRate: 68,
  },
  {
    id: 2, title: 'Advanced CSS & Animations', category: 'Design',
    thumb: '✨', status: 'published', students: 876, rating: 4.8, reviews: 201,
    revenue: 10512, lessons: 28, duration: '9h 15m', lastUpdated: 'Jan 2025',
    enrolled7d: 32, completionRate: 74,
  },
  {
    id: 3, title: 'JavaScript Patterns & Performance', category: 'Web Development',
    thumb: '💛', status: 'draft', students: 0, rating: 0, reviews: 0,
    revenue: 0, lessons: 15, duration: '6h 00m', lastUpdated: 'Apr 2025',
    enrolled7d: 0, completionRate: 0,
  },
  {
    id: 4, title: 'UI/UX Design Fundamentals', category: 'Design',
    thumb: '🎨', status: 'published', students: 2105, rating: 4.7, reviews: 489,
    revenue: 31575, lessons: 35, duration: '12h 45m', lastUpdated: 'Feb 2025',
    enrolled7d: 87, completionRate: 61,
  },
]

const statusCfg = {
  published: { label: 'Published', cls: 'badge--green' },
  draft:     { label: 'Draft',     cls: 'badge--amber' },
  archived:  { label: 'Archived',  cls: 'badge--rose'  },
}

const catColors = {
  'Web Development': 'badge--blue',
  'Design':          'badge--purple',
  'Backend':         'badge--teal',
}

const EducatorCourses = () => {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  const totalStudents = myCourses.reduce((s, c) => s + c.students, 0)
  const totalRevenue  = myCourses.reduce((s, c) => s + c.revenue, 0)
  const avgRating     = (myCourses.filter(c=>c.rating>0).reduce((s,c) => s + c.rating, 0) / myCourses.filter(c=>c.rating>0).length).toFixed(1)
  const totalLessons  = myCourses.reduce((s, c) => s + c.lessons, 0)

  const filtered = myCourses
    .filter(c => statusFilter === 'all' || c.status === statusFilter)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="page educator-courses-page">
      {/* Header */}
      <div className="courses-header">
        <div>
          <h1 className="courses-title">My Courses</h1>
          <p className="courses-sub">Manage, update and track all your teaching content.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowCreate(true)}>＋ Create New Course</button>
      </div>

      {/* Stats */}
      <div className="grid-4 courses-summary">
        {[
          { value: myCourses.length,             label: 'Total Courses',   icon: '📚', color: '#0ea5e9' },
          { value: totalStudents.toLocaleString(), label: 'Total Students', icon: '👥', color: '#10b981' },
          { value: '$' + totalRevenue.toLocaleString(), label: 'Total Revenue', icon: '💰', color: '#f59e0b' },
          { value: avgRating + ' ⭐',              label: 'Avg. Rating',    icon: '🏅', color: '#8b5cf6' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card__icon" style={{ background: s.color + '18' }}><span>{s.icon}</span></div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="courses-controls">
        <div className="courses-filters">
          {[['all','All'], ['published','Published'], ['draft','Draft']].map(([val, lbl]) => (
            <button key={val} className={`courses-filter-btn${statusFilter===val?' courses-filter-btn--active':''}`} onClick={() => setStatusFilter(val)}>{lbl}</button>
          ))}
        </div>
        <div className="courses-controls-right">
          <div className="courses-search-wrap">
            <span className="courses-search-icon">🔍</span>
            <input className="courses-search" placeholder="Search your courses…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="view-toggle">
            <button className={`view-btn${view==='grid'?' view-btn--active':''}`} onClick={() => setView('grid')}>▦</button>
            <button className={`view-btn${view==='list'?' view-btn--active':''}`} onClick={() => setView('list')}>☰</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {view === 'grid' ? (
        <div className="courses-grid">
          {filtered.map(c => (
            <div className="edu-course-card card" key={c.id}>
              <div className="course-card__thumb">
                <span className="course-card__emoji">{c.thumb}</span>
                <span className={`badge ${statusCfg[c.status].cls} course-card__status`}>{statusCfg[c.status].label}</span>
              </div>
              <div className="course-card__body">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span className={`badge ${catColors[c.category] || 'badge--blue'}`}>{c.category}</span>
                </div>
                <h3 className="course-card__title">{c.title}</h3>
                <div className="edu-course-kpis">
                  <div className="edu-kpi"><span className="edu-kpi__val">{c.students.toLocaleString()}</span><span className="edu-kpi__lbl">Students</span></div>
                  <div className="edu-kpi"><span className="edu-kpi__val">{c.rating > 0 ? c.rating : '—'}</span><span className="edu-kpi__lbl">Rating</span></div>
                  <div className="edu-kpi"><span className="edu-kpi__val">${c.revenue.toLocaleString()}</span><span className="edu-kpi__lbl">Revenue</span></div>
                </div>
                {c.status === 'published' && (
                  <div className="edu-completion-row">
                    <span className="edu-completion-label">Completion Rate</span>
                    <span className="edu-completion-pct">{c.completionRate}%</span>
                    <div className="bar-track" style={{ flex:1 }}><div className="bar-fill" style={{ width: c.completionRate + '%', background: 'linear-gradient(90deg, var(--green), var(--teal))' }} /></div>
                  </div>
                )}
                <div className="course-card__meta">
                  <span>📖 {c.lessons} lessons</span>
                  <span>⏱️ {c.duration}</span>
                  <span>📅 {c.lastUpdated}</span>
                </div>
                <div className="course-card__footer">
                  <span className="course-card__last">+{c.enrolled7d} this week</span>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn btn--ghost" style={{ padding:'6px 12px', fontSize:'.78rem' }}>✏️ Edit</button>
                    <button className="btn btn--primary" style={{ padding:'6px 12px', fontSize:'.78rem' }}>📊 Stats</button>
                  </div>
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
                <th>Course</th><th>Status</th><th>Students</th><th>Revenue</th><th>Rating</th><th>Completion</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:'1.4rem' }}>{c.thumb}</span>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'.9rem' }}>{c.title}</div>
                        <span className={`badge ${catColors[c.category] || 'badge--blue'}`}>{c.category}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${statusCfg[c.status].cls}`}>{statusCfg[c.status].label}</span></td>
                  <td style={{ fontWeight:700 }}>{c.students.toLocaleString()}</td>
                  <td style={{ fontWeight:700, color:'var(--green)' }}>${c.revenue.toLocaleString()}</td>
                  <td>{c.rating > 0 ? `⭐ ${c.rating}` : '—'}</td>
                  <td style={{ minWidth:120 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="bar-track" style={{ flex:1 }}><div className="bar-fill" style={{ width: c.completionRate+'%', background:'linear-gradient(90deg,var(--green),var(--teal))' }} /></div>
                      <span style={{ fontSize:'.78rem', fontWeight:700, color:'var(--green)' }}>{c.completionRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn--ghost" style={{ padding:'5px 10px', fontSize:'.78rem' }}>✏️ Edit</button>
                      <button className="btn btn--primary" style={{ padding:'5px 10px', fontSize:'.78rem' }}>📊</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create course modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="card-inner">
              <h2 className="sec-title">Create New Course</h2>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input className="form-input" placeholder="e.g. Advanced React Patterns" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select">
                  <option>Web Development</option>
                  <option>Design</option>
                  <option>Backend</option>
                  <option>Data Science</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="What will students learn?" />
              </div>
              <div style={{ display:'flex', gap:12, marginTop:8 }}>
                <button className="btn btn--primary" style={{ flex:1, justifyContent:'center' }}>Create Draft</button>
                <button className="btn btn--ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default EducatorCourses