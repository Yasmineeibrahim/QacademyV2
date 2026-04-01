import React, { useState } from 'react'
import './AnalyticsPage.css'

/* ─── Tiny SVG bar chart ─── */
const BarChart = ({ data, color = '#0ea5e9', height = 80 }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="mini-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="mini-bar-wrap" title={`${d.label}: ${d.value}`}>
          <div className="mini-bar" style={{ height: (d.value / max * height) + 'px', background: color, borderRadius: '4px 4px 0 0', minHeight: 4 }} />
          <div className="mini-bar-lbl">{d.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── Tiny donut ─── */
const Donut = ({ pct, color, size = 80 }) => {
  const r = 30, c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 40 40)" />
      <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="800" fill="#042a4e">{pct}%</text>
    </svg>
  )
}

/* ─── Sparkline ─── */
const Sparkline = ({ values, color = '#0ea5e9' }) => {
  const max = Math.max(...values), min = Math.min(...values)
  const w = 120, h = 36
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min + 1)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]}
        r="4" fill={color} />
    </svg>
  )
}

/* ─── Mock data ─── */
const studentPurchases = [
  { student: 'Emma Wilson',   avatar: 'EW', course: 'React: Complete Guide',       video: 'L12 - Custom Hooks',          subject: 'Web Dev',  date: 'Apr 1, 2025',  amount: 29.99 },
  { student: 'Carlos Mendez', avatar: 'CM', course: 'UI/UX Design Fundamentals',   video: 'L5 - Color Theory',           subject: 'Design',   date: 'Apr 1, 2025',  amount: 24.99 },
  { student: 'Aisha Patel',   avatar: 'AP', course: 'React: Complete Guide',       video: 'L8 - State Management',       subject: 'Web Dev',  date: 'Mar 31, 2025', amount: 29.99 },
  { student: 'Tom Nguyen',    avatar: 'TN', course: 'Advanced CSS',                video: 'L3 - Keyframe Animations',    subject: 'Design',   date: 'Mar 31, 2025', amount: 19.99 },
  { student: 'Sofia Kovacs',  avatar: 'SK', course: 'UI/UX Design Fundamentals',   video: 'L11 - Prototyping in Figma',  subject: 'Design',   date: 'Mar 30, 2025', amount: 24.99 },
  { student: 'Liam Chen',     avatar: 'LC', course: 'React: Complete Guide',       video: 'L20 - Context API',           subject: 'Web Dev',  date: 'Mar 30, 2025', amount: 29.99 },
  { student: 'Nour Hassan',   avatar: 'NH', course: 'Advanced CSS',                video: 'L7 - CSS Grid Mastery',       subject: 'Design',   date: 'Mar 29, 2025', amount: 19.99 },
  { student: 'Jake Brennan',  avatar: 'JB', course: 'React: Complete Guide',       video: 'L1 - Introduction',           subject: 'Web Dev',  date: 'Mar 29, 2025', amount: 29.99 },
]

const monthlyEnroll = [
  { label:'Oct', value:38 },{ label:'Nov', value:52 },{ label:'Dec', value:44 },
  { label:'Jan', value:67 },{ label:'Feb', value:74 },{ label:'Mar', value:89 },{ label:'Apr', value:54 },
]
const revenueByMonth = [
  { label:'Oct', value:1140 },{ label:'Nov', value:1560 },{ label:'Dec', value:1320 },
  { label:'Jan', value:2010 },{ label:'Feb', value:2220 },{ label:'Mar', value:2670 },{ label:'Apr', value:1620 },
]
const topVideos = [
  { title:'L12 - Custom Hooks',          course:'React', views:148, subject:'Web Dev' },
  { title:'L5 - Color Theory',           course:'UI/UX', views:132, subject:'Design'  },
  { title:'L8 - State Management',       course:'React', views:121, subject:'Web Dev' },
  { title:'L3 - Keyframe Animations',    course:'CSS',   views:108, subject:'Design'  },
  { title:'L20 - Context API',           course:'React', views:97,  subject:'Web Dev' },
]
const subjectDist = [
  { subject:'Web Development', pct:58, color:'#0ea5e9' },
  { subject:'Design',          pct:30, color:'#8b5cf6' },
  { subject:'Backend',         pct:12, color:'#10b981' },
]

/* For ADMIN extra data */
const allEducators = [
  { name:'Sarah Mitchell', courses:3, students:3224, revenue:48640 },
  { name:'Marco Rossi',    courses:2, students:1456, revenue:21840 },
  { name:'Priya Sharma',   courses:4, students:2876, revenue:43140 },
]
const platformRevenue = [
  { label:'Oct', value:9800 },{ label:'Nov', value:13400 },{ label:'Dec', value:11200 },
  { label:'Jan', value:17600 },{ label:'Feb', value:19200 },{ label:'Mar', value:22800 },{ label:'Apr', value:14600 },
]

const AnalyticsPage = ({ role = 'educator' }) => {
  const [period, setPeriod] = useState('month')
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  const isAdmin = role === 'admin'

  const filteredPurchases = studentPurchases.filter(p =>
    (courseFilter === 'all' || p.course.toLowerCase().includes(courseFilter.toLowerCase())) &&
    (p.student.toLowerCase().includes(search.toLowerCase()) ||
     p.video.toLowerCase().includes(search.toLowerCase()) ||
     p.course.toLowerCase().includes(search.toLowerCase()))
  )

  const totalRevenue   = isAdmin ? 108540 : 60752
  const totalStudents  = isAdmin ? 7556   : 4224
  const totalCourses   = isAdmin ? 12     : 4
  const avgRating      = isAdmin ? '4.8'  : '4.8'
  const growthRevenue  = isAdmin ? '+18%' : '+22%'
  const growthStudents = isAdmin ? '+12%' : '+14%'

  return (
    <main className="page analytics-page">
      {/* ── Header ── */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">{isAdmin ? '📊 Platform Analytics' : '📊 My Analytics'}</h1>
          <p className="analytics-sub">{isAdmin ? 'Full platform overview — students, educators, revenue.' : 'Track your course performance and student engagement.'}</p>
        </div>
        <div className="period-toggle">
          {['week','month','year'].map(p => (
            <button key={p} className={`period-btn${period===p?' period-btn--active':''}`} onClick={() => setPeriod(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label:'Total Revenue',    value:'$'+totalRevenue.toLocaleString(), icon:'💰', color:'#10b981', delta:growthRevenue,  up:true,  spark:[1140,1560,1320,2010,2220,2670,1620] },
          { label:'Total Students',   value:totalStudents.toLocaleString(),     icon:'👥', color:'#0ea5e9', delta:growthStudents, up:true,  spark:[38,52,44,67,74,89,54] },
          { label:isAdmin?'Courses':'My Courses', value:totalCourses, icon:'📚', color:'#8b5cf6', delta:'', up:true, spark:[2,3,3,4,4,4,4] },
          { label:'Avg. Rating',      value:avgRating+' ⭐', icon:'🏅', color:'#f59e0b', delta:'+0.1', up:true, spark:[4.5,4.6,4.7,4.7,4.8,4.8,4.8] },
        ].map(s => (
          <div className="stat-card kpi-card" key={s.label}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div className="stat-card__icon" style={{ background: s.color+'18', marginBottom:10 }}><span>{s.icon}</span></div>
                <div className="stat-card__value" style={{ fontSize:'1.6rem' }}>{s.value}</div>
                <div className="stat-card__label">{s.label}</div>
                {s.delta && <div className={`stat-card__delta stat-card__delta--${s.up?'up':'down'}`}>{s.up?'▲':'▼'} {s.delta} vs last {period}</div>}
              </div>
              <div style={{ marginTop: 4 }}><Sparkline values={s.spark} color={s.color} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Monthly enrollments */}
        <div className="card">
          <div className="card-inner">
            <h2 className="sec-title">📈 Monthly Enrollments</h2>
            <BarChart data={monthlyEnroll} color="#0ea5e9" height={100} />
          </div>
        </div>
        {/* Revenue */}
        <div className="card">
          <div className="card-inner">
            <h2 className="sec-title">💵 Revenue by Month ($)</h2>
            <BarChart data={isAdmin ? platformRevenue : revenueByMonth} color="#10b981" height={100} />
          </div>
        </div>
      </div>

      {/* ── Subject distribution + Top videos ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Subject dist */}
        <div className="card">
          <div className="card-inner">
            <h2 className="sec-title">🥧 Subject Distribution</h2>
            <div className="subject-dist">
              {subjectDist.map(s => (
                <div key={s.subject} className="subject-dist-row">
                  <Donut pct={s.pct} color={s.color} size={72} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:'.9rem', color:'var(--navy)', marginBottom:4 }}>{s.subject}</div>
                    <div className="bar-track"><div className="bar-fill" style={{ width: s.pct+'%', background: s.color }} /></div>
                    <div style={{ fontSize:'.76rem', color:'var(--text-soft)', marginTop:4 }}>{s.pct}% of purchases</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top videos */}
        <div className="card">
          <div className="card-inner">
            <h2 className="sec-title">🎬 Top Purchased Videos</h2>
            {topVideos.map((v, i) => (
              <div key={v.title} className="top-video-row">
                <span className="top-video-rank">#{i+1}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text)' }}>{v.title}</div>
                  <div style={{ fontSize:'.76rem', color:'var(--text-soft)' }}>{v.course} · {v.subject}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'.95rem', color:'var(--navy)' }}>{v.views}</span>
                  <span style={{ fontSize:'.7rem', color:'var(--text-muted)' }}>purchases</span>
                </div>
                <div style={{ width: 60 }}><div className="bar-track"><div className="bar-fill" style={{ width: (v.views/topVideos[0].views*100)+'%' }} /></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Admin: Educators table ── */}
      {isAdmin && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-inner">
            <h2 className="sec-title">👩‍🏫 Top Educators</h2>
            <table className="tbl">
              <thead><tr><th>Educator</th><th>Courses</th><th>Students</th><th>Revenue</th><th>Avg Revenue/Course</th></tr></thead>
              <tbody>
                {allEducators.map(e => (
                  <tr key={e.name}>
                    <td><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ width:34, height:34, fontSize:'.78rem' }}>{e.name.split(' ').map(n=>n[0]).join('')}</div>
                      <span style={{ fontWeight:600 }}>{e.name}</span>
                    </div></td>
                    <td>{e.courses}</td>
                    <td style={{ fontWeight:700 }}>{e.students.toLocaleString()}</td>
                    <td style={{ fontWeight:700, color:'var(--green)' }}>${e.revenue.toLocaleString()}</td>
                    <td style={{ color:'var(--text-soft)' }}>${Math.round(e.revenue/e.courses).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Student purchases table ── */}
      <div className="card">
        <div className="card-inner">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
            <h2 className="sec-title" style={{ marginBottom:0 }}>
              {isAdmin ? '🧾 All Student Purchases' : '🧾 Student Purchases'}
            </h2>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <div className="courses-search-wrap">
                <span className="courses-search-icon">🔍</span>
                <input className="courses-search" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width:'auto' }} value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
                <option value="all">All Courses</option>
                <option value="React">React</option>
                <option value="UI/UX">UI/UX Design</option>
                <option value="CSS">Advanced CSS</option>
              </select>
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Student</th><th>Course</th><th>Video Purchased</th><th>Subject</th><th>Date</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="avatar" style={{ width:32, height:32, fontSize:'.7rem' }}>{p.avatar}</div>
                        <span style={{ fontWeight:600, fontSize:'.88rem' }}>{p.student}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--blue" style={{ fontSize:'.7rem' }}>{p.course.length > 20 ? p.course.slice(0,20)+'…' : p.course}</span>
                    </td>
                    <td style={{ fontSize:'.85rem', color:'var(--text-mid)' }}>🎬 {p.video}</td>
                    <td>
                      <span className={`badge ${p.subject==='Web Dev'?'badge--blue':'badge--purple'}`}>{p.subject}</span>
                    </td>
                    <td style={{ fontSize:'.82rem', color:'var(--text-soft)' }}>{p.date}</td>
                    <td style={{ fontWeight:700, color:'var(--green)' }}>${p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'.82rem', color:'var(--text-soft)' }}>
            <span>Showing {filteredPurchases.length} of {studentPurchases.length} purchases</span>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn--ghost" style={{ padding:'5px 12px', fontSize:'.78rem' }}>← Prev</button>
              <button className="btn btn--ghost" style={{ padding:'5px 12px', fontSize:'.78rem' }}>Next →</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AnalyticsPage