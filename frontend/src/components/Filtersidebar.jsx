// src/components/FilterSidebar.jsx
import React from 'react'
import { SEMESTERS, MAJORS } from '../assets/data/courses'
import './Filtersidebar.css'

const FilterSidebar = ({ semester, major, onSemesterChange, onMajorChange }) => {
  return (
    <aside className="filter-sidebar">

      {/* Semester */}
      <p className="filter-sidebar__title">
        Semester
      </p>
      <ul className="filter-sidebar__list filter-sidebar__list--spaced">
        <li>
          <button onClick={() => onSemesterChange(null)} className={`filter-sidebar__btn ${semester === null ? 'filter-sidebar__btn--active' : ''}`}>
            All Semesters
          </button>
        </li>
        {SEMESTERS.map(s => (
          <li key={s}>
            <button onClick={() => onSemesterChange(s)} className={`filter-sidebar__btn ${semester === s ? 'filter-sidebar__btn--active' : ''}`}>
              Semester {s}
            </button>
          </li>
        ))}
      </ul>

      {/* Major */}
      <p className="filter-sidebar__title">
        Major
      </p>
      <ul className="filter-sidebar__list">
        {MAJORS.map(m => (
          <li key={m}>
            <button onClick={() => onMajorChange(m)} className={`filter-sidebar__btn ${major === m ? 'filter-sidebar__btn--active' : ''}`}>
              {m === 'All' ? 'All Majors' : `${m} Eng.`}
            </button>
          </li>
        ))}
      </ul>

    </aside>
  )
}

export default FilterSidebar