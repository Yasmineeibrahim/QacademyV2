import React, { useState } from 'react'
import './AdminControlPage.css'

/* ── Mock data ── */
const recentUsers = [
  { name:'Emma Wilson',    role:'Student',  joined:'Apr 1, 2025',  status:'active',  avatar:'EW' },
  { name:'Sarah Mitchell', role:'Educator', joined:'Mar 30, 2025', status:'active',  avatar:'SM' },
  { name:'Carlos Mendez',  role:'Student',  joined:'Mar 29, 2025', status:'active',  avatar:'CM' },
  { name:'Jake Brennan',   role:'Student',  joined:'Mar 28, 2025', status:'pending', avatar:'JB' },
  { name:'Priya Sharma',   role:'Educator', joined:'Mar 27, 2025', status:'active',  avatar:'PS' },
  { name:'Nour Hassan',    role:'Student',  joined:'Mar 26, 2025', status:'banned',  avatar:'NH' },
]

const recentCourses = [
  { title:'React: The Complete Guide',     educator:'Sarah Mitchell', students:1243, status:'published', revenue: 18640 },
  { title:'UI/UX Design Fundamentals',     educator:'Marco Rossi',    students:2105, status:'published', revenue: 31575 },
  { title:'JavaScript Patterns',           educator:'James O\'Brien', students:0,    status:'review',    revenue: 0     },
  { title:'Node.js & Express Backend',     educator:'Priya Sharma',   students:876,  status:'published', revenue: 10512 },
]

const alerts = [
  { type:'warning', msg:'3 courses pending review', icon:'⚠️' },
  { type:'info',    msg:'Platform revenue up 18% this month', icon:'📈' },
  { type:'error',   msg:'1 user flagged for policy violation', icon:'🚨' },
  { type:'success', msg:'New educator application received', icon:'✅' },
]

const platformStats = [
  { label:'Total Users',   value:'7,556',  icon:'👥', color:'#0ea5e9', delta:'+12%', up:true  },
  { label:'Total Courses', value:'12',     icon:'📚', color:'#8b5cf6', delta:'+3',   up:true  },
  { label:'Revenue',       value:'$108K',  icon:'💰', color:'#10b981', delta:'+18%', up:true  },
  { label:'Educators',     value:'24',     icon:'🎓', color:'#f59e0b', delta:'+2',   up:true  },
]

const statusCfg = {
  active:    { label:'Active',    cls:'badge--green' },
  pending:   { label:'Pending',   cls:'badge--amber' },
  banned:    { label:'Banned',    cls:'badge--rose'  },
  published: { label:'Published', cls:'badge--green' },
  review:    { label:'In Review', cls:'badge--amber' },
  archived:  { label:'Archived',  cls:'badge--rose'  },
}

const AdminControlPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userSearch, setUserSearch] = useState('')

  const filteredUsers = recentUsers
    .filter(u => userRoleFilter === 'all' || u.role.toLowerCase() === userRoleFilter)
    .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()))

  return (
    <main className="page control-page">
      {/* ── Page title ── */}
      <div className="control-header">
        <div>
          <h1 className="control-title">⚙️ Control Nexus</h1>
          <p className="control-sub">Platform administration dashboard — full oversight and control.</p>
        </div>
        <div className="control-nav">
          {[
            ['dashboard','🏠 Dashboard'],
            ['users','👥 Users'],
            ['courses','📚 Courses'],
            ['settings','⚙️ Settings'],
          ].map(([key, lbl]) => (
            <button key={key} className={`control-nav-btn${activeSection===key?' control-nav-btn--active':''}`} onClick={() => setActiveSection(key)}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* ── DASHBOARD VIEW ── */}
      {activeSection === 'dashboard' && (<>
        {/* Alerts */}
        <div className="alerts-row">
          {alerts.map((a, i) => (
            <div key={i} className={`alert-chip alert-chip--${a.type}`}>
              <span>{a.icon}</span> {a.msg}
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {platformStats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-card__icon" style={{ background: s.color + '18' }}><span>{s.icon}</span></div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
              <div className={`stat-card__delta stat-card__delta--${s.up?'up':'down'}`}>{s.up?'▲':'▼'} {s.delta} this month</div>
            </div>
          ))}
        </div>

        {/* Recent users + Recent courses */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-inner">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <h2 className="sec-title" style={{ marginBottom:0 }}>👥 Recent Users</h2>
                <button className="btn btn--ghost" style={{ padding:'5px 12px', fontSize:'.78rem' }} onClick={() => setActiveSection('users')}>View All →</button>
              </div>
              {recentUsers.slice(0,5).map(u => (
                <div key={u.name} className="user-row">
                  <div className="avatar" style={{ width:36, height:36, fontSize:'.8rem', flexShrink:0 }}>{u.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text)' }}>{u.name}</div>
                    <div style={{ fontSize:'.76rem', color:'var(--text-soft)' }}>{u.role} · {u.joined}</div>
                  </div>
                  <span className={`badge ${statusCfg[u.status].cls}`}>{statusCfg[u.status].label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <h2 className="sec-title" style={{ marginBottom:0 }}>📚 Recent Courses</h2>
                <button className="btn btn--ghost" style={{ padding:'5px 12px', fontSize:'.78rem' }} onClick={() => setActiveSection('courses')}>View All →</button>
              </div>
              {recentCourses.map(c => (
                <div key={c.title} className="course-row">
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text)', marginBottom:2 }}>{c.title}</div>
                    <div style={{ fontSize:'.76rem', color:'var(--text-soft)' }}>👤 {c.educator} · 👥 {c.students} students</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                    <span className={`badge ${statusCfg[c.status].cls}`}>{statusCfg[c.status].label}</span>
                    <span style={{ fontSize:'.76rem', color:'var(--green)', fontWeight:700 }}>${c.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <div className="card-inner">
            <h2 className="sec-title">⚡ Quick Actions</h2>
            <div className="quick-actions-grid">
              {[
                { icon:'👤', label:'Add User',          color:'#0ea5e9' },
                { icon:'📚', label:'Review Courses',    color:'#8b5cf6' },
                { icon:'💰', label:'Export Revenue',    color:'#10b981' },
                { icon:'📧', label:'Send Announcement', color:'#f59e0b' },
                { icon:'🛡️', label:'Security Audit',    color:'#f43f5e' },
                { icon:'⚙️', label:'Site Settings',     color:'#64748b' },
              ].map(a => (
                <button key={a.label} className="quick-action-btn">
                  <div className="quick-action-icon" style={{ background: a.color + '18', color: a.color }}>{a.icon}</div>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>)}

      {/* ── USERS VIEW ── */}
      {activeSection === 'users' && (<>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', fontWeight:700, color:'var(--navy)' }}>All Users</h2>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
            <div className="courses-search-wrap">
              <span className="courses-search-icon">🔍</span>
              <input className="courses-search" placeholder="Search users…" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width:'auto' }} value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="educator">Educators</option>
            </select>
            <button className="btn btn--primary" style={{ padding:'8px 16px', fontSize:'.82rem' }}>＋ Add User</button>
          </div>
        </div>
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.name}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ width:34, height:34, fontSize:'.78rem' }}>{u.avatar}</div>
                      <span style={{ fontWeight:600, fontSize:'.88rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${u.role==='Educator'?'badge--purple':'badge--blue'}`}>{u.role}</span></td>
                  <td style={{ fontSize:'.82rem', color:'var(--text-soft)' }}>{u.joined}</td>
                  <td><span className={`badge ${statusCfg[u.status].cls}`}>{statusCfg[u.status].label}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn--ghost" style={{ padding:'4px 10px', fontSize:'.76rem' }}>✏️ Edit</button>
                      <button className="btn" style={{ padding:'4px 10px', fontSize:'.76rem', background:'#fff1f2', color:'var(--rose)', border:'1.5px solid #fecdd3' }}>🚫 Ban</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}

      {/* ── COURSES VIEW ── */}
      {activeSection === 'courses' && (<>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', fontWeight:700, color:'var(--navy)' }}>All Courses</h2>
        </div>
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>Course</th><th>Educator</th><th>Students</th><th>Revenue</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {recentCourses.map(c => (
                <tr key={c.title}>
                  <td style={{ fontWeight:600, fontSize:'.88rem' }}>{c.title}</td>
                  <td style={{ fontSize:'.85rem', color:'var(--text-soft)' }}>{c.educator}</td>
                  <td style={{ fontWeight:700 }}>{c.students.toLocaleString()}</td>
                  <td style={{ fontWeight:700, color:'var(--green)' }}>${c.revenue.toLocaleString()}</td>
                  <td><span className={`badge ${statusCfg[c.status].cls}`}>{statusCfg[c.status].label}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      {c.status === 'review' && <button className="btn btn--primary" style={{ padding:'4px 10px', fontSize:'.76rem' }}>✅ Approve</button>}
                      <button className="btn btn--ghost" style={{ padding:'4px 10px', fontSize:'.76rem' }}>👁 View</button>
                      <button className="btn" style={{ padding:'4px 10px', fontSize:'.76rem', background:'#fff1f2', color:'var(--rose)', border:'1.5px solid #fecdd3' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}

      {/* ── SETTINGS VIEW ── */}
      {activeSection === 'settings' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">🌐 Platform Settings</h2>
              <div className="form-group">
                <label className="form-label">Platform Name</label>
                <input className="form-input" defaultValue="EduPlatform" />
              </div>
              <div className="form-group">
                <label className="form-label">Support Email</label>
                <input className="form-input" defaultValue="support@eduplatform.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Default Language</label>
                <select className="form-select"><option>English</option><option>Arabic</option></select>
              </div>
              <button className="btn btn--primary" style={{ width:'100%', justifyContent:'center' }}>💾 Save Settings</button>
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <h2 className="sec-title">💳 Payment Settings</h2>
              <div className="form-group">
                <label className="form-label">Educator Revenue Share</label>
                <input className="form-input" defaultValue="70%" />
              </div>
              <div className="form-group">
                <label className="form-label">Platform Fee</label>
                <input className="form-input" defaultValue="30%" />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select className="form-select"><option>USD</option><option>EUR</option><option>EGP</option></select>
              </div>
              <button className="btn btn--primary" style={{ width:'100%', justifyContent:'center' }}>💾 Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminControlPage