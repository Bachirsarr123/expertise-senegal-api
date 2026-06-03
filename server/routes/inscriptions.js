const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const mailer = require('../utils/mailer');

// GET /api/inscriptions - All inscriptions (Admin protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT i.*, p.titre AS publication_titre, p.type AS publication_type 
       FROM inscriptions i 
       JOIN publications p ON i.publication_id = p.id 
       ORDER BY i.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching inscriptions:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// GET /api/inscriptions/publication/:publication_id - Inscriptions for single publication (Admin protected)
router.get('/publication/:publication_id', authMiddleware, async (req, res) => {
  const { publication_id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM inscriptions WHERE publication_id = ? ORDER BY created_at DESC',
      [publication_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching publication inscriptions:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST /api/inscriptions - Create a new inscription (Public endpoint)
router.post('/', async (req, res) => {
  const { 
    publication_id, nom, prenom, email, telephone, organisation, poste, message 
  } = req.body;

  if (!publication_id || !nom || !prenom || !email || !telephone || !organisation) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires (*).' });
  }

  try {
    // 1. Check if publication exists and has places
    const [pubs] = await db.query('SELECT * FROM publications WHERE id = ?', [publication_id]);
    if (pubs.length === 0) {
      return res.status(404).json({ message: 'Publication non trouvée.' });
    }

    const publication = pubs[0];

    // If it is a formation and check availability
    if (publication.type === 'formation' && publication.places_disponibles !== null) {
      if (publication.places_disponibles <= 0) {
        return res.status(400).json({ message: 'Cette formation est complète.' });
      }
    }

    // 2. Insert inscription
    const [result] = await db.query(
      `INSERT INTO inscriptions 
       (publication_id, nom, prenom, email, telephone, organisation, poste, message, statut) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'nouveau')`,
      [publication_id, nom, prenom, email, telephone, organisation, poste || '', message || '']
    );

    // 3. Decrement places_disponibles if it's a formation
    if (publication.type === 'formation' && publication.places_disponibles !== null && publication.places_disponibles > 0) {
      await db.query(
        'UPDATE publications SET places_disponibles = places_disponibles - 1 WHERE id = ?',
        [publication_id]
      );
    }

    // 4. Send email notifications in the background
    const currentDate = new Date().toLocaleString('fr-FR');
    
    // A. Email to Admin
    const adminSubject = `🔔 Nouvelle inscription — ${publication.titre}`;
    const adminText = `Bonjour,
Une nouvelle inscription vient d'être reçue.

Formation/Publication : ${publication.titre}
Type : ${publication.type.toUpperCase()}
Nom : ${prenom} ${nom}
Email : ${email}
Téléphone : ${telephone}
Organisation : ${organisation}
Poste : ${poste || 'Non spécifié'}
Message : ${message || 'Aucun message.'}
Date : ${currentDate}

Connectez-vous à l'admin pour gérer cette inscription.`;

    mailer.sendMail(
      process.env.MAIL_USER || 'contact@expertisesenegal.com', 
      adminSubject, 
      adminText
    );

    // B. Email to Visitor
    const visitorSubject = `✅ Inscription reçue — ${publication.titre}`;
    const visitorText = `Bonjour ${prenom},
Votre inscription à "${publication.titre}" a bien été reçue.
Notre équipe vous contactera très prochainement.

Cordialement,
L'équipe Expertise Sénégal
75 C Cité Keur Gorgui, Dakar
33 823 54 52 / 77 643 41 60
contact@expertisesenegal.com`;

    mailer.sendMail(email, visitorSubject, visitorText);

    res.status(201).json({ 
      message: 'Votre inscription a été enregistrée avec succès. Un e-mail de confirmation vous a été envoyé.', 
      inscriptionId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating inscription:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// PATCH /api/inscriptions/:id/statut - Change status (Admin protected)
router.patch('/:id/statut', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!['nouveau', 'contacte', 'confirme', 'annule'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  try {
    const [result] = await db.query('UPDATE inscriptions SET statut = ? WHERE id = ?', [statut, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inscription non trouvée.' });
    }
    res.json({ message: 'Statut de l\'inscrit mis à jour avec succès.' });
  } catch (error) {
    console.error('Error changing inscription status:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// DELETE /api/inscriptions/:id - Delete inscription (Admin protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // We get the inscription details to potentially restore a place if it was a formation
    const [inscr] = await db.query('SELECT * FROM inscriptions WHERE id = ?', [id]);
    if (inscr.length === 0) {
      return res.status(404).json({ message: 'Inscription non trouvée.' });
    }

    const inscription = inscr[0];
    const [pubs] = await db.query('SELECT type FROM publications WHERE id = ?', [inscription.publication_id]);
    
    // Delete
    await db.query('DELETE FROM inscriptions WHERE id = ?', [id]);

    // Restore place if it's a formation
    if (pubs.length > 0 && pubs[0].type === 'formation') {
      await db.query(
        'UPDATE publications SET places_disponibles = places_disponibles + 1 WHERE id = ?',
        [inscription.publication_id]
      );
    }

    res.json({ message: 'Inscription supprimée avec succès et place libérée.' });
  } catch (error) {
    console.error('Error deleting inscription:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST /api/inscriptions/email-group - Send group email to confirmed inscrits (Admin protected)
router.post('/email-group', authMiddleware, async (req, res) => {
  const { publicationId, subject, message } = req.body;

  if (!publicationId || !subject || !message) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs (publicationId, subject, message).' });
  }

  try {
    // 1. Get publication details
    const [pubs] = await db.query('SELECT titre FROM publications WHERE id = ?', [publicationId]);
    if (pubs.length === 0) {
      return res.status(404).json({ message: 'Publication non trouvée.' });
    }

    // 2. Get confirmed inscrits
    const [inscrits] = await db.query(
      'SELECT email, prenom FROM inscriptions WHERE publication_id = ? AND statut = "confirme"',
      [publicationId]
    );

    if (inscrits.length === 0) {
      return res.status(400).json({ message: 'Aucun inscrit confirmé pour cette publication.' });
    }

    // 3. Send emails
    let successCount = 0;
    for (const inscrit of inscrits) {
      const personalMessage = `Bonjour ${inscrit.prenom},\n\n${message}\n\nCordialement,\nL'équipe Expertise Sénégal`;
      const result = await mailer.sendMail(inscrit.email, subject, personalMessage);
      if (result.success) {
        successCount++;
      }
    }

    res.json({ 
      message: `E-mails groupés envoyés avec succès à ${successCount} inscrit(s) confirmé(s).` 
    });
  } catch (error) {
    console.error('Error sending group email:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
