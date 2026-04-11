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

export const getCoursesByEducatorId = async (req, res) => {
  try {
    const educatorId = Number(req.params.educatorId)

    if (!Number.isInteger(educatorId) || educatorId <= 0) {
      return res.status(400).json({ error: 'Invalid educator id' })
    }

    const [courseRows] = await db.promise().query(
      `
        SELECT
          c.id,
          c.educator_id,
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
        WHERE c.educator_id = ?
        ORDER BY c.id ASC
      `,
      [educatorId]
    )

    if (courseRows.length === 0) {
      return res.json([])
    }

    let videosByCourseId = {}

    try {
      const courseIds = courseRows.map((course) => course.id)
      const placeholders = courseIds.map(() => '?').join(', ')

      const [videoRows] = await db.promise().query(
        `
          SELECT
            id,
            course_id,
            title,
            description,
            duration,
            duration AS duration_seconds,
            price,
            video_url,
            order_index
          FROM videos
          WHERE course_id IN (${placeholders})
          ORDER BY course_id ASC, order_index ASC
        `,
        courseIds
      )

      videosByCourseId = videoRows.reduce((acc, video) => {
        const courseId = video.course_id
        const formattedVideo = {
          ...video,
          duration_seconds: video.duration_seconds,
          duration:
            typeof video.duration === 'number'
              ? `${Math.floor(video.duration / 60)}m ${video.duration % 60}s`
              : video.duration,
        }

        if (!acc[courseId]) {
          acc[courseId] = []
        }

        acc[courseId].push(formattedVideo)
        return acc
      }, {})
    } catch (videoErr) {
      if (videoErr.code !== 'ER_NO_SUCH_TABLE') {
        throw videoErr
      }
    }

    const payload = courseRows.map((course, index) => ({
      ...normalizeCourse(course, index),
      videos: videosByCourseId[course.id] || [],
    }))

    return res.json(payload)
  } catch (err) {
    console.error('getCoursesByEducatorId DB error:', err)
    return res.status(500).json({ error: 'Failed to fetch educator courses' })
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
          duration AS duration_seconds,
          price,
          video_url,
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
      duration_seconds: v.duration_seconds,
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