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
        const image_url = req.file ? `/upload/${req.file.filename}` : null;

        const sql = `
            INSERT INTO events 
                (title, date, time, location, attendees_count, price, organizer, description, image_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'visible')
            RETURNING id
        `;

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

        res.status(201).json({
            success: true,
            message: 'Event created',
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating event",
            error: err.message
        });
    }
});



router.get('/events-get', async (req, res) => {
    try {
        const baseURL = `${req.protocol}://${req.get("host")}`;

        const sql = `
            SELECT id, title, date, time, location, 
            attendees_count as attendees, price, organizer, description, 
            image_url as image, status 
            FROM events 
            ORDER BY date ASC
        `;
        const { rows } = await query(sql);

        const formatted = rows.map(event => {
            let finalImage = null;
            if (event.image) {
                // 1. Replace Windows backslashes (\) with forward slashes (/)
                // 2. Remove any double leading slashes just in case
                let cleanPath = event.image.replace(/\\/g, '/').replace(/^\/+/, '');

                // 3. Fix potential mismatch between 'uploads' (DB) and 'upload' (server folder)
                if (cleanPath.startsWith('uploads/')) {
                    cleanPath = cleanPath.replace('uploads/', 'upload/');
                } else if (!cleanPath.startsWith('upload/')) {
                    // If it doesn't have a folder prefix, assume it belongs in upload/
                    cleanPath = `upload/${cleanPath}`;
                }

                finalImage = `${baseURL}/${cleanPath}`;
            }
            return { ...event, image: finalImage };
        });

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const { logAction } = require('../utils/auditLogger');

// DELETE Event
router.delete('/events-delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM events WHERE id = $1`, [id]);

        await logAction(req, 'DELETE', 'EVENT', id, 'Deleted Event');

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

        await logAction(req, 'UPDATE', 'EVENT', id, `Updated Event status to ${status}`);

        res.json({ success: true, message: `Event is now ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;