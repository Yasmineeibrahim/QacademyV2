import db from "../config/db.js";
import bcrypt from "bcrypt";

const PASSWORD_POLICY_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

export const changePassword = (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  if (!id || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "id, currentPassword and newPassword are required" });
  }

  if (!PASSWORD_POLICY_REGEX.test(newPassword)) {
    return res.status(400).json({
      message: "New password must be at least 6 characters and include one uppercase letter, one number, and one symbol",
    });
  }

  const getUserSql = "SELECT id, password FROM accounts WHERE id = ? LIMIT 1";

  db.query(getUserSql, [id], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!result.length) return res.status(404).json({ message: "User not found" });

    try {
      const user = result[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = "UPDATE accounts SET password = ? WHERE id = ?";

      db.query(updateSql, [hashedNewPassword, id], (updateErr) => {
        if (updateErr) return res.status(500).json({ message: "Failed to update password" });

        return res.json({ message: "Password updated successfully" });
      });
    } catch (_e) {
      return res.status(500).json({ message: "Failed to process password update" });
    }
  });
};
