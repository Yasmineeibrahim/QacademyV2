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