const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Default Content Seeder if DB is empty
const defaultContent = [
  // --- ACCUEIL ---
  // Hero Section
  { page: 'accueil', section: 'hero', cle: 'badge', valeur: '● CABINET DE CONSEIL — DAKAR, SÉNÉGAL', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'title_white', valeur: "L'Expertise Éprouvée au Service de", type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'title_gold', valeur: 'votre Performance', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'subtitle', valeur: 'Cabinet de Formation, Conseil et Études pluridisciplinaire au Sénégal. Nous accompagnons vos politiques publiques, projets de développement et performance organisationnelle depuis 2016.', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_primary_text', valeur: 'Demander un Devis', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_primary_link', valeur: '/contact', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_secondary_text', valeur: 'Découvrir le Cabinet', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_secondary_link', valeur: '/a-propos', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'bg_image', valeur: '/src/assets/hero.png', type: 'image' },
  { page: 'accueil', section: 'hero', cle: 'bg_image', valeur: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', type: 'image' },
  { page: 'accueil', section: 'hero', cle: 'active', valeur: 'true', type: 'boolean' },

  // Chiffres Clés
  { page: 'accueil', section: 'stats', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'stats', cle: 'stat1_num', valeur: '8+', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat1_lbl', valeur: "Années d'Expérience", type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat2_num', valeur: '100+', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat2_lbl', valeur: 'Projets Réalisés', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat3_num', valeur: '14', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat3_lbl', valeur: 'Experts Partenaires', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat4_num', valeur: '50+', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat4_lbl', valeur: 'Formations Délivrées', type: 'texte' },

  // A Propos Section
  { page: 'accueil', section: 'apropos', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'apropos', cle: 'title', valeur: 'Votre partenaire de confiance pour des décisions éclairées', type: 'texte' },
  { page: 'accueil', section: 'apropos', cle: 'text', valeur: 'Expertise Sénégal est un cabinet de Conseil, Études et Formation fondé en 2016. Nous mobilisons des équipes d’experts pluridisciplinaires pour accompagner la réussite des projets publics, privés et des organisations non-gouvernementales.', type: 'texte' },

  // Domaines
  { page: 'accueil', section: 'domaines', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'domaines', cle: 'title', valeur: "Nos Domaines d'Intervention", type: 'texte' },
  { page: 'accueil', section: 'domaines', cle: 'subtitle', valeur: 'Une expertise globale structurée en 4 pôles pour répondre à tous vos besoins.', type: 'texte' },

  // --- A PROPOS ---
  // Hero
  { page: 'apropos', section: 'hero', cle: 'badge', valeur: '● À PROPOS — EXPERTISE SÉNÉGAL', type: 'texte' },
  { page: 'apropos', section: 'hero', cle: 'title_white', valeur: 'Un Cabinet au Service du', type: 'texte' },
  { page: 'apropos', section: 'hero', cle: 'title_gold', valeur: 'Développement', type: 'texte' },
  { page: 'apropos', section: 'hero', cle: 'subtitle', valeur: 'Depuis 2016, nous mobilisons une expertise pluridisciplinaire au service des institutions publiques, des entreprises privées et des organisations de la société civile.', type: 'texte' },

  // Presentation
  { page: 'apropos', section: 'presentation', cle: 'title', valeur: 'Qui sommes-nous ?', type: 'texte' },
  { page: 'apropos', section: 'presentation', cle: 'image', valeur: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80', type: 'image' },
  { page: 'apropos', section: 'presentation', cle: 'text', valeur: 'Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire, spécialisé dans l’évaluation de projets, l’audit et contrôle, ainsi que dans le renforcement des capacités à travers la formation continue et l’assistance technique. Fondé en 2016, le cabinet incarne une expertise éprouvée, mobilisant des experts hautement qualifiés.', type: 'texte' },

  // Vision
  { page: 'apropos', section: 'vision', cle: 'title', valeur: 'Notre Vision', type: 'texte' },
  { page: 'apropos', section: 'vision', cle: 'points', valeur: '["Devenir le cabinet de référence en Afrique de l\'Ouest pour l\'accompagnement des politiques publiques.","Bâtir des capacités locales robustes à travers des formations certifiantes d\'excellence.","Garantir des études à fort impact basées sur des analyses rigoureuses et scientifiques."]', type: 'texte' },

  // Atouts
  { page: 'apropos', section: 'atouts', cle: 'title', valeur: 'Nos Atouts', type: 'texte' },
  { page: 'apropos', section: 'atouts', cle: 'list', valeur: '[{"title":"Expertise Pluridisciplinaire","desc":"Des équipes d\'experts seniors couvrant la finance, le management, le droit public et le développement."},{"title":"Proximité & Réactivité","desc":"Un ancrage local fort à Dakar permettant un accompagnement sur mesure et une intervention rapide."},{"title":"Rigueur Scientifique","desc":"Des méthodologies d\'évaluation et d\'enquête éprouvées, conformes aux standards internationaux."}]', type: 'texte' },

  // --- DOMAINES ---
  // Hero
  { page: 'domaines', section: 'hero', cle: 'badge', valeur: '● NOS DOMAINES — EXPERTISE SÉNÉGAL', type: 'texte' },
  { page: 'domaines', section: 'hero', cle: 'title_white', valeur: 'Nos Domaines', type: 'texte' },
  { page: 'domaines', section: 'hero', cle: 'title_gold', valeur: "d'Activité", type: 'texte' },
  { page: 'domaines', section: 'hero', cle: 'subtitle', valeur: 'Nous intervenons dans 4 domaines complémentaires pour accompagner les institutions publiques, les entreprises privées et les organisations de la société civile.', type: 'texte' },

  // Domaine 1
  { page: 'domaines', section: 'domaine1', cle: 'title', valeur: 'Études et Analyses Sectorielles', type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'intro', valeur: 'Nous réalisons des études approfondies pour éclairer les décisions stratégiques et opérationnelles de nos clients.', type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'prestations', valeur: '["Études de faisabilité, diagnostics territoriaux, socio-économiques ou institutionnels","Enquêtes de satisfaction, sondages d’opinion et collecte de données à grande échelle","Analyses de genre, de vulnérabilité et études d’impact environnemental et social","Plans de développement communaux et territoriaux (PDC/PDT)"]', type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'references', valeur: '["Étude de faisabilité pour le programme de développement agricole (Client: Ministère de l\'Agriculture)","Diagnostic territorial pour l\'aménagement de la zone périurbaine de Dakar (Client: Collectivité Locale)"]', type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'active', valeur: 'true', type: 'boolean' },

  // Domaine 2
  { page: 'domaines', section: 'domaine2', cle: 'title', valeur: 'Gestion et Évaluation des Politiques Publiques', type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'intro', valeur: 'Nous accompagnons l’État, les partenaires au développement et les ONG dans l’optimisation de leurs interventions.', type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'prestations', valeur: '["Évaluation à mi-parcours, finale et d’impact de projets et programmes de développement","Mise en place de systèmes de Suivi-Évaluation (S&E) et formation des équipes","Appui à la planification stratégique et opérationnelle des ministères et agences","Audits organisationnels et institutionnels de structures publiques et parapubliques"]', type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'references', valeur: '["Évaluation finale du projet d\'accès à l\'eau potable en milieu rural (Financement: Partenaire International)","Audit organisationnel et restructuration de l\'Agence de Promotion des Emplois (Client: Structure Parapublique)"]', type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'active', valeur: 'true', type: 'boolean' },

  // Domaine 3
  { page: 'domaines', section: 'domaine3', cle: 'title', valeur: 'Audit, Conseil et Assistance Technique', type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'intro', valeur: 'Nous sécurisons la gouvernance et optimisons la performance opérationnelle de vos organisations.', type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'prestations', valeur: '["Audit des marchés publics (contrôle de conformité de la passation et de l’exécution)","Conseil en gestion financière, comptable et audit interne des entreprises","Assistance technique auprès des collectivités territoriales pour la mobilisation des ressources","Accompagnement à la certification qualité et mise en conformité réglementaire"]', type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'references', valeur: '["Audit annuel de conformité des marchés publics (Client: Autorité de Régulation)","Assistance technique pour le renforcement des recettes de 5 communes (Client: Programme d\'Appui aux Communes)"]', type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'active', valeur: 'true', type: 'boolean' },

  // Domaine 4
  { page: 'domaines', section: 'domaine4', cle: 'title', valeur: 'Formation Continue et Renforcement des Capacités', type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'intro', valeur: 'Nous concevons et animons des programmes de formation pour développer le capital humain.', type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'prestations', valeur: '["Ingénierie de formation : élaboration de plans de formation et référentiels de compétences","Formations intra-organisation : sessions sur mesure adaptées aux besoins de la structure","Formations inter-organisations : séminaires d’excellence favorisant le partage d’expériences","Formations sur site : déploiement d’ateliers pratiques directement dans vos locaux ou régions"]', type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'themes', valeur: '["Finance Publique","Gestion de Projet","Marchés Publics","Soft Skills","Communication","Management","Informatique"]', type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'active', valeur: 'true', type: 'boolean' },

  // --- CONTACT ---
  { page: 'contact', section: 'hero', cle: 'badge', valeur: 'CONTACT - EXPERTISE SENEGAL', type: 'texte' },
  { page: 'contact', section: 'hero', cle: 'title_white', valeur: 'Contactez', type: 'texte' },
  { page: 'contact', section: 'hero', cle: 'title_gold', valeur: 'Notre Cabinet', type: 'texte' },
  { page: 'contact', section: 'hero', cle: 'subtitle', valeur: 'Vous avez un projet, une mission ou une demande de formation ? Notre equipe est disponible pour vous accompagner.', type: 'texte' },
  { page: 'contact', section: 'formation', cle: 'badge', valeur: '- POLE FORMATION -', type: 'texte' },
  { page: 'contact', section: 'formation', cle: 'title', valeur: 'Demander une Formation', type: 'texte' },
  { page: 'contact', section: 'formation', cle: 'subtitle', valeur: 'Expertise Senegal propose des formations intra-organisation, inter-organisations et sur site dans toutes les regions du Senegal.', type: 'texte' },
  { page: 'contact', section: 'cta', cle: 'title', valeur: 'Pret a demarrer votre projet ?', type: 'texte' },
  { page: 'contact', section: 'cta', cle: 'subtitle', valeur: "Contactez-nous des aujourd'hui pour un accompagnement personnalise", type: 'texte' },

  // --- SEMINAIRES ---
  { page: 'seminaires', section: 'hero', cle: 'badge', valeur: 'SEMINAIRES & FORMATIONS - EXPERTISE SENEGAL', type: 'texte' },
  { page: 'seminaires', section: 'hero', cle: 'title', valeur: 'Seminaires & Formations', type: 'texte' },
  { page: 'seminaires', section: 'hero', cle: 'bg_image', valeur: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920', type: 'image' },
  { page: 'seminaires', section: 'hero', cle: 'subtitle', valeur: 'Retrouvez toutes nos formations continues, seminaires professionnels, appels a candidatures et actualites.', type: 'texte' }
];

// Helper to seed db content if empty
async function checkAndSeedContent() {
  try {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM contenu');
    if (rows[0].count === 0) {
      console.log('Seeding default page contents...');
      for (const item of defaultContent) {
        await db.query(
          'INSERT INTO contenu (page, section, cle, valeur, type) VALUES (?, ?, ?, ?, ?)',
          [item.page, item.section, item.cle, item.valeur, item.type]
        );
      }
      console.log('Page contents seeded.');
    }
  } catch (error) {
    console.error('Error seeding contents:', error);
  }
}

// Get all contents
router.get('/all', async (req, res) => {
  try {
    await checkAndSeedContent();
    const [rows] = await db.query('SELECT * FROM contenu');
    // Format into a nested object: result[page][section][cle] = valeur
    const formatted = {};
    rows.forEach(item => {
      if (!formatted[item.page]) formatted[item.page] = {};
      if (!formatted[item.page][item.section]) formatted[item.page][item.section] = {};
      
      let val = item.valeur;
      if (item.type === 'boolean') {
        val = item.valeur === 'true';
      } else if (item.type === 'number') {
        val = Number(item.valeur);
      }
      formatted[item.page][item.section][item.cle] = val;
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Save multiple contents
router.post('/save', authMiddleware, async (req, res) => {
  const { contents } = req.body; // Expect array of { page, section, cle, valeur, type }

  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ message: 'Données invalides.' });
  }

  try {
    for (const item of contents) {
      const { page, section, cle, valeur, type } = item;
      await db.query(
        `INSERT INTO contenu (page, section, cle, valeur, type) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE valeur = ?, type = ?`,
        [page, section, cle, String(valeur), type || 'texte', String(valeur), type || 'texte']
      );
    }
    res.json({ message: 'Contenu mis à jour avec succès.' });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Get public parameters
router.get('/parametres', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT cle, valeur FROM parametres');
    const params = {};
    rows.forEach(r => {
      params[r.cle] = r.valeur;
    });
    res.json(params);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Save parameters
router.put('/parametres', authMiddleware, async (req, res) => {
  const settings = req.body; // Object with key-value pairs

  try {
    for (const [cle, valeur] of Object.entries(settings)) {
      await db.query(
        'INSERT INTO parametres (cle, valeur) VALUES (?, ?) ON DUPLICATE KEY UPDATE valeur = ?',
        [cle, String(valeur), String(valeur)]
      );
    }
    res.json({ message: 'Paramètres mis à jour avec succès.' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
