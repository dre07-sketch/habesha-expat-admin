const { query } = require('../connection/db');

/**
 * Logs an administrative action to the database.
 * 
 * @param {Object} req - The Express request object (contains user, ip, etc.)
 * @param {string} action - The action performed (e.g., 'DELETE', 'UPDATE', 'BAN')
 * @param {string} targetType - The type of item affected (e.g., 'ARTICLE', 'USER')
 * @param {string|number} targetId - The ID of the item affected
 * @param {string} details - Human-readable details
 */
const logAction = async (req, action, targetType, targetId, details) => {
    try {
        const adminId = req.user ? req.user.id : null;
        const adminName = req.user ? req.user.name : 'Unknown'; // Requires user.name in JWT/Monitor

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // Normalize targetId to string
        const tId = targetId ? String(targetId) : null;

        const sql = `
            INSERT INTO audit_logs 
            (admin_id, admin_name, action, target_type, target_id, details, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        // We don't await this because we don't want to block the response
        query(sql, [adminId, adminName, action, targetType, tId, details, ip, userAgent])
            .catch(err => console.error("❌ Audit Log Error (Background):", err));

    } catch (err) {
        console.error("❌ Audit Log Error (Setup):", err);
    }
};

module.exports = { logAction };
