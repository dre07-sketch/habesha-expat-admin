const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');




router.delete('/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM videos WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Video Visibility
router.put('/videos/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'visible' or 'hidden'

        await query(
            `UPDATE videos SET status = $1 WHERE id = $2`,
            [status, id]
        );

        res.json({ success: true, message: `Video status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;