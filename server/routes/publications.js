const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/publications/public - Only published publications
router.get('/public', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM publications 
       WHERE statut = 'publie' AND (visible IS NULL OR visible = 1)
       ORDER BY date_publication DESC, id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching public publications:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// GET /api/publications - All publications (Admin protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // We count number of inscriptions per publication
    const [rows] = await db.query(
      `SELECT p.*, COUNT(i.id) AS inscrits_count 
       FROM publications p 
       LEFT JOIN inscriptions i ON p.id = i.publication_id 
       GROUP BY p.id 
       ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admin publications:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// GET /api/publications/:id - Get detail of single publication (Public or Admin)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM publications WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publication non trouvée.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching publication detail:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST /api/publications - Create new publication (Admin protected)
router.post('/', authMiddleware, async (req, res) => {
  const { 
    type, titre, description, contenu, image, document_url,
    date_debut, date_fin, lieu, places_disponibles, prix, statut, show_form
  } = req.body;

  if (!type || !titre) {
    return res.status(400).json({ message: 'Le type et le titre sont obligatoires.' });
  }

  const datePub = statut === 'publie' ? new Date() : null;

  try {
    const [[{ nextId }]] = await db.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM publications');
    await db.query(
      `INSERT INTO publications 
       (id, type, titre, description, contenu, image, document_url, date_debut, date_fin, lieu, places_disponibles, prix, statut, date_publication, show_form) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId, type, titre, description || '', contenu || '', image || null, document_url || null,
        date_debut || null, date_fin || null, lieu || null, 
        places_disponibles ? parseInt(places_disponibles) : null, 
        prix || null, statut || 'brouillon', datePub, show_form ? 1 : 0
      ]
    );

    res.status(201).json({ 
      message: 'Publication créée avec succès.', 
      id: nextId 
    });
  } catch (error) {
    console.error('Error creating publication:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// PUT /api/publications/:id - Update publication (Admin protected)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { 
    type, titre, description, contenu, image, document_url,
    date_debut, date_fin, lieu, places_disponibles, prix, statut, show_form
  } = req.body;

  if (!type || !titre) {
    return res.status(400).json({ message: 'Le type et le titre sont obligatoires.' });
  }

  try {
    // Check original status
    const [orig] = await db.query('SELECT statut, date_publication FROM publications WHERE id = ?', [id]);
    if (orig.length === 0) {
      return res.status(404).json({ message: 'Publication non trouvée.' });
    }

    let datePub = orig[0].date_publication;
    if (statut === 'publie' && orig[0].statut !== 'publie') {
      datePub = new Date();
    } else if (statut !== 'publie') {
      datePub = null;
    }

    await db.query(
      `UPDATE publications SET 
        type = ?, titre = ?, description = ?, contenu = ?, image = ?, 
        date_debut = ?, date_fin = ?, lieu = ?, places_disponibles = ?, 
        prix = ?, statut = ?, date_publication = ?, show_form = ?, updated_at = NOW() 
       WHERE id = ?`,
      [
        type, titre, description || '', contenu || '', image || null, 
        date_debut || null, date_fin || null, lieu || null, 
        places_disponibles ? parseInt(places_disponibles) : null, 
        prix || null, statut || 'brouillon', datePub, show_form ? 1 : 0, id
      ]
    );

    res.json({ message: 'Publication mise à jour avec succès.' });
  } catch (error) {
    console.error('Error updating publication:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// PATCH /api/publications/:id/statut - Change publication status only (Admin protected)
router.patch('/:id/statut', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!['brouillon', 'publie', 'archive'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  const datePub = statut === 'publie' ? new Date() : null;

  try {
    const [result] = await db.query(
      'UPDATE publications SET statut = ?, date_publication = ?, updated_at = NOW() WHERE id = ?',
      [statut, datePub, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Publication non trouvée.' });
    }

    res.json({ message: 'Statut mis à jour avec succès.' });
  } catch (error) {
    console.error('Error changing publication status:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// DELETE /api/publications/:id - Delete publication (Admin protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM publications WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Publication non trouvée.' });
    }
    res.json({ message: 'Publication supprimée avec succès.' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


// PATCH /api/publications/:id/visible - Toggle visibility (Admin protected)
router.patch('/:id/visible', authMiddleware, async (req, res) => {
  const { visible } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE publications SET visible = ?, updated_at = NOW() WHERE id = ?',
      [visible ? 1 : 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Publication non trouvée.' });
    res.json({ message: 'Visibilité mise à jour.' });
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// PATCH /api/publications/:id/show_form - Toggle inscription form visibility
router.patch('/:id/show_form', authMiddleware, async (req, res) => {
  const { show_form } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE publications SET show_form = ?, updated_at = NOW() WHERE id = ?',
      [show_form ? 1 : 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Publication non trouvee.' });
    res.json({ message: 'Formulaire mis a jour.' });
  } catch (error) {
    console.error('Error toggling show_form:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
module.exports = router;
