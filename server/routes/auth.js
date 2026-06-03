const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

// Login route
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Veuillez saisir un identifiant et un mot de passe.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE login = ?', [login]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id, login: admin.login },
      process.env.JWT_SECRET || 'expertise_senegal_secret_2025',
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      admin: { id: admin.id, login: admin.login }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Change password route
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    const admin = rows[0];

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedNewPassword, req.admin.id]);

    res.json({ message: 'Mot de passe modifié avec succès.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
