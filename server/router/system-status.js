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

router.get('/system-status/admin-panel/check', async (req, res) => {
  try {
    const sql = `
      SELECT status, maintenance_message
      FROM system_status
      WHERE id = 2
      LIMIT 1
    `;

    const result = await query(sql);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin Panel status not found'
      });
    }

    res.status(200).json({
      success: true,
      service: 'Admin Panel',
      status: result.rows[0].status,
      maintenance_message: result.rows[0].maintenance_message
    });

  } catch (error) {
    console.error('❌ Error checking Admin Panel status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check Admin Panel status'
    });
  }
});

router.put('/system-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status, maintenance_message, updated_by } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  try {
    const sql = `
      UPDATE system_status
      SET
        status = $1,
        maintenance_message = $2,
        updated_by = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const params = [
      status,
      maintenance_message || null,
      updated_by || null,
      id
    ];

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'System status not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'System status updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating system status:', error);
    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});


module.exports = router;