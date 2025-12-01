const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');
const bcrypt = require('bcrypt');

router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role, location } = req.body;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const sql = `
            INSERT INTO users (name, email, password_hash, role, location)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

        const result = await query(sql, [name, email, passwordHash, role, location]);

        res.status(201).json({ success: true, message: 'User created', id: result.insertId });
    } catch (err) {
        console.error(err);
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