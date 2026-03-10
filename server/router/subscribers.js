const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

router.get('/subscribers-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, email, 
            split_part(email, '@', 1) as name,
            CASE WHEN is_active THEN 'active' ELSE 'inactive' END as status,
            'Newsletter' as source,
            'Free' as plan,
            TO_CHAR(subscribed_at, 'DD Mon YYYY') as "joinedDate"
            FROM newsletter_signups 
            ORDER BY subscribed_at DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;