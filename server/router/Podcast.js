const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, DB_TYPE } = require('../connection/db');
const { logAction } = require('../utils/auditLogger');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../upload');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'podcast-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
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

// GET all podcasts
router.get('/podcasts-get', async (req, res) => {
  try {
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const sql = `
      SELECT id, title, slug, host, category, audio_url, thumbnail_url, status, tags, duration, description, created_at
      FROM podcasts
      ORDER BY created_at DESC
    `;
    const { rows } = await query(sql);

    const formatted = rows.map(pod => ({
      ...pod,
      coverImage: buildMediaURL(pod.thumbnail_url, baseURL),
      audioFile: pod.audio_url,
      tags: pod.tags || []
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new podcast
router.post('/podcasts-post', upload.single('image'), async (req, res) => {
  try {
    const { title, host, slug, category, audioUrl, tags, duration, description } = req.body;
    let imagePath = null;
    if (req.file) {
      imagePath = `/upload/${req.file.filename}`;
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        console.error("Error parsing tags:", e);
        parsedTags = [];
      }
    }

    const sql = `
      INSERT INTO podcasts (title, host, slug, category, audio_url, thumbnail_url, tags, duration, status, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      title,
      host,
      slug,
      category,
      audioUrl,
      imagePath,
      JSON.stringify(parsedTags),
      duration || '00:00',
      'visible',
      description
    ];

    const { rows } = await query(sql, values);
    const newPodcast = rows[0];

    await logAction(req, 'CREATE', 'PODCAST', newPodcast.id, `Created Podcast: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Podcast created successfully',
      data: newPodcast
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/podcasts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query(`DELETE FROM podcasts WHERE id = $1`, [id]);
    await logAction(req, 'DELETE', 'PODCAST', id, `Deleted podcast ID: ${id}`);
    res.json({ success: true, message: 'Podcast episode deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Podcast Visibility
router.put('/podcasts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await query(
      `UPDATE podcasts SET status = $1 WHERE id = $2`,
      [status, id]
    );

    await logAction(req, 'UPDATE', 'PODCAST', id, `Updated podcast status to: ${status}`);

    res.json({ success: true, message: `Podcast status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;