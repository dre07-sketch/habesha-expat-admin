const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

router.post('/businesses-post', async (req, res) => {
    try {
        const { name, category, email, phone, address, mapPin, website, description, image } = req.body;

        const sql = `
            INSERT INTO businesses 
                (name, category, email, phone, address, map_pin, website_url, description, image_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
            RETURNING id
        `;

        const result = await query(sql, [name, category, email, phone, address, mapPin, website, description, image]);

        res.status(201).json({ 
            success: true, 
            message: 'Business listing submitted', 
            id: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


router.get('/businesses-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, name, category, email, phone, address, 
            map_pin as mapPin, website_url, description, image_url as image, 
            status, rating 
            FROM businesses 
            ORDER BY created_at DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/businesses/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const sql = `
            UPDATE businesses 
            SET status = $1 
            WHERE id = $2
        `;

        await query(sql, [status, id]);

        res.json({
            success: true,
            message: `Business ${status}`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;