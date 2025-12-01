const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');



router.post('/newsletters-post', async (req, res) => {
    try {
        const { subject, subscribers, content, image } = req.body;

        const sql = `
            INSERT INTO newsletters 
                (subject, recipient_segment, content, image_url, status, sent_date)
            VALUES
                ($1, $2, $3, $4, 'Sent', NOW())
            RETURNING id
        `;

        const result = await query(sql, [subject, subscribers, content, image]);

        res.status(201).json({
            success: true,
            message: 'Newsletter queued',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});



router.get('/newsletters-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, subject, recipient_segment as segment, content, 
            image_url as image, status, sent_date as sentDate, 
            recipient_count as recipientCount, open_rate as openRate, 
            click_rate as clickRate 
            FROM newsletters 
            ORDER BY created_at DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;