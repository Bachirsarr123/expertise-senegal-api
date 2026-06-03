const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Public route: submit a contact message
router.post('/', async (req, res) => {
  const { nom, email, telephone, organisation, objet, message } = req.body;

  if (!nom || !email || !telephone || !organisation || !objet || !message) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
  }

  try {
    await db.query(
      'INSERT INTO messages (nom, email, telephone, organisation, objet, message) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, email, telephone, organisation, objet, message]
    );
    res.status(201).json({ message: 'Votre message a bien été envoyé.' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Protected route: get all messages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Protected route: mark message read/unread
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { lu } = req.body; // boolean

  try {
    await db.query('UPDATE messages SET lu = ? WHERE id = ?', [lu ? 1 : 0, id]);
    res.json({ message: 'Statut du message mis à jour.' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Protected route: delete a message
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ message: 'Message supprimé avec succès.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Protected route: Export messages to CSV
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');

    // Generate CSV contents
    // UTF-8 Byte Order Mark (BOM) to make Excel read accents correctly
    let csv = '\uFEFF';
    
    // Headers
    csv += 'ID;Nom;Email;Téléphone;Organisation;Objet;Message;Lu;Date de réception\r\n';

    rows.forEach(msg => {
      // Escape semicolons, newlines and quotes
      const cleanNom = String(msg.nom || '').replace(/;/g, ',').replace(/[\r\n]+/g, ' ');
      const cleanEmail = String(msg.email || '').replace(/;/g, ',');
      const cleanTel = String(msg.telephone || '').replace(/;/g, ',');
      const cleanOrg = String(msg.organisation || '').replace(/;/g, ',').replace(/[\r\n]+/g, ' ');
      const cleanObjet = String(msg.objet || '').replace(/;/g, ',').replace(/[\r\n]+/g, ' ');
      const cleanMsg = String(msg.message || '').replace(/"/g, '""').replace(/;/g, ',').replace(/[\r\n]+/g, ' ');
      const cleanLu = msg.lu ? 'Oui' : 'Non';
      const cleanDate = new Date(msg.created_at).toLocaleString('fr-FR');

      csv += `${msg.id};"${cleanNom}";"${cleanEmail}";"${cleanTel}";"${cleanOrg}";"${cleanObjet}";"${cleanMsg}";"${cleanLu}";"${cleanDate}"\r\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=messages_expertise_senegal.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting messages:', error);
    res.status(500).send('Erreur lors de la génération du fichier CSV.');
  }
});

module.exports = router;
