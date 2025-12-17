const express = require("express");
const router = express.Router();
const { query, DB_TYPE } = require("../connection/db");

// GET /users/roles
router.get("/users-roles", async (req, res) => {
  try {
    const allowedRoles = ['Premium', 'User', 'Author'];

    const sql = `
      SELECT 
        id,
        name,
        email,
        role,
        status,
        location,
        avatar_url,
        created_at,
        updated_at
      FROM users
      WHERE role = ANY($1)
      ORDER BY created_at DESC
    `;

    const result = await query(sql, [allowedRoles]);

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });

  } catch (error) {
    console.error("❌ Error fetching users by role:", error);
    res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message
    });
  }
});


router.put("/toggle-status/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get current status
    const userResult = await query(
      "SELECT status FROM users WHERE id = $1",
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentStatus = userResult.rows[0].status;
    const newStatus = currentStatus === "Active" ? "Banned" : "Active";

    // 2. Update status
    await query(
      `
      UPDATE users
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [newStatus, id]
    );

    res.status(200).json({
      success: true,
      message: `User status updated to ${newStatus}`,
      status: newStatus,
    });

  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
