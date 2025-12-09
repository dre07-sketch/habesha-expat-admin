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

const upload = multer({ storage });



router.post('/articles-post', upload.single('image'), async (req, res) => {
    try {
        const { title, slug, excerpt, content, category, author, publishDate } = req.body;
        
        // Get image path if uploaded
        const imagePath = req.file ? `/upload/${req.file.filename}` : null;

        const sql = `
            INSERT INTO articles 
                (title, slug, excerpt, content, category, author_name, publish_date, image_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, 'published')
            RETURNING id
        `;

        const result = await query(sql, [
            title, 
            slug, 
            excerpt, 
            content, 
            category, 
            author, 
            publishDate, 
            imagePath
        ]);

        res.status(201).json({ 
            success: true, 
            message: 'Article published', 
            id: result.rows[0].id,
            imageUrl: imagePath
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});




router.get("/articles-get", async (req, res) => {
  try {
    const baseURL = `${req.protocol}://${req.get("host")}`;

    const sql = `
      SELECT 
        id,
        title,
        slug,
        excerpt,
        content,
        image_url,
        category,
        author_name,
        status,
        views,
        publish_date,
        created_at
      FROM articles
      ORDER BY publish_date DESC;
    `;

    const { rows } = await query(sql);

    const formatted = rows.map(article => {
      let finalImage = null;

      if (article.image_url) {
        // 1. Replace Windows backslashes (\) with forward slashes (/)
        // 2. Remove any double leading slashes just in case
        const cleanPath = article.image_url.replace(/\\/g, '/').replace(/^\/+/, '');
        
        // 3. Construct the full URL
        finalImage = `${baseURL}/${cleanPath}`;
      }

      return {
        ...article,
        image: finalImage
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles." });
  }
});







module.exports = router;