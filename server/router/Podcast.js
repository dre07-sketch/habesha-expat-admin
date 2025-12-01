const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');



router.delete('/podcasts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM podcasts WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Podcast episode deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Podcast Visibility
router.put('/podcasts/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await query(
            `UPDATE podcasts SET status = $1 WHERE id = $2`,
            [status, id]
        );

        res.json({ success: true, message: `Podcast status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;