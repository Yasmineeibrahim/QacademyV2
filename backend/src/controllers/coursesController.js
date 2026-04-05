import db from "../config/db.js";


const normalizeCourse = (course, index) => ({
  ...course,
  initials:
    course.initials ||
    (course.instructor
      ? course.instructor
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase()
      : ""),
  color: course.color || (index % 2 === 0 ? "#042a4e" : "#1a4a7a"),
});


export const getAllCourses = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
      SELECT 
        c.id,
        c.category,
        c.title,
        c.semester,
        c.videos_count AS lessons,
        CONCAT(
          FLOOR(c.total_duration_minutes / 60), 'h ',
          MOD(c.total_duration_minutes, 60), 'm'
        ) AS duration,
        CONCAT('$', c.price) AS price,
        c.major,
        c.thumbnail_url,
        CONCAT(a.first_name, ' ', a.last_name) AS instructor
      FROM courses c
      LEFT JOIN accounts a ON a.id = c.educator_id
      ORDER BY c.id ASC
    `)

        res.json(rows.map(normalizeCourse))
    } catch (err) {
        console.error('getAllCourses DB error:', err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params

    const [courseRows] = await db.promise().query(`
      SELECT 
        c.id,
        c.category,
        c.title,
        c.semester,
        c.videos_count AS lessons,
        CONCAT(
          FLOOR(c.total_duration_minutes / 60), 'h ',
          MOD(c.total_duration_minutes, 60), 'm'
        ) AS duration,
        CONCAT('$', c.price) AS price,
        c.major,
        c.thumbnail_url,
        CONCAT(a.first_name, ' ', a.last_name) AS instructor
      FROM courses c
      LEFT JOIN accounts a ON c.educator_id = a.id
      WHERE c.id = ?
      LIMIT 1
    `, [id])

    if (courseRows.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    const course = normalizeCourse(courseRows[0], 0)

    let videos = []

    try {
      const [videoRows] = await db.promise().query(`
        SELECT 
          id,
          title,
          description,
          duration,
          price,
          order_index
        FROM videos
        WHERE course_id = ?
        ORDER BY order_index
      `, [id])
      videos = videoRows
    } catch (videoErr) {
      if (videoErr.code !== 'ER_NO_SUCH_TABLE') {
        throw videoErr
      }
    }

    const formattedVideos = videos.map(v => ({
      ...v,
      duration:
        typeof v.duration === 'number'
          ? `${Math.floor(v.duration / 60)}m ${v.duration % 60}s`
          : v.duration
    }))

    res.json({
      course,
      videos: formattedVideos
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch course details' })
  }
}