import db from "../config/db.js";
import bcrypt from "bcrypt";


export const createStudent = async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  if (!first_name || !last_name || !email || !password || !phone_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO students (first_name, last_name, email, password, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [first_name, last_name, email, hashedPassword, phone_number],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }

          console.error("createStudent DB error:", err);
          return res.status(500).json({ message: "Failed to create account" });
        }

        res.json({ message: "Student created" });
      }
    );
  } catch (err) {
    console.error("createStudent hash error:", err);
    res.status(500).json({ message: "Failed to process password" });
  }
};

export const getStudents = (req, res) => {
  const sql = `
    SELECT id, first_name, last_name, email, phone_number, created_at
    FROM students
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

export const getDbStatus = (req, res) => {
  db.query("SELECT DATABASE() AS databaseName", (dbErr, dbResult) => {
    if (dbErr) {
      return res.status(500).json({ message: "Failed to check active database" });
    }

    db.query("SELECT COUNT(*) AS studentsCount FROM students", (countErr, countResult) => {
      if (countErr) {
        return res.status(500).json({ message: "Failed to read students count" });
      }

      res.json({
        connected: true,
        database: dbResult[0]?.databaseName || null,
        studentsCount: countResult[0]?.studentsCount || 0
      });
    });
  });
};