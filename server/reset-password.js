const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function reset() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'expertise_senegal'
    });

    const hash = await bcrypt.hash('admin', 10);
    await connection.query('UPDATE admins SET password = ? WHERE login = ?', [hash, 'admin']);
    console.log('SUCCESS: Password for admin reset to: admin');
    await connection.end();
  } catch (err) {
    console.error('ERROR resetting password:', err.message);
  }
}

reset();
