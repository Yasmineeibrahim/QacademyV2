import db from "../config/db.js";
import bcrypt from "bcrypt";
import { selectAccountFields } from "./accountQueryHelpers.js";

export const createAccount = async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  if (!first_name || !last_name || !email || !password || !phone_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO accounts (first_name, last_name, email, password, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [first_name, last_name, email, hashedPassword, phone_number],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }

          console.error("createAccount DB error:", err);
          return res.status(500).json({ message: "Failed to create account" });
        }

        return res.json({ message: "Account created" });
      }
    );
  } catch (err) {
    console.error("createAccount hash error:", err);
    return res.status(500).json({ message: "Failed to process password" });
  }
};

export const getAllAccounts = (req, res) => {
  const sql = `
    SELECT ${selectAccountFields}
    FROM accounts
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
};

export const getAccountById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT ${selectAccountFields}
    FROM accounts
    WHERE id = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.length) return res.status(404).json({ message: "Account not found" });
    return res.json(result[0]);
  });
};
