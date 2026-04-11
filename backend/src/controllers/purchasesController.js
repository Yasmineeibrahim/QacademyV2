import db from "../config/db.js";

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const formatDuration = (duration) => {
  if (typeof duration !== "number") {
    return duration;
  }

  return `${Math.floor(duration / 60)}h ${duration % 60}m`;
};

const validatePurchaseIds = (res, studentId, itemId, itemLabel) => {
  if (!isPositiveInteger(studentId) || !isPositiveInteger(itemId)) {
    res.status(400).json({ message: `Invalid student id or ${itemLabel} id` });
    return false;
  }

  return true;
};

export const createEnrollment = async (req, res) => {
  try {
    const studentId = Number(req.body.student_id);
    const courseId = Number(req.body.course_id);

    if (!validatePurchaseIds(res, studentId, courseId, "course")) {
      return;
    }

    const [existingRows] = await db.promise().query(
      `
        SELECT id, student_id, course_id, purchased_at
        FROM enrollments
        WHERE student_id = ? AND course_id = ?
        LIMIT 1
      `,
      [studentId, courseId]
    );

    if (existingRows.length > 0) {
      return res.status(200).json({
        message: "Enrollment already exists",
        enrollment: existingRows[0],
      });
    }

    const [result] = await db.promise().query(
      `
        INSERT INTO enrollments (student_id, course_id, purchased_at)
        VALUES (?, ?, NOW())
      `,
      [studentId, courseId]
    );

    return res.status(201).json({
      message: "Enrollment created",
      enrollment: {
        id: result.insertId,
        student_id: studentId,
        course_id: courseId,
      },
    });
  } catch (err) {
    console.error("createEnrollment DB error:", err);
    return res.status(500).json({ message: "Failed to create enrollment" });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    if (!isPositiveInteger(studentId)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const [rows] = await db.promise().query(
      `
        SELECT
          e.id,
          e.student_id,
          e.course_id,
          e.purchased_at,
          c.category,
          c.title,
          c.semester,
          c.videos_count AS lessons,
          CONCAT(
            FLOOR(c.total_duration_minutes / 60), 'h ',
            MOD(c.total_duration_minutes, 60), 'm'
          ) AS duration,
          CONCAT('$', c.price) AS price,
          c.thumbnail_url,
          c.major,
          CONCAT(a.first_name, ' ', a.last_name) AS instructor
        FROM enrollments e
        INNER JOIN courses c ON c.id = e.course_id
        LEFT JOIN accounts a ON a.id = c.educator_id
        WHERE e.student_id = ?
        ORDER BY e.purchased_at DESC, e.id DESC
      `,
      [studentId]
    );

    return res.json(
      rows.map((row) => ({
        ...row,
        duration: formatDuration(row.duration),
      }))
    );
  } catch (err) {
    console.error("getStudentEnrollments DB error:", err);
    return res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

export const createVideoPurchase = async (req, res) => {
  try {
    const studentId = Number(req.body.student_id);
    const videoId = Number(req.body.video_id);

    if (!validatePurchaseIds(res, studentId, videoId, "video")) {
      return;
    }

    const [existingRows] = await db.promise().query(
      `
        SELECT id, student_id, video_id, purchased_at
        FROM video_purchases
        WHERE student_id = ? AND video_id = ?
        LIMIT 1
      `,
      [studentId, videoId]
    );

    if (existingRows.length > 0) {
      return res.status(200).json({
        message: "Video purchase already exists",
        videoPurchase: existingRows[0],
      });
    }

    const [result] = await db.promise().query(
      `
        INSERT INTO video_purchases (student_id, video_id, purchased_at)
        VALUES (?, ?, NOW())
      `,
      [studentId, videoId]
    );

    return res.status(201).json({
      message: "Video purchase created",
      videoPurchase: {
        id: result.insertId,
        student_id: studentId,
        video_id: videoId,
      },
    });
  } catch (err) {
    console.error("createVideoPurchase DB error:", err);
    return res.status(500).json({ message: "Failed to create video purchase" });
  }
};

export const getStudentVideoPurchases = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    if (!isPositiveInteger(studentId)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const [rows] = await db.promise().query(
      `
        SELECT
          vp.id,
          vp.student_id,
          vp.video_id,
          vp.purchased_at,
          v.title AS video_title,
          v.description AS video_description,
          v.duration AS raw_duration,
          CONCAT('$', v.price) AS video_price,
          v.order_index,
          c.id AS course_id,
          c.title AS course_title,
          c.category,
          c.semester,
          c.thumbnail_url,
          CONCAT(a.first_name, ' ', a.last_name) AS instructor
        FROM video_purchases vp
        INNER JOIN videos v ON v.id = vp.video_id
        INNER JOIN courses c ON c.id = v.course_id
        LEFT JOIN accounts a ON a.id = c.educator_id
        WHERE vp.student_id = ?
        ORDER BY vp.purchased_at DESC, vp.id DESC
      `,
      [studentId]
    );

    return res.json(
      rows.map((row) => ({
        ...row,
        duration: formatDuration(row.raw_duration),
      }))
    );
  } catch (err) {
    console.error("getStudentVideoPurchases DB error:", err);
    return res.status(500).json({ message: "Failed to fetch video purchases" });
  }
};

export const getStudentPurchases = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    if (!isPositiveInteger(studentId)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const [enrollments, videoPurchases] = await Promise.all([
      db.promise().query(
        `
          SELECT
            e.id,
            e.student_id,
            e.course_id,
            e.purchased_at,
            c.category,
            c.title,
            c.semester,
            c.videos_count AS lessons,
            CONCAT(
              FLOOR(c.total_duration_minutes / 60), 'h ',
              MOD(c.total_duration_minutes, 60), 'm'
            ) AS duration,
            CONCAT('$', c.price) AS price,
            c.thumbnail_url,
            c.major,
            CONCAT(a.first_name, ' ', a.last_name) AS instructor
          FROM enrollments e
          INNER JOIN courses c ON c.id = e.course_id
          LEFT JOIN accounts a ON a.id = c.educator_id
          WHERE e.student_id = ?
          ORDER BY e.purchased_at DESC, e.id DESC
        `,
        [studentId]
      ),
      db.promise().query(
        `
          SELECT
            vp.id,
            vp.student_id,
            vp.video_id,
            vp.purchased_at,
            v.title AS video_title,
            v.description AS video_description,
            v.duration AS raw_duration,
            CONCAT('$', v.price) AS video_price,
            v.order_index,
            c.id AS course_id,
            c.title AS course_title,
            c.category,
            c.semester,
            c.thumbnail_url,
            CONCAT(a.first_name, ' ', a.last_name) AS instructor
          FROM video_purchases vp
          INNER JOIN videos v ON v.id = vp.video_id
          INNER JOIN courses c ON c.id = v.course_id
          LEFT JOIN accounts a ON a.id = c.educator_id
          WHERE vp.student_id = ?
          ORDER BY vp.purchased_at DESC, vp.id DESC
        `,
        [studentId]
      ),
    ]);

    const enrollmentRows = enrollments[0].map((row) => ({
      ...row,
      duration: formatDuration(row.duration),
    }));

    const videoPurchaseRows = videoPurchases[0].map((row) => ({
      ...row,
      duration: formatDuration(row.raw_duration),
    }));

    return res.json({
      studentId,
      enrollments: enrollmentRows,
      videoPurchases: videoPurchaseRows,
      summary: {
        totalEnrollments: enrollmentRows.length,
        totalVideoPurchases: videoPurchaseRows.length,
      },
    });
  } catch (err) {
    console.error("getStudentPurchases DB error:", err);
    return res.status(500).json({ message: "Failed to fetch student purchases" });
  }
};