const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Format du token invalide.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'expertise_senegal_secret_2025');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};
