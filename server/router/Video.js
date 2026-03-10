const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, DB_TYPE } = require('../connection/db');

// Configure Multer for video and image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../upload');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'video-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for videos
});

const buildMediaURL = (path, baseURL) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  let cleanPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.replace('uploads/', 'upload/');
  } else if (!cleanPath.startsWith('upload/')) {
    cleanPath = `upload/${cleanPath}`;
  }
  return `${baseURL}/${cleanPath}`;
};

// GET all videos
router.get('/videos-get', async (req, res) => {
  try {
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const sql = `
      SELECT id, title, slug, description, video_url, thumbnail_url, category, duration, views, status, upload_date
      FROM videos
      ORDER BY upload_date DESC
    `;
    const { rows } = await query(sql);

    const formatted = rows.map(vid => ({
      ...vid,
      thumbnail: buildMediaURL(vid.thumbnail_url, baseURL),
      videoFile: buildMediaURL(vid.video_url, baseURL),
      uploadDate: vid.upload_date ? new Date(vid.upload_date).toLocaleDateString() : undefined,
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new video
router.post('/videos-post', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, slug, category, description, duration, videoUrl } = req.body;
    
    let thumbnailUrl = null;

    if (req.file) {
      thumbnailUrl = `/upload/${req.file.filename}`;
    }

    const sql = `
      INSERT INTO videos (title, slug, description, video_url, thumbnail_url, category, duration, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      title,
      slug,
      description,
      videoUrl, // From the text input body
      thumbnailUrl, // From the file upload
      category,
      duration || '00:00',
      'visible'
    ];

    const { rows } = await query(sql, values);
    const newVideo = rows[0];

    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: newVideo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM videos WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Video Visibility
router.put('/videos/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'visible' or 'hidden'

        await query(
            `UPDATE videos SET status = $1 WHERE id = $2`,
            [status, id]
        );

        res.json({ success: true, message: `Video status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;