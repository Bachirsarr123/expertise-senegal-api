const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov', '.avi'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporte. Utilise JPG, PNG, WebP, GIF, MP4, WebM ou MOV.'));
    }
  }
});

// GET all medias
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM medias ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST upload to Cloudinary
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier recu.' });

  try {
    const isVideo = req.file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'expertise-senegal', resource_type: resourceType },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(req.file.buffer);
    });

    const nom = req.file.originalname;
    const chemin = uploadResult.secure_url;
    const publicId = uploadResult.public_id;
    const taille = req.file.size;

    const [maxRes] = await db.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM medias');
    const nextId = maxRes[0].nextId;

    await db.query(
      'INSERT INTO medias (id, nom, chemin, public_id, resource_type, taille) VALUES (?, ?, ?, ?, ?, ?)',
      [nextId, nom, chemin, publicId, resourceType, taille]
    );

    const [newRow] = await db.query('SELECT * FROM medias WHERE public_id = ?', [publicId]);
    const media = newRow[0] || { nom, chemin, public_id: publicId, resource_type: resourceType, taille };

    res.status(201).json({ message: 'Fichier uploade avec succes.', media });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Erreur upload Cloudinary: ' + error.message });
  }
});

// DELETE media (from Cloudinary + DB)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM medias WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Media introuvable.' });

    const media = rows[0];

    if (media.public_id) {
      try {
        await cloudinary.uploader.destroy(media.public_id, { resource_type: media.resource_type || 'image' });
      } catch (cldErr) {
        console.warn('Cloudinary delete warning:', cldErr.message);
      }
    }

    await db.query('DELETE FROM medias WHERE id = ?', [id]);
    res.json({ message: 'Media supprime avec succes.' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


// POST upload document (PDF/Word) to Cloudinary
const ALLOWED_DOC_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const uploadDoc = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_DOC_EXTENSIONS.includes(ext)) { cb(null, true); }
    else { cb(new Error('Format non supporte. Utilisez PDF, DOC ou DOCX.')); }
  }
});

router.post('/upload-document', authMiddleware, uploadDoc.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier recu.' });
  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const baseName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'expertise-senegal/documents',
          resource_type: 'raw',
          public_id: baseName + '_' + Date.now() + ext
        },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(req.file.buffer);
    });
    res.json({ url: uploadResult.secure_url, filename: req.file.originalname, size: req.file.size });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Erreur upload: ' + error.message });
  }
});
module.exports = router;