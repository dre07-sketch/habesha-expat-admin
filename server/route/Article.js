const express = require('express');
const router = express.Router();
const { query, DB_TYPE } = require('../connection/db');




router.post('/articles-post', async (req, res) => {
    try {
        const { title, slug, excerpt, content, category, author, publishDate, image } = req.body;

        const sql = `
            INSERT INTO articles 
                (title, slug, excerpt, content, category, author_name, publish_date, image_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, 'published')
            RETURNING id
        `;

        const result = await query(sql, [title, slug, excerpt, content, category, author, publishDate, image]);

        res.status(201).json({ 
            success: true, 
            message: 'Article published', 
            id: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});



router.get('/articles-get', async (req, res) => {
    try {
        const sql = `
            SELECT id, title, slug, excerpt, content, category, 
            author_name as author, publish_date as publishDate, 
            image_url as image, status, views 
            FROM articles 
            ORDER BY publish_date DESC
        `;
        const { rows } = await query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;