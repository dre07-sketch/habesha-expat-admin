const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, DB_TYPE } = require('../connection/db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/'); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); 
    }
});
const upload = multer({ storage: storage });

// THE ROUTE
router.post('/events-post', upload.single('image'), async (req, res) => {
    try {
        const { title, date, time, location, attendees, price, organizer, description } = req.body;
        
        // Handle image logic
        const image_url = req.file ? req.file.filename : null;

        const sql = `
            INSERT INTO events 
                (title, date, time, location, attendees_count, price, organizer, description, image_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'visible')
            RETURNING id
        `;

        // 2. USE YOUR CUSTOM QUERY FUNCTION
        // Do NOT use pool.query here. Use query() which you imported.
        const result = await query(sql, [
            title,
            date,
            time,
            location,
            attendees || 0,
            price,
            organizer,
            description,
            image_url
        ]);

        // 3. SEND RESPONSE
        // Your db.js returns { rows: [...], insertId: ... }
        res.status(201).json({
            success: true,
            message: 'Event created',
            id: result.insertId // Using the helper property from your db.js
        });

    } catch (err) {
        
    }
});


router.get('/events-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, title, date, time, location, 
            attendees_count as attendees, price, organizer, description, 
            image_url as image, status 
            FROM events 
            ORDER BY date ASC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Event
router.delete('/events-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM events WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Event Visibility (Hide/Visible)
router.put('/events/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'visible' or 'hidden'

        // Optional: validate status
        if (!['visible', 'hidden'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        await query(`UPDATE events SET status = $1 WHERE id = $2`, [status, id]);
        res.json({ success: true, message: `Event is now ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;