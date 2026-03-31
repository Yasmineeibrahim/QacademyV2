import db from "../config/db.js";

export const getDbStatus = (req, res) => {
  db.query("SELECT DATABASE() AS databaseName", (dbErr, dbResult) => {
    if (dbErr) {
      return res.status(500).json({ message: "Failed to check active database" });
    }

    db.query("SELECT COUNT(*) AS accountsCount FROM accounts", (countErr, countResult) => {
      if (countErr) {
        return res.status(500).json({ message: "Failed to read accounts count" });
      }

      return res.json({
        connected: true,
        database: dbResult[0]?.databaseName || null,
        accountsCount: countResult[0]?.accountsCount || 0
      });
    });
  });
};
