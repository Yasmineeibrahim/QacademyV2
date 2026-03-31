import db from "../config/db.js";
import { selectAccountFields } from "./accountQueryHelpers.js";

const getAccountsByRole = (role, res) => {
  const sql = `
    SELECT ${selectAccountFields}
    FROM accounts
    WHERE LOWER(role) = LOWER(?)
    ORDER BY created_at DESC
  `;

  db.query(sql, [role], (err, rows) => {
    if (err) return res.status(500).json(err);
    return res.json(rows);
  });
};

export const getEducators = (req, res) => {
  getAccountsByRole("educator", res);
};

export const getAdmins = (req, res) => {
  getAccountsByRole("admin", res);
};
