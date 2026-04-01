export class StudentCourse {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.category = data.category
    this.instructor = data.instructor
    this.initials = data.initials
    this.lessons = data.lessons
    this.completedLessons = data.completedLessons
    this.duration = data.duration
    this.color = data.color
    this.semester = data.semester
    this.status = data.status
    this.lastAccessed = data.lastAccessed
  }

  getProgressPercent() {
    if (!this.lessons) return 0
    return Math.round((this.completedLessons / this.lessons) * 100)
  }

  getBannerClass() {
    return this.color === '#1a4a7a' ? 'scp-card__banner--blue' : 'scp-card__banner--dark'
  }

  getProgressFillClass() {
    const pct = this.getProgressPercent()
    if (pct >= 100) return 'scp-card__progress-fill--done'
    if (pct >= 60) return 'scp-card__progress-fill--high'
    if (pct >= 30) return 'scp-card__progress-fill--mid'
    return 'scp-card__progress-fill--low'
  }

  getStatusBadgeClass() {
    if (this.status === 'completed') return 'scp-card__status-badge--completed'
    if (this.status === 'paused') return 'scp-card__status-badge--paused'
    return 'scp-card__status-badge--active'
  }

  getStatusLabel() {
    if (this.status === 'completed') return 'Completed'
    if (this.status === 'paused') return 'Paused'
    return 'Active'
  }
}

export class StudentCoursesAnalytics {
  static filterByTab(courses, tab) {
    return courses.filter((course) => (tab === 'all' ? true : course.status === tab))
  }

  static sortCourses(courses, sortKey) {
    const items = [...courses]
    return items.sort((a, b) => {
      if (sortKey === 'progress') return b.getProgressPercent() - a.getProgressPercent()
      if (sortKey === 'title') return a.title.localeCompare(b.title)
      return 0
    })
  }

  static getHeaderStats(courses) {
    const totalCourses = courses.length
    const completedCourses = courses.filter((course) => course.status === 'completed').length
    const totalLessons = courses.reduce((sum, course) => sum + course.lessons, 0)
    const unlockedLessons = courses.reduce((sum, course) => sum + course.completedLessons, 0)
    const overallPct = totalLessons > 0 ? Math.round((unlockedLessons / totalLessons) * 100) : 0

    return {
      totalCourses,
      completedCourses,
      totalLessons,
      unlockedLessons,
      overallPct,
    }
  }

  static getTabCounts(courses) {
    return {
      all: courses.length,
      active: courses.filter((course) => course.status === 'active').length,
      completed: courses.filter((course) => course.status === 'completed').length,
      paused: courses.filter((course) => course.status === 'paused').length,
    }
  }
}

export class CourseVideo {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.duration = data.duration
    this.free = data.free
    this.students = data.students
  }

  getRelativeReach(maxStudents) {
    if (!maxStudents) return 0
    return Math.round((this.students / maxStudents) * 100)
  }
}

export class EducatorCourse {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.category = data.category
    this.color = data.color
    this.semester = data.semester
    this.lessons = data.lessons
    this.duration = data.duration
    this.students = data.students
    this.status = data.status
    this.videos = (data.videos || []).map((video) => new CourseVideo(video))
  }

  getStripeClass() {
    return this.color === '#1a4a7a' ? 'ecp-course-card__stripe--blue' : 'ecp-course-card__stripe--dark'
  }

  getCompletionRate() {
    if (!this.students || this.videos.length === 0) return 0
    const finalVideoStudents = this.videos[this.videos.length - 1].students
    return Math.round((finalVideoStudents / this.students) * 100)
  }

  getMaxVideoStudents() {
    return this.videos[0]?.students || 1
  }
}

export class EducatorCoursesAnalytics {
  static filterByTab(courses, tab) {
    return courses.filter((course) => (tab === 'all' ? true : course.status === tab))
  }

  static sortCourses(courses, sortKey) {
    const items = [...courses]
    return items.sort((a, b) => {
      if (sortKey === 'students') return b.students - a.students
      if (sortKey === 'semester') return a.semester - b.semester
      if (sortKey === 'title') return a.title.localeCompare(b.title)
      return 0
    })
  }

  static getAggregateStats(courses) {
    return {
      totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
      totalCourses: courses.length,
      activeCourses: courses.filter((course) => course.status === 'active').length,
      totalVideos: courses.reduce((sum, course) => sum + course.lessons, 0),
    }
  }

  static getTabCounts(courses) {
    return {
      all: courses.length,
      active: courses.filter((course) => course.status === 'active').length,
      draft: courses.filter((course) => course.status === 'draft').length,
    }
  }
}

export class EducatorVideoFactory {
  static createDefaultSet(courseStudents) {
    return [
      { id: 1, title: 'Introduction & Overview', duration: '12:30', free: true, students: courseStudents },
      { id: 2, title: 'Core Concepts Explained', duration: '18:45', free: false, students: Math.round(courseStudents * 0.82) },
      { id: 3, title: 'Hands-on Practice Session', duration: '24:10', free: false, students: Math.round(courseStudents * 0.74) },
      { id: 4, title: 'Deep Dive: Advanced Techniques', duration: '31:05', free: false, students: Math.round(courseStudents * 0.61) },
      { id: 5, title: 'Mid-Term Revision', duration: '22:50', free: false, students: Math.round(courseStudents * 0.55) },
      { id: 6, title: 'Common Pitfalls & How to Avoid', duration: '15:20', free: false, students: Math.round(courseStudents * 0.49) },
      { id: 7, title: 'Project Walkthrough', duration: '28:40', free: false, students: Math.round(courseStudents * 0.42) },
      { id: 8, title: 'Final Revision', duration: '10:15', free: false, students: Math.round(courseStudents * 0.38) },
    ]
  }
}
