const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ✅ CommonJS


router.post('/login-admins', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const result = await query(
            "SELECT id, name, email, password_hash, role, status, avatar_url FROM administrators WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (admin.role !== "Admin") {
            return res.status(403).json({ error: "Access denied. Only admins can log in." });
        }

        const token = jwt.sign(
            { id: admin.id, role: admin.role, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                status: admin.status,
                avatar_url: admin.avatar_url
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/user-fetch', async (req, res) => {
    try {
        const result = await query(
            "SELECT name, role, avatar_url FROM administrators"
        );

        res.status(200).json({
            success: true,
            users: result.rows
        });
    } catch (err) {
        console.error("Error fetching administrators:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


router.put('/settings/account', async (req, res) => {
    try {
        const { id, email, password } = req.body;
        
        // In a real app, user ID should come from session/auth token
        const userId = id || 1;

        let sql, params;

        if (password) {
            // Update both email and password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            sql = `UPDATE users SET email = $1, password_hash = $2 WHERE id = $3`;
            params = [email, passwordHash, userId];
        } else {
            // Update only email
            sql = `UPDATE users SET email = $1 WHERE id = $2`;
            params = [email, userId];
        }

        await query(sql, params);
        res.json({ success: true, message: 'Account settings updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;