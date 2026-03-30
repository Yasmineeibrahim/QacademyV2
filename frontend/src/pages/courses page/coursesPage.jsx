// src/pages/CoursesPage.jsx
import React, { useState } from 'react'
import { courses }   from '../../assets/data/courses'
import CourseCard    from '../../components/Coursecard'
import PageHeader    from '../../components/Pageheader'
import SearchBar     from '../../components/Searchbar'
import FilterSidebar from '../../components/Filtersidebar'

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
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: '#f7f9fb' }}>

      <PageHeader
        tag="All Courses"
        title="Browse Every Course"
        subtitle={`${courses.length} courses across all semesters & majors`}
      />

      <div className="container" style={{
        paddingTop: '40px', paddingBottom: '60px',
        display: 'flex', gap: '32px', alignItems: 'flex-start',
      }}>

        <FilterSidebar
          semester={semester}
          major={major}
          onSemesterChange={setSemester}
          onMajorChange={setMajor}
        />

        <main style={{ flex: 1, minWidth: 0 }}>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <SearchBar
              value={searchVal}
              onChange={setSearchVal}
              placeholder="Search courses, topics, instructors…"
            />
          </div>

          <p style={{ fontSize: '13px', color: 'rgba(4,42,78,0.45)', marginBottom: '20px', fontWeight: 500 }}>
            Showing <strong style={{ color: '#042a4e' }}>{filtered.length}</strong> course{filtered.length !== 1 ? 's' : ''}
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(4,42,78,0.4)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <p style={{ fontSize: '16px', fontWeight: 600 }}>No courses match your filters.</p>
              <p style={{ fontSize: '14px', marginTop: '6px' }}>Try adjusting the semester, major, or search term.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}>
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