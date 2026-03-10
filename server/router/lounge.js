const express = require('express');
const router = express.Router();
const { query } = require('../connection/db');
const { logAction } = require('../utils/auditLogger');

// Get all lounge members
router.get('/members', async (req, res) => {
    try {
        const sql = `
            SELECT 
                lm.user_id, 
                u.first_name, 
                u.last_name, 
                u.email, 
                u.avatar_url,
                lm.status, 
                lm.is_online, 
                lm.joined_at, 
                lm.last_seen
            FROM lounge_members lm
            JOIN users u ON lm.user_id = u.id
            ORDER BY lm.joined_at DESC
        `;
        const { rows } = await query(sql);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error fetching lounge members:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update member status
router.put('/status/:userId', async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body; // 'Authorized' or 'Dismissed'

    if (!['Authorized', 'Dismissed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    try {
        const sql = `
            UPDATE lounge_members 
            SET status = $1 
            WHERE user_id = $2 
            RETURNING *
        `;
        const result = await query(sql, [status, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        await logAction(req, 'UPDATE', 'LOUNGE_MEMBER', userId, `Changed lounge status to ${status}`);

        res.json({ success: true, message: `Status updated to ${status}`, data: result.rows[0] });
    } catch (err) {
        console.error('Error updating lounge status:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
