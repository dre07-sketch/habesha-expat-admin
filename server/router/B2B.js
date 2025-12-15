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
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
});

const upload = multer({ storage });

// Route
router.post('/businesses-post', upload.any(), async (req, res) => {
    try {
        const {
            name,
            category,
            email,
            phone,
            address,
            mapPin,
            website,
            description
        } = req.body;

        // Convert uploaded files to array of paths
        // Since we use upload.any(), req.files contains all files. 
        // We filter for those that start with 'image_' which is how the client sends them.
        const imagePaths = req.files
            ? req.files.filter(f => f.fieldname.startsWith('image_')).map(file => `/upload/${file.filename}`)
            : [];

        const sql = `
            INSERT INTO businesses 
                (name, category, email, phone, address, map_pin, website_url, description, image_url, status)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
            RETURNING id
        `;

        const result = await query(sql, [
            name,
            category,
            email,
            phone,
            address,
            mapPin,
            website,
            description,
            JSON.stringify(imagePaths) // Store as JSON string in image_url column
        ]);

        res.status(201).json({
            success: true,
            message: 'Business listing submitted',
            id: result.rows[0].id,
            images: imagePaths
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});


router.get('/businesses-get', async (req, res) => {
    try {
        // Fetch image_url which now might contain a JSON array of paths
        const sql = `
            SELECT id, name, category, email, phone, address, 
                   map_pin as mapPin, website_url, description, image_url, 
                   status, rating 
            FROM businesses 
            ORDER BY created_at DESC
        `;
        const { rows } = await query(sql);

        // Prepend host to image paths
        const host = req.protocol + '://' + req.get('host');

        const data = rows.map(b => {
            let images = [];
            let mainImage = null;

            if (b.image_url) {
                try {
                    // Try parsing as JSON array
                    const parsed = JSON.parse(b.image_url);
                    if (Array.isArray(parsed)) {
                        images = parsed.map(path => `${host}${path}`);
                        mainImage = images[0] || null;
                    } else {
                        // Fallback if it's a single string (legacy data)
                        mainImage = `${host}${b.image_url}`;
                        images = [mainImage];
                    }
                } catch (e) {
                    // Not JSON, assume simple string path (legacy data)
                    mainImage = `${host}${b.image_url}`;
                    images = [mainImage];
                }
            }

            return {
                ...b,
                image: mainImage, // Keep backwards compatibility for list view
                images: images    // Provide full array
            };
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/businesses/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const sql = `
            UPDATE businesses 
            SET status = $1 
            WHERE id = $2
        `;

        await query(sql, [status, id]);

        res.json({
            success: true,
            message: `Business ${status}`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.get('/business-rating-comment/:id', async (req, res) => {
    try {
        const businessId = req.params.id;

        // 1. GET BUSINESS
        const businessSql = `
            SELECT id, name, category, email, phone, address, map_pin,
                   website_url, description, image_url, status, created_at
            FROM businesses
            WHERE id = $1
        `;
        const businessResult = await query(businessSql, [businessId]);

        if (businessResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const business = businessResult.rows[0];

        // 2. AVERAGE RATING
        const avgRatingSql = `
            SELECT AVG(rating)::numeric(3,2) AS average_rating,
                   COUNT(*) AS total_reviews
            FROM business_reviews
            WHERE business_id = $1
        `;
        const ratingResult = await query(avgRatingSql, [businessId]);

        const averageRating = ratingResult.rows[0].average_rating || 0;
        const totalReviews = ratingResult.rows[0].total_reviews || 0;

        // 3. COMMENTS WITH USER DETAILS
        const commentsSql = `
            SELECT br.id, br.rating, br.comment, br.created_at,
                   u.id AS user_id, u.name AS user_name, 
                   u.avatar_url AS user_avatar
            FROM business_reviews br
            LEFT JOIN users u ON br.user_id = u.id
            WHERE br.business_id = $1
            ORDER BY br.created_at DESC
        `;

        const commentsResult = await query(commentsSql, [businessId]);

        return res.json({
            success: true,
            business,
            averageRating,
            totalReviews,
            comments: commentsResult.rows
        });

    } catch (error) {
        console.error("Error fetching business details:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

router.get('/businesses-catagories', async (req, res) => {
    try {

        const sql = "SELECT name FROM categories WHERE type = $1";
        const params = ['businesses'];

        const result = await query(sql, params);

        const rows = result.rows || result;

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});


module.exports = router;