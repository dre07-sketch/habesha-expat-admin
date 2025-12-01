const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

router.get('/subscribers-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, email, name, status, source, plan, 
            joined_date as joinedDate 
            FROM subscribers 
            ORDER BY joined_date DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;