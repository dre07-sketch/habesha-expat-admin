const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

router.put('/system-status/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;

        // Toggle the status: if activated → deactivated, else activated
        const sql = `
            UPDATE system_status
            SET status = CASE
                            WHEN status = 'activated' THEN 'deactivated'
                            ELSE 'activated'
                         END,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, service_name as "serviceName", status, maintenance_message as "maintenanceMessage", updated_at as "updatedAt"
        `;

        const result = await query(sql, [id]);

        if (!result.rows.length) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.json({ success: true, message: 'Status toggled', service: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


module.exports = router;