// src/pages/AdminAnalyticsPage.jsx
import React, { useState, useRef, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from 'recharts'
import './AdminAnalyticsPage.css'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (replace every array/object here with your real API responses)
// ─────────────────────────────────────────────────────────────────────────────

const DOCTORS = [
  { id: 1, name: 'Dr. Ahmed Nour',    initials: 'AN', dept: 'Mathematics',       courses: 4 },
  { id: 2, name: 'Dr. Sara Mahmoud',  initials: 'SM', dept: 'Physics',            courses: 3 },
  { id: 3, name: 'Dr. Karim Saleh',   initials: 'KS', dept: 'Electrical Eng.',    courses: 2 },
  { id: 4, name: 'Dr. Layla Hassan',  initials: 'LH', dept: 'Computer Science',   courses: 5 },
  { id: 5, name: 'Eng. Omar Fathi',   initials: 'OF', dept: 'Engineering Drawing', courses: 2 },
]

const DOCTOR_DATA = {
  1: {
    kpis: { courses: 4, totalStudents: 349, totalViews: 4820, avgCompletion: 62 },
    enrollmentPerCourse: [
      { name: 'Calculus I',   students: 148 },
      { name: 'Calculus II',  students: 112 },
      { name: 'Lin. Algebra', students: 89  },
      { name: 'Diff. Eq.',    students: 0   },
    ],
    viewsOverTime: [
      { month: 'Jan', views: 320 }, { month: 'Feb', views: 480 },
      { month: 'Mar', views: 610 }, { month: 'Apr', views: 540 },
      { month: 'May', views: 720 }, { month: 'Jun', views: 890 },
      { month: 'Jul', views: 760 }, { month: 'Aug', views: 500 },
    ],
    completionRate: [
      { name: 'Completed', value: 62 },
      { name: 'In Progress', value: 24 },
      { name: 'Dropped', value: 14 },
    ],
    engagementRadial: [
      { name: 'Watch Time',    value: 78, fill: '#042a4e' },
      { name: 'Interactions',  value: 54, fill: '#1a4a7a' },
      { name: 'Completion',    value: 62, fill: '#fff613' },
    ],
    videos: [
      { title: 'Introduction & Overview',        course: 'Calculus I',   views: 148, watchTime: '12m', completion: 91 },
      { title: 'Core Concepts Explained',        course: 'Calculus I',   views: 121, watchTime: '14m', completion: 74 },
      { title: 'Hands-on Practice Session',      course: 'Calculus I',   views: 109, watchTime: '18m', completion: 66 },
      { title: 'Deep Dive: Advanced Techniques', course: 'Calculus II',  views: 98,  watchTime: '22m', completion: 58 },
      { title: 'Mid-Term Revision',              course: 'Calculus II',  views: 87,  watchTime: '16m', completion: 51 },
      { title: 'Common Pitfalls',                course: 'Lin. Algebra', views: 76,  watchTime: '11m', completion: 48 },
      { title: 'Project Walkthrough',            course: 'Lin. Algebra', views: 65,  watchTime: '20m', completion: 43 },
      { title: 'Final Revision',                 course: 'Calculus I',   views: 58,  watchTime: '8m',  completion: 38 },
    ],
  },
  2: {
    kpis: { courses: 3, totalStudents: 214, totalViews: 2980, avgCompletion: 55 },
    enrollmentPerCourse: [
      { name: 'Physics I',  students: 98  },
      { name: 'Physics II', students: 76  },
      { name: 'Optics',     students: 40  },
    ],
    viewsOverTime: [
      { month: 'Jan', views: 200 }, { month: 'Feb', views: 310 },
      { month: 'Mar', views: 420 }, { month: 'Apr', views: 390 },
      { month: 'May', views: 510 }, { month: 'Jun', views: 620 },
      { month: 'Jul', views: 580 }, { month: 'Aug', views: 430 },
    ],
    completionRate: [
      { name: 'Completed', value: 55 },
      { name: 'In Progress', value: 30 },
      { name: 'Dropped', value: 15 },
    ],
    engagementRadial: [
      { name: 'Watch Time',   value: 70, fill: '#042a4e' },
      { name: 'Interactions', value: 45, fill: '#1a4a7a' },
      { name: 'Completion',   value: 55, fill: '#fff613' },
    ],
    videos: [
      { title: 'Mechanics Intro',     course: 'Physics I',  views: 98,  watchTime: '10m', completion: 88 },
      { title: 'Newton\'s Laws',      course: 'Physics I',  views: 82,  watchTime: '16m', completion: 70 },
      { title: 'Energy & Work',       course: 'Physics II', views: 71,  watchTime: '14m', completion: 61 },
      { title: 'Wave Motion',         course: 'Physics II', views: 60,  watchTime: '12m', completion: 52 },
    ],
  },
  3: {
    kpis: { courses: 2, totalStudents: 130, totalViews: 1640, avgCompletion: 48 },
    enrollmentPerCourse: [
      { name: 'DC Circuits', students: 80 },
      { name: 'AC Circuits', students: 50 },
    ],
    viewsOverTime: [
      { month: 'Jan', views: 140 }, { month: 'Feb', views: 200 },
      { month: 'Mar', views: 280 }, { month: 'Apr', views: 260 },
      { month: 'May', views: 310 }, { month: 'Jun', views: 390 },
      { month: 'Jul', views: 330 }, { month: 'Aug', views: 280 },
    ],
    completionRate: [
      { name: 'Completed', value: 48 },
      { name: 'In Progress', value: 35 },
      { name: 'Dropped', value: 17 },
    ],
    engagementRadial: [
      { name: 'Watch Time',   value: 65, fill: '#042a4e' },
      { name: 'Interactions', value: 40, fill: '#1a4a7a' },
      { name: 'Completion',   value: 48, fill: '#fff613' },
    ],
    videos: [
      { title: 'Ohm\'s Law',        course: 'DC Circuits', views: 80, watchTime: '9m',  completion: 85 },
      { title: 'Kirchhoff\'s Laws', course: 'DC Circuits', views: 66, watchTime: '13m', completion: 68 },
      { title: 'AC Fundamentals',   course: 'AC Circuits', views: 54, watchTime: '15m', completion: 52 },
    ],
  },
  4: {
    kpis: { courses: 5, totalStudents: 512, totalViews: 7230, avgCompletion: 70 },
    enrollmentPerCourse: [
      { name: 'Prog. C++',    students: 160 },
      { name: 'Data Struct.', students: 130 },
      { name: 'Algorithms',   students: 100 },
      { name: 'OOP Java',     students: 82  },
      { name: 'Web Dev',      students: 40  },
    ],
    viewsOverTime: [
      { month: 'Jan', views: 580 }, { month: 'Feb', views: 720 },
      { month: 'Mar', views: 950 }, { month: 'Apr', views: 840 },
      { month: 'May', views: 1100 }, { month: 'Jun', views: 1280 },
      { month: 'Jul', views: 1060 }, { month: 'Aug', views: 700 },
    ],
    completionRate: [
      { name: 'Completed', value: 70 },
      { name: 'In Progress', value: 20 },
      { name: 'Dropped', value: 10 },
    ],
    engagementRadial: [
      { name: 'Watch Time',   value: 85, fill: '#042a4e' },
      { name: 'Interactions', value: 68, fill: '#1a4a7a' },
      { name: 'Completion',   value: 70, fill: '#fff613' },
    ],
    videos: [
      { title: 'Into to C++',      course: 'Prog. C++',    views: 160, watchTime: '11m', completion: 95 },
      { title: 'Pointers & Mem.',  course: 'Prog. C++',    views: 140, watchTime: '19m', completion: 80 },
      { title: 'Linked Lists',     course: 'Data Struct.', views: 130, watchTime: '22m', completion: 74 },
      { title: 'Trees & Graphs',   course: 'Data Struct.', views: 110, watchTime: '25m', completion: 65 },
      { title: 'Sorting Algos',    course: 'Algorithms',   views: 100, watchTime: '20m', completion: 60 },
    ],
  },
  5: {
    kpis: { courses: 2, totalStudents: 98, totalViews: 1120, avgCompletion: 44 },
    enrollmentPerCourse: [
      { name: 'Eng. Drawing', students: 65 },
      { name: 'CAD Basics',   students: 33 },
    ],
    viewsOverTime: [
      { month: 'Jan', views: 90 }, { month: 'Feb', views: 130 },
      { month: 'Mar', views: 160 }, { month: 'Apr', views: 140 },
      { month: 'May', views: 190 }, { month: 'Jun', views: 220 },
      { month: 'Jul', views: 200 }, { month: 'Aug', views: 150 },
    ],
    completionRate: [
      { name: 'Completed', value: 44 },
      { name: 'In Progress', value: 38 },
      { name: 'Dropped', value: 18 },
    ],
    engagementRadial: [
      { name: 'Watch Time',   value: 60, fill: '#042a4e' },
      { name: 'Interactions', value: 38, fill: '#1a4a7a' },
      { name: 'Completion',   value: 44, fill: '#fff613' },
    ],
    videos: [
      { title: 'Orthographic Views', course: 'Eng. Drawing', views: 65, watchTime: '14m', completion: 80 },
      { title: 'Isometric Drawing',  course: 'Eng. Drawing', views: 50, watchTime: '16m', completion: 62 },
      { title: 'AutoCAD Basics',     course: 'CAD Basics',   views: 33, watchTime: '20m', completion: 45 },
    ],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART COLOURS
// ─────────────────────────────────────────────────────────────────────────────
const PIE_COLORS   = ['#042a4e', '#1a4a7a', '#f59e0b']
const BAR_COLOR    = '#042a4e'
const LINE_COLOR   = '#fff613'
const LINE_STROKE  = '#042a4e'

const CustomTooltipStyle = {
  background: '#042a4e',
  border: 'none',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
  fontWeight: 600,
  padding: '8px 14px',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={CustomTooltipStyle}>
      {label && <p style={{ color: '#fff613', marginBottom: 4, fontSize: 11 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0 }}>{p.name ?? ''}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
const DoctorSelector = ({ selected, onSelect }) => {
  const [query, setQuery]     = useState('')
  const [open, setOpen]       = useState(false)
  const wrapRef               = useRef(null)

  const filtered = DOCTORS.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.dept.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handler = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (selected) {
    return (
      <div className="aap-selected-doctor">
        <div className="aap-selected-avatar">{selected.initials}</div>
        <div>
          <div className="aap-selected-name">{selected.name}</div>
          <div className="aap-selected-dept">{selected.dept}</div>
        </div>
        <button className="aap-change-btn" onClick={() => onSelect(null)}>Change</button>
      </div>
    )
  }

  return (
    <div className="aap-doctor-selector">
      <span className="aap-selector-label">Select Instructor</span>
      <div className="aap-selector-wrap" ref={wrapRef}>
        <span className="aap-selector-icon">🔍</span>
        <input
          placeholder="Search by name or department…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {open && filtered.length > 0 && (
          <div className="aap-dropdown">
            {filtered.map(d => (
              <div
                key={d.id}
                className="aap-dropdown-item"
                onClick={() => { onSelect(d); setOpen(false); setQuery('') }}
              >
                <div className="aap-dropdown-avatar">{d.initials}</div>
                <div>
                  <div className="aap-dropdown-name">{d.name}</div>
                  <div className="aap-dropdown-meta">{d.dept} · {d.courses} courses</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART CARD WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const ChartCard = ({ title, sub, badge, children }) => (
  <div className="aap-chart-card">
    <div className="aap-chart-card__header">
      <div>
        <p className="aap-chart-card__title">{title}</p>
        {sub && <p className="aap-chart-card__sub">{sub}</p>}
      </div>
      {badge && <span className="aap-chart-card__badge">{badge}</span>}
    </div>
    {children}
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS DASHBOARD (rendered when doctor is selected)
// ─────────────────────────────────────────────────────────────────────────────
const AnalyticsDashboard = ({ doctor }) => {
  const data = DOCTOR_DATA[doctor.id]
  const maxViews = Math.max(...data.videos.map(v => v.views), 1)

  return (
    <>
      {/* ROW 1: Views over time (wide) + Completion pie */}
      <div className="aap-charts-row aap-charts-row--2col">

        <ChartCard
          title="Video Views Over Time"
          sub="Monthly view count across all courses"
          badge="Line Chart"
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.viewsOverTime} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(4,42,78,0.07)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="views"
                stroke={LINE_STROKE}
                strokeWidth={2.5}
                dot={{ fill: '#fff613', stroke: '#042a4e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#fff613' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Student Completion Rate"
          sub="Distribution across all courses"
          badge="Pie Chart"
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.completionRate}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.completionRate.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [`${v}%`, n]}
                contentStyle={CustomTooltipStyle}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11, color: 'rgba(4,42,78,0.6)', fontWeight: 600 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ROW 2: Enrollments bar + Engagement radial */}
      <div className="aap-charts-row aap-charts-row--2col">

        <ChartCard
          title="Enrollments per Course"
          sub="Number of students enrolled in each course"
          badge="Bar Chart"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.enrollmentPerCourse} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(4,42,78,0.07)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(4,42,78,0.45)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" fill={BAR_COLOR} radius={[5, 5, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Engagement Metrics"
          sub="Watch time · Interactions · Completion"
          badge="Radial Chart"
        >
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius={30} outerRadius={95}
              data={data.engagementRadial}
              startAngle={90} endAngle={-270}
            >
              <RadialBar
                minAngle={10}
                background={{ fill: 'rgba(4,42,78,0.05)' }}
                clockWise
                dataKey="value"
                cornerRadius={4}
              />
              <Tooltip
                formatter={(v, n) => [`${v}%`, n]}
                contentStyle={CustomTooltipStyle}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11, color: 'rgba(4,42,78,0.6)', fontWeight: 600 }}>{v}</span>}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ROW 3: Full-width video breakdown table */}
      <ChartCard
        title="Per-Video Performance"
        sub="Views, average watch time, and completion rate per video"
        badge={`${data.videos.length} videos`}
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="aap-video-table">
            <thead>
              <tr>
                <th>Video Title</th>
                <th>Course</th>
                <th>Views</th>
                <th>Avg. Watch Time</th>
                <th>Completion %</th>
                <th>Reach</th>
              </tr>
            </thead>
            <tbody>
              {data.videos.map((v, i) => (
                <tr key={i}>
                  <td>{v.title}</td>
                  <td>{v.course}</td>
                  <td>{v.views}</td>
                  <td>{v.watchTime}</td>
                  <td>{v.completion}%</td>
                  <td>
                    <div className="aap-vt-bar-wrap">
                      <div className="aap-vt-bar-track">
                        <div
                          className="aap-vt-bar-fill"
                          style={{ width: `${Math.round((v.views / maxViews) * 100)}%` }}
                        />
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(4,42,78,0.4)', fontWeight: 600, minWidth: 28 }}>
                        {Math.round((v.views / maxViews) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AdminAnalyticsPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const data = selectedDoctor ? DOCTOR_DATA[selectedDoctor.id] : null

  return (
    <div className="aap-page">

      {/* Header */}
      <div className="aap-header">
        <div className="aap-header__inner">
          <div className="aap-header__left">
            <span className="aap-header__breadcrumb">Admin · <span>Analytics</span></span>
            <h1 className="aap-header__title">Instructor Analytics</h1>
            <p className="aap-header__sub">
              {selectedDoctor
                ? `Viewing analytics for ${selectedDoctor.name}`
                : 'Select an instructor to view detailed analytics'}
            </p>
          </div>
          <DoctorSelector selected={selectedDoctor} onSelect={setSelectedDoctor} />
        </div>

        {/* KPI strip */}
        {data && (
          <div className="aap-kpi-strip">
            <div className="aap-kpi-strip__inner">
              <div className="aap-kpi-pill">
                <span className="aap-kpi-pill__label">Courses</span>
                <span className="aap-kpi-pill__val">{data.kpis.courses}</span>
              </div>
              <div className="aap-kpi-pill">
                <span className="aap-kpi-pill__label">Total Students</span>
                <span className="aap-kpi-pill__val aap-kpi-pill__val--white">{data.kpis.totalStudents}</span>
              </div>
              <div className="aap-kpi-pill">
                <span className="aap-kpi-pill__label">Total Views</span>
                <span className="aap-kpi-pill__val aap-kpi-pill__val--white">{data.kpis.totalViews.toLocaleString()}</span>
              </div>
              <div className="aap-kpi-pill">
                <span className="aap-kpi-pill__label">Avg. Completion</span>
                <span className="aap-kpi-pill__val">{data.kpis.avgCompletion}%</span>
                <span className="aap-kpi-pill__sub">across all courses</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="aap-body">
        {!selectedDoctor ? (
          <div className="aap-empty">
            <div className="aap-empty__emoji">📊</div>
            <p className="aap-empty__title">No instructor selected</p>
            <p className="aap-empty__sub">Use the search above to select an instructor and view their analytics.</p>
          </div>
        ) : (
          <AnalyticsDashboard doctor={selectedDoctor} />
        )}
      </div>
    </div>
  )
}

export default AdminAnalyticsPage