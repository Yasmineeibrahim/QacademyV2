import db from "../config/db.js";
import bcrypt from "bcrypt";

export const loginAccount = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM accounts WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found " });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password " });
    }

    const normalizedRole = typeof user.role === "string"
      ? user.role.trim().toLowerCase()
      : null;

    return res.json({
      message: "Login successful ",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        role: normalizedRole
      }
    });
  });
};
