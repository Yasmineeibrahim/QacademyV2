// src/components/FilterSidebar.jsx
import React from 'react'
import { SEMESTERS, MAJORS } from '../assets/data/courses'

const FilterSidebar = ({ semester, major, onSemesterChange, onMajorChange }) => {
  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: '#fff', borderRadius: '12px',
      border: '1px solid rgba(4,42,78,0.09)',
      boxShadow: '0 4px 20px rgba(4,42,78,0.07)',
      padding: '24px 20px',
      position: 'sticky', top: '88px',
    }}>

      {/* Semester */}
      <p style={{
        fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: '#042a4e', marginBottom: '12px',
      }}>
        Semester
      </p>
      <ul style={{
        listStyle: 'none', display: 'flex',
        flexDirection: 'column', gap: '6px', marginBottom: '28px',
      }}>
        <li>
          <button onClick={() => onSemesterChange(null)} style={sideBtn(semester === null)}>
            All Semesters
          </button>
        </li>
        {SEMESTERS.map(s => (
          <li key={s}>
            <button onClick={() => onSemesterChange(s)} style={sideBtn(semester === s)}>
              Semester {s}
            </button>
          </li>
        ))}
      </ul>

      {/* Major */}
      <p style={{
        fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: '#042a4e', marginBottom: '12px',
      }}>
        Major
      </p>
      <ul style={{
        listStyle: 'none', display: 'flex',
        flexDirection: 'column', gap: '6px',
      }}>
        {MAJORS.map(m => (
          <li key={m}>
            <button onClick={() => onMajorChange(m)} style={sideBtn(major === m)}>
              {m === 'All' ? 'All Majors' : `${m} Eng.`}
            </button>
          </li>
        ))}
      </ul>

    </aside>
  )
}

const sideBtn = (active) => ({
  width: '100%', textAlign: 'left',
  padding: '8px 12px', borderRadius: '7px', border: 'none',
  fontSize: '13px', fontWeight: active ? 700 : 500,
  fontFamily: 'inherit', cursor: 'pointer',
  background: active ? '#042a4e' : 'transparent',
  color: active ? '#fff613' : 'rgba(4,42,78,0.7)',
  transition: 'background 0.18s, color 0.18s',
})

export default FilterSidebar