const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');

router.post('/categories-post', async (req, res) => {
    try {
        const { name, type } = req.body;

        const sql = `
            INSERT INTO categories (name, type)
            VALUES ($1, $2)
            RETURNING id
        `;

        const result = await query(sql, [name, type]);

        res.status(201).json({
            success: true,
            message: 'Category added',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/categories-get', async (req, res) => {
    try {
        const sql = `SELECT id, name, type FROM categories ORDER BY name ASC`;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Category
router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Note: If other tables reference this category with a foreign key, you need ON DELETE CASCADE
        await query(`DELETE FROM categories WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;