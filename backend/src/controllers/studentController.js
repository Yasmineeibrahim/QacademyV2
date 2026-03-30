import db from "../config/db.js";


export const createStudent = (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  const sql = `
    INSERT INTO students (first_name, last_name, email, password, phone_number)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [first_name, last_name, email, password, phone_number], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Student added ✅" });
  });
};



export const getStudents = (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};