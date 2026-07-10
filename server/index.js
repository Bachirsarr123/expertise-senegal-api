const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const { seedDefaultContent } = require('./routes/contenu');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/contenu'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/media', require('./routes/media'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/inscriptions', require('./routes/inscriptions'));
app.use('/api/references', require('./routes/references'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Expertise Sénégal API is running.' });
});

async function startServer() {
  await db.initDB();
  await seedDefaultContent();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
