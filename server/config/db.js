const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'expertise_senegal',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Verify the connection is reachable before proceeding
    const conn = await pool.getConnection();
    conn.release();

    console.log('Connected to MySQL Database Pool.');
    await createTables();
  } catch (error) {
    console.error('Error connecting/initializing database:', error.message);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // 1. Admins
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        login VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed admin if empty
    const [admins] = await pool.query('SELECT * FROM admins LIMIT 1');
    if (admins.length === 0) {
      const hash = await bcrypt.hash('admin', 10);
      await pool.query('INSERT INTO admins (login, password) VALUES (?, ?)', ['admin', hash]);
      console.log('Seeded default admin user: admin / admin');
    }

    // 2. Contenu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contenu (
        id INT PRIMARY KEY AUTO_INCREMENT,
        page VARCHAR(50),
        section VARCHAR(100),
        cle VARCHAR(100),
        valeur TEXT,
        type ENUM('texte','image','boolean','number'),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_content (page, section, cle)
      )
    `);

    // 3. Messages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100),
        email VARCHAR(100),
        telephone VARCHAR(20),
        organisation VARCHAR(150),
        objet VARCHAR(100),
        message TEXT,
        lu BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Medias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medias (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255),
        chemin VARCHAR(255),
        taille INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Parametres
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parametres (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cle VARCHAR(100) UNIQUE,
        valeur TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 6. Publications
    await pool.query(`
      CREATE TABLE IF NOT EXISTS publications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type ENUM('formation','appel','alerte','actualite'),
        titre VARCHAR(255) NOT NULL,
        description TEXT,
        contenu LONGTEXT,
        image VARCHAR(255),
        date_debut DATE,
        date_fin DATE,
        lieu VARCHAR(255),
        places_disponibles INT,
        prix VARCHAR(100),
        statut ENUM('brouillon','publie','archive') DEFAULT 'brouillon',
        date_publication DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 7. Inscriptions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inscriptions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        publication_id INT,
        nom VARCHAR(100),
        prenom VARCHAR(100),
        email VARCHAR(100),
        telephone VARCHAR(20),
        organisation VARCHAR(150),
        poste VARCHAR(100),
        message TEXT,
        statut ENUM('nouveau','contacte','confirme','annule') DEFAULT 'nouveau',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE
      )
    `);

    // Seed default settings
    const defaultSettings = [
      { cle: 'site_name', valeur: 'Expertise Sénégal' },
      { cle: 'site_slogan', valeur: 'Cabinet Conseil & Études' },
      { cle: 'maintenance_mode', valeur: 'false' },
      { cle: 'contact_address', valeur: '75 C Cité Keur Gorgui, Dakar, Sénégal' },
      { cle: 'contact_phone', valeur: '33 823 54 52 – 77 643 41 60' },
      { cle: 'contact_email', valeur: 'contact@expertisesenegal.com' },
      { cle: 'legal_rc', valeur: 'SN.DKR.2016.B.26579' },
      { cle: 'legal_ninea', valeur: '006146642 2V2' },
      { cle: 'legal_capital', valeur: '100 000 F CFA' },
      { cle: 'legal_fiscal_centre', valeur: 'Dakar-Liberté' },
      { cle: 'legal_activity', valeur: 'Conseil, Études et Formation' },
      { cle: 'whatsapp_number', valeur: '221776434160' },
      { cle: 'hours_mon_fri', valeur: '08h00 - 18h00' },
      { cle: 'hours_sat', valeur: '09h00 - 13h00' },
      { cle: 'hours_sun', valeur: 'Ferme' }
    ];

    for (const setting of defaultSettings) {
      await pool.query('INSERT IGNORE INTO parametres (cle, valeur) VALUES (?, ?)', [setting.cle, setting.valeur]);
    }

    console.log('Database tables verified and seeded successfully.');
  } catch (error) {
    console.error('Error creating/seeding tables:', error.message);
  }
}

async function query(sql, params) {
  if (!pool) {
    throw new Error('Database pool has not been initialized. Please call initDB first.');
  }
  return pool.query(sql, params);
}

module.exports = {
  initDB,
  query,
  getPool: () => pool
};
