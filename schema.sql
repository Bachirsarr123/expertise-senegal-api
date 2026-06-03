-- ====================================================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES ET DES TABLES
-- Projet : Cabinet Expertise Sénégal (CMS d'Administration)
-- ====================================================================

-- 1. Création de la base de données
CREATE DATABASE IF NOT EXISTS `expertise_senegal` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `expertise_senegal`;

-- 2. Structure de la table `admins`
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `login` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de l'administrateur par défaut (Login: admin / Password: admin)
-- Note : Le mot de passe ci-dessous est hashé en bcrypt ($2b$10$...)
INSERT INTO `admins` (`login`, `password`) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.heWG/igi')
ON DUPLICATE KEY UPDATE `login`=`login`;


-- 3. Structure de la table `parametres` (Configuration générale du cabinet)
CREATE TABLE IF NOT EXISTS `parametres` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `cle` VARCHAR(100) NOT NULL UNIQUE,
  `valeur` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des paramètres par défaut
INSERT INTO `parametres` (`cle`, `valeur`) VALUES
('site_name', 'Expertise Sénégal'),
('site_slogan', 'Cabinet Conseil & Études'),
('maintenance_mode', 'false'),
('contact_address', '75 C Cité Keur Gorgui, Dakar, Sénégal'),
('contact_phone', '33 823 54 52 — 77 643 41 60'),
('contact_email', 'contact@expertisesenegal.com'),
('legal_rc', 'SN.DKR.2016.B.26579'),
('legal_ninea', '006146642 2V2'),
('legal_capital', '100 000 F CFA'),
('legal_fiscal_centre', 'Dakar-Liberté'),
('legal_activity', 'Conseil, Études et Formation'),
('hours_mon_fri', '08h00 — 18h00'),
('hours_sat', '09h00 — 13h00'),
('hours_sun', 'Fermé')
ON DUPLICATE KEY UPDATE `cle`=`cle`;


-- 4. Structure de la table `contenu` (Textes dynamiques des pages)
CREATE TABLE IF NOT EXISTS `contenu` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `page` VARCHAR(50) NOT NULL,
  `section` VARCHAR(100) NOT NULL,
  `cle` VARCHAR(100) NOT NULL,
  `valeur` TEXT,
  `type` ENUM('texte','image','boolean','number') DEFAULT 'texte',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_content` (`page`, `section`, `cle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. Structure de la table `messages` (Formulaires de contact reçus)
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `telephone` VARCHAR(20) NOT NULL,
  `organisation` VARCHAR(150) NOT NULL,
  `objet` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `lu` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. Structure de la table `medias` (Bibliothèque de photos uploadées)
CREATE TABLE IF NOT EXISTS `medias` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nom` VARCHAR(255) NOT NULL,
  `chemin` VARCHAR(255) NOT NULL,
  `taille` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 7. Structure de la table `publications` (Séminaires & Formations, Appels, Actualités)
CREATE TABLE IF NOT EXISTS `publications` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM('formation','appel_candidature','actualite') NOT NULL,
  `titre` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `contenu` LONGTEXT,
  `image` VARCHAR(255),
  `date_debut` DATE,
  `date_fin` DATE,
  `lieu` VARCHAR(255),
  `places_disponibles` INT,
  `prix` VARCHAR(100),
  `statut` ENUM('brouillon','publie','archive') DEFAULT 'brouillon',
  `date_publication` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
 
-- 8. Structure de la table `inscriptions` (Inscriptions / Réponses des visiteurs)
CREATE TABLE IF NOT EXISTS `inscriptions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `publication_id` INT,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `telephone` VARCHAR(20) NOT NULL,
  `organisation` VARCHAR(150) NOT NULL,
  `poste` VARCHAR(100),
  `message` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`publication_id`) REFERENCES `publications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

