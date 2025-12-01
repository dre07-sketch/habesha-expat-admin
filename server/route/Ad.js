const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');


router.post('/ads-post', async (req, res) => {
    try {
        const { title, type, placement, url, durationValue, mediaFile } = req.body;

        const sql = `
            INSERT INTO ads 
                (title, type, placement, destination_url, duration_days, media_file_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, 'active')
            RETURNING id
        `;

        const result = await query(sql, [
            title,
            type,
            placement,
            url,
            durationValue,
            mediaFile
        ]);

        res.status(201).json({
            success: true,
            message: 'Ad campaign active',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


router.get('/ads-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, title, type, placement, 
            destination_url as url, duration_days as durationDays, 
            media_file_url as mediaFile, status 
            FROM ads 
            ORDER BY created_at DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Ad Campaign
router.delete('/ads/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM ads WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Ad campaign deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Ad Status (active/inactive)
router.put('/ads/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' or 'inactive'

        // Optional validation
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        await query(`UPDATE ads SET status = $1 WHERE id = $2`, [status, id]);
        res.json({ success: true, message: `Ad campaign is now ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;