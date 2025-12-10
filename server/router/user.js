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

module.exports = router;
