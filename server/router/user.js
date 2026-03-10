const express = require("express");
const router = express.Router();
const { query } = require("../connection/db");
const { logAction } = require('../utils/auditLogger');

// ─────────────────────────────────────────────
// GET /api/users/users-roles
// Fetch all users with their role and status
// ─────────────────────────────────────────────
router.get("/users-roles", async (req, res) => {
  try {
    const sql = `
      SELECT
        id,
        TRIM(first_name || ' ' || COALESCE(last_name, '')) AS name,
        first_name,
        last_name,
        email,
        role,
        status,
        location,
        avatar_url,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    const result = await query(sql);
    res.json({ success: true, message: "Users fetched successfully", data: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Database error", error: error.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/users/toggle-status/:id
// Ban or activate a user account
// ─────────────────────────────────────────────
router.put("/toggle-status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await query("SELECT status FROM users WHERE id = $1", [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentStatus = userResult.rows[0].status;
    const newStatus = currentStatus === "Active" ? "Banned" : "Active";

    await query(
      "UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [newStatus, id]
    );

    await logAction(req, 'UPDATE', 'USER', id, `Changed user status to ${newStatus}`);

    res.status(200).json({
      success: true,
      message: `User status updated to ${newStatus}`,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
