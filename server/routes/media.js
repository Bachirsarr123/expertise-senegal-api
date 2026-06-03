const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // timestamp_filename.ext
    const uniqueSuffix = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});

// File filter (JPG, PNG, WebP, max 5MB)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format d\'image non supporté (uniquement JPG, PNG, WebP)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Protected: Get all uploaded medias
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM medias ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Protected: Upload new media
router.post('/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'La taille du fichier dépasse la limite de 5Mo.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Veuillez sélectionner un fichier.' });
    }

    try {
      const nom = req.file.originalname;
      // The public path under /uploads/...
      const chemin = `/uploads/${req.file.filename}`;
      const taille = req.file.size;

      const [result] = await db.query(
        'INSERT INTO medias (nom, chemin, taille) VALUES (?, ?, ?)',
        [nom, chemin, taille]
      );

      res.status(201).json({
        message: 'Fichier uploadé avec succès.',
        media: {
          id: result.insertId,
          nom,
          chemin,
          taille
        }
      });
    } catch (error) {
      console.error('Error saving media path:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
});

// Protected: Delete media
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM medias WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Média introuvable.' });
    }

    const media = rows[0];
    const filePath = path.join(__dirname, '..', media.chemin);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from DB
    await db.query('DELETE FROM medias WHERE id = ?', [id]);

    res.json({ message: 'Média supprimé avec succès.' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
