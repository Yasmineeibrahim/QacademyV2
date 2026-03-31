// src/pages/CoursesPage.jsx
import React, { useState } from 'react'
import { courses }   from '../../assets/data/courses'
import CourseCard    from '../../components/Coursecard'
import PageHeader    from '../../components/Pageheader'
import SearchBar     from '../../components/Searchbar'
import FilterSidebar from '../../components/Filtersidebar'
import './coursesPage.css'

const CoursesPage = () => {
  const [searchVal, setSearchVal] = useState('')
  const [semester, setSemester]   = useState(null)
  const [major, setMajor]         = useState('All')

  const filtered = courses.filter(c => {
    const matchSearch   = c.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchVal.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchVal.toLowerCase())
    const matchSemester = semester === null || c.semester === semester
    const matchMajor    = major === 'All' || c.major === 'All' || c.major === major
    return matchSearch && matchSemester && matchMajor
  })

  return (
    <div className="courses-page">

      <PageHeader
        tag="All Courses"
        title="Browse Every Course"
        subtitle={`${courses.length} courses across all semesters & majors`}
      />

      <div className="container courses-page__layout">

        <FilterSidebar
          semester={semester}
          major={major}
          onSemesterChange={setSemester}
          onMajorChange={setMajor}
        />

        <main className="courses-page__main">

          <div className="courses-page__search">
            <SearchBar
              value={searchVal}
              onChange={setSearchVal}
              placeholder="Search courses, topics, instructors…"
            />
          </div>

          <p className="courses-page__results">
            Showing <strong className="courses-page__results-strong">{filtered.length}</strong> course{filtered.length !== 1 ? 's' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="courses-page__empty">
              <div className="courses-page__empty-emoji">📚</div>
              <p className="courses-page__empty-title">No courses match your filters.</p>
              <p className="courses-page__empty-sub">Try adjusting the semester, major, or search term.</p>
            </div>
          ) : (
            <div className="courses-page__grid">
              {filtered.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default CoursesPage