const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.get('/public', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM `client_references` ORDER BY ordre ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching public references:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM `client_references` ORDER BY ordre ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching references:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { nom, logo_url, secteur, ordre } = req.body;
  if (!nom) return res.status(400).json({ message: 'Le nom est obligatoire.' });
  try {
    const [[{ nextId }]] = await db.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM `client_references`');
    await db.query(
      'INSERT INTO `client_references` (id, nom, logo_url, secteur, ordre) VALUES (?, ?, ?, ?, ?)',
      [nextId, nom.trim(), logo_url || null, secteur || null, ordre ? parseInt(ordre) : 0]
    );
    res.status(201).json({ message: 'Reference creee.', id: nextId });
  } catch (error) {
    console.error('Error creating reference:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM `client_references` WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Reference non trouvee.' });
    res.json({ message: 'Reference supprimee.' });
  } catch (error) {
    console.error('Error deleting reference:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;