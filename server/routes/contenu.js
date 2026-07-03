const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const defaultContent = [
  // --- ACCUEIL ---
  { page: 'accueil', section: 'hero', cle: 'badge', valeur: '● CABINET DE CONSEIL — DAKAR, SÉNÉGAL', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'title_white', valeur: "L'Expertise Éprouvée au Service de", type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'title_gold', valeur: 'votre Performance', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'subtitle', valeur: "Cabinet de Formation, Conseil et Études pluridisciplinaire au Sénégal. Nous accompagnons vos politiques publiques, projets de développement et performance organisationnelle depuis 2016.", type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_primary_text', valeur: 'Demander un Devis', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_primary_link', valeur: '/contact', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_secondary_text', valeur: 'Découvrir le Cabinet', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'cta_secondary_link', valeur: '/a-propos', type: 'texte' },
  { page: 'accueil', section: 'hero', cle: 'bg_image', valeur: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', type: 'image' },
  { page: 'accueil', section: 'hero', cle: 'active', valeur: 'true', type: 'boolean' },

  { page: 'accueil', section: 'stats', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'stats', cle: 'stat1_num', valeur: '8+', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat1_lbl', valeur: "Années d'expérience confirmée", type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat2_num', valeur: '100+', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat2_lbl', valeur: 'Missions réalisées avec succès', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat3_num', valeur: '14', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat3_lbl', valeur: 'Régions couvertes', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat4_num', valeur: '50+', type: 'texte' },
  { page: 'accueil', section: 'stats', cle: 'stat4_lbl', valeur: 'Experts mobilisés dans le réseau', type: 'texte' },

  { page: 'accueil', section: 'apropos', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'apropos', cle: 'title', valeur: 'Un Cabinet Pluridisciplinaire au Service du Développement', type: 'texte' },
  { page: 'accueil', section: 'apropos', cle: 'text', valeur: "Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire, spécialisé dans l'évaluation de projets, l'audit et contrôle, ainsi que dans le renforcement des capacités à travers la formation continue et l'assistance technique.\n\nFondé en 2016, le cabinet incarne une expertise éprouvée, mobilisée au service des politiques publiques, des projets de développement et de la performance organisationnelle, aussi bien au Sénégal que dans la sous-région.", type: 'texte' },
  { page: 'accueil', section: 'apropos', cle: 'image', valeur: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80', type: 'image' },
  { page: 'accueil', section: 'apropos', cle: 'btn_text', valeur: 'En savoir plus', type: 'texte' },
  { page: 'accueil', section: 'apropos', cle: 'btn_link', valeur: '/a-propos', type: 'texte' },

  { page: 'accueil', section: 'domaines', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'domaines', cle: 'title', valeur: "Nos Domaines d'Intervention", type: 'texte' },
  { page: 'accueil', section: 'domaines', cle: 'subtitle', valeur: 'Une expertise globale structurée en 4 pôles pour répondre à tous vos besoins.', type: 'texte' },
  { page: 'accueil', section: 'domaines', cle: 'cards', valeur: JSON.stringify([
    { icon: '📊', title: 'Études et analyses sectorielles', text: "Études de faisabilité, diagnostics territoriaux, socio-économiques ou institutionnels. Analyses d'impact, capitalisation d'expériences et documentation de projets." },
    { icon: '📋', title: 'Évaluation et suivi de projets', text: 'Évaluations ex-ante, à mi-parcours et finales. Suivi-évaluation axé sur les résultats (GAR). Conception et opérationnalisation de systèmes de suivi-évaluation.' },
    { icon: '🔍', title: 'Audit de conformité — Marchés publics', text: "Audit de conformité des procédures de passation, d'exécution et de contrôle. Analyse des risques et des écarts réglementaires. Élaboration de recommandations opérationnelles." },
    { icon: '🎓', title: 'Formation professionnelle et accompagnement', text: "Ingénierie de formation : diagnostic des besoins, conception de modules, animation et évaluation. Renforcement des capacités organisationnelles." }
  ]), type: 'texte' },

  { page: 'accueil', section: 'formations_vedette', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'formations_vedette', cle: 'title', valeur: 'Nos Formations Vedettes', type: 'texte' },
  { page: 'accueil', section: 'formations_vedette', cle: 'cards', valeur: JSON.stringify([
    { icon: '⚖️', title: 'Marchés Publics', items: ['Procédures de passation des marchés publics', 'Suivi et exécution des marchés publics', 'Audit de conformité dans les marchés publics', 'Gestion des contrats / Partenariat public-privé'] },
    { icon: '📁', title: 'Gestion de Projet', items: ['Les fondamentaux de la Gestion de Projet', 'Suivi-évaluation des Projets et Programmes', 'Planification avec Ms Project'] },
    { icon: '💰', title: 'Finance Publique', items: ['Préparation et programmation budgétaire', 'Budget programme axé sur les résultats', 'Exécution et suivi budgétaire', 'Contrôle budgétaire'] }
  ]), type: 'texte' },
  { page: 'accueil', section: 'formations_vedette', cle: 'cta_text', valeur: 'Voir tout le catalogue', type: 'texte' },
  { page: 'accueil', section: 'formations_vedette', cle: 'cta_link', valeur: '/domaines', type: 'texte' },

  { page: 'accueil', section: 'clients', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'clients', cle: 'title', valeur: 'Ils nous font confiance', type: 'texte' },
  { page: 'accueil', section: 'clients', cle: 'list', valeur: JSON.stringify(['PAPSEN', 'DP World', 'ANAM', 'Eiffage Sénégal', 'OFOR', 'Sonatel', 'TDS', 'GCO/Eramet', 'ARTP', 'SONAGED', 'Hôpital de Tambacounda', '3FPT', 'PAGOTRANS/COM']), type: 'texte' },

  { page: 'accueil', section: 'cta', cle: 'active', valeur: 'true', type: 'boolean' },
  { page: 'accueil', section: 'cta', cle: 'title', valeur: 'Prêt à renforcer votre performance ?', type: 'texte' },
  { page: 'accueil', section: 'cta', cle: 'subtitle', valeur: 'Contactez-nous pour un devis personnalisé', type: 'texte' },
  { page: 'accueil', section: 'cta', cle: 'btn_text', valeur: 'Demander un Devis', type: 'texte' },
  { page: 'accueil', section: 'cta', cle: 'btn_link', valeur: '/contact', type: 'texte' },

  // --- A PROPOS ---
  { page: 'apropos', section: 'hero', cle: 'badge', valeur: '● À PROPOS — EXPERTISE SÉNÉGAL', type: 'texte' },
  { page: 'apropos', section: 'hero', cle: 'title_white', valeur: 'Un Cabinet au Service du', type: 'texte' },
  { page: 'apropos', section: 'hero', cle: 'title_gold', valeur: 'Développement', type: 'texte' },
  { page: 'apropos', section: 'hero', cle: 'subtitle', valeur: "Depuis 2016, nous mobilisons une expertise pluridisciplinaire au service des institutions publiques, des entreprises privées et des organisations de la société civile.", type: 'texte' },

  { page: 'apropos', section: 'presentation', cle: 'title', valeur: 'Qui sommes-nous ?', type: 'texte' },
  { page: 'apropos', section: 'presentation', cle: 'image', valeur: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80', type: 'image' },
  { page: 'apropos', section: 'presentation', cle: 'text', valeur: "Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire, spécialisé dans l'évaluation de projets, l'audit et contrôle, ainsi que dans le renforcement des capacités à travers la formation continue et l'assistance technique.\n\nFondé en 2016, le cabinet incarne une expertise éprouvée, mobilisant des experts hautement qualifiés au service des politiques publiques, des projets de développement et de la performance organisationnelle, aussi bien au Sénégal que dans la sous-région.", type: 'texte' },

  { page: 'apropos', section: 'vision', cle: 'title', valeur: 'Contribuer durablement au développement socio-économique', type: 'texte' },
  { page: 'apropos', section: 'vision', cle: 'subtitle', valeur: '— NOTRE VISION —', type: 'texte' },
  { page: 'apropos', section: 'vision', cle: 'cards', valeur: JSON.stringify([
    { icon: '🎯', text: 'Des compétences pointues et multidisciplinaires' },
    { icon: '🛠️', text: 'Des outils innovants et adaptés aux contextes locaux' },
    { icon: '📊', text: 'Des approches rigoureuses pour la conception, la gestion, le suivi-évaluation et le contrôle de projets et programmes' },
    { icon: '🎓', text: 'Des dispositifs de formation répondant aux besoins des institutions publiques, entreprises privées et organisations de la société civile' }
  ]), type: 'texte' },

  { page: 'apropos', section: 'atouts', cle: 'title', valeur: 'Ce qui nous distingue', type: 'texte' },
  { page: 'apropos', section: 'atouts', cle: 'subtitle', valeur: '— NOS ATOUTS —', type: 'texte' },
  { page: 'apropos', section: 'atouts', cle: 'cards', valeur: JSON.stringify([
    { icon: '👥', title: "Équipe d'experts seniors", desc: 'Solide expérience en management de projets, appui institutionnel et analyse des systèmes publics' },
    { icon: '🌐', title: 'Réseau structuré', desc: 'Consultants et formateurs spécialisés mobilisables selon les besoins spécifiques de chaque mission' },
    { icon: '🗂️', title: 'Base de données opérationnelle', desc: "Enquêteurs et opérateurs de saisie qualifiés pour des enquêtes et collectes de données à l'échelle nationale" }
  ]), type: 'texte' },

  { page: 'apropos', section: 'cta', cle: 'title', valeur: 'Travaillons ensemble', type: 'texte' },
  { page: 'apropos', section: 'cta', cle: 'subtitle', valeur: 'Contactez-nous pour discuter de vos besoins', type: 'texte' },
  { page: 'apropos', section: 'cta', cle: 'btn_text', valeur: 'Nous contacter', type: 'texte' },
  { page: 'apropos', section: 'cta', cle: 'btn_link', valeur: '/contact', type: 'texte' },

  // --- DOMAINES ---
  { page: 'domaines', section: 'hero', cle: 'badge', valeur: '● NOS DOMAINES — EXPERTISE SÉNÉGAL', type: 'texte' },
  { page: 'domaines', section: 'hero', cle: 'title_white', valeur: 'Nos Domaines', type: 'texte' },
  { page: 'domaines', section: 'hero', cle: 'title_gold', valeur: "d'Activité", type: 'texte' },
  { page: 'domaines', section: 'hero', cle: 'subtitle', valeur: "Nous intervenons dans 4 domaines complémentaires pour accompagner les institutions publiques, les entreprises privées et les organisations de la société civile.", type: 'texte' },

  { page: 'domaines', section: 'domaine1', cle: 'label', valeur: '— DOMAINE 1 —', type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'title', valeur: 'Études et Analyses Sectorielles', type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'intro', valeur: "Nous réalisons des études approfondies pour éclairer les décisions stratégiques et opérationnelles de nos clients.", type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'prestations', valeur: JSON.stringify(["Études de faisabilité, diagnostics territoriaux, socio-économiques ou institutionnels", "Analyses d'impact, capitalisation d'expériences et documentation de projets"]), type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'references', valeur: JSON.stringify(["Programme Agricole Italie Sénégal — Étude de faisabilité, Ziguinchor", "Ministère de l'Agriculture/PAPSEN — Étude intégration Genre", "Ministère du Pétrole — Programme National de Biogaz (2014-2020)"]), type: 'texte' },
  { page: 'domaines', section: 'domaine1', cle: 'active', valeur: 'true', type: 'boolean' },

  { page: 'domaines', section: 'domaine2', cle: 'label', valeur: '— DOMAINE 2 —', type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'title', valeur: 'Évaluation et Suivi de Projets', type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'intro', valeur: "Nous accompagnons les projets et programmes de développement à toutes les étapes de leur cycle de vie.", type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'prestations', valeur: JSON.stringify(["Évaluations ex-ante, à mi-parcours et finales de projets et programmes de développement", "Suivi-évaluation axé sur les résultats (GAR)", "Conception, mise en place et opérationnalisation de systèmes de suivi-évaluation"]), type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'references', valeur: JSON.stringify(["3FPT — Étude d'impact du financement des jeunes (BFI 2016-2021), 14 régions", "PAGOTRANS/COM — Évaluation finale du programme, Fonds Européen de Développement", "AGPBE — Évaluation annuelle du contrat de performance 2017", "UNMOCIR/Ministère Commerce — Évaluation à mi-parcours Projet Métrologie, 2021"]), type: 'texte' },
  { page: 'domaines', section: 'domaine2', cle: 'active', valeur: 'true', type: 'boolean' },

  { page: 'domaines', section: 'domaine3', cle: 'label', valeur: '— DOMAINE 3 —', type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'title', valeur: 'Audit de Conformité — Marchés Publics', type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'intro', valeur: "Nous analysons et évaluons les procédures de passation et d'exécution des marchés publics pour garantir la conformité réglementaire.", type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'prestations', valeur: JSON.stringify(["Audit de conformité des procédures de passation, d'exécution et de contrôle des marchés publics", "Analyse des risques, des dysfonctionnements et des écarts réglementaires", "Évaluation de la performance des systèmes de passation des marchés", "Élaboration de recommandations opérationnelles et de plans d'actions correctifs"]), type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'references', valeur: JSON.stringify(["PAPSEN — Audit de conformité des procédures et d'exécution des marchés publics, Décembre 2025", "PAPSEN — Formation sur les marchés publics à l'exécution, Février 2020", "PAGOTRANS/COM — Enquêtes de références secteur transports terrestres"]), type: 'texte' },
  { page: 'domaines', section: 'domaine3', cle: 'active', valeur: 'true', type: 'boolean' },

  { page: 'domaines', section: 'domaine4', cle: 'label', valeur: '— DOMAINE 4 —', type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'title', valeur: 'Formation Professionnelle et Accompagnement', type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'intro', valeur: "Notre pôle formation propose une offre diversifiée couvrant plusieurs domaines clés, avec des interventions adaptées aux besoins de chaque organisation.", type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'prestations', valeur: JSON.stringify(["Ingénierie de formation : élaboration de plans de formation et référentiels de compétences", "Formations intra-organisation : sessions sur mesure adaptées aux besoins de la structure", "Formations inter-organisations : séminaires d'excellence favorisant le partage d'expériences", "Formations sur site : déploiement d'ateliers pratiques directement dans vos locaux ou régions"]), type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'formats', valeur: JSON.stringify([
    { icon: '🏢', title: 'Intra-organisation', desc: 'Organisée au sein de la structure bénéficiaire, avec adaptation ciblée des contenus aux exigences spécifiques' },
    { icon: '🤝', title: 'Inter-organisations', desc: 'Pour les structures souhaitant former un nombre limité de participants' },
    { icon: '🗺️', title: 'Sur site national', desc: 'Déploiement dans l\'ensemble des 14 régions du Sénégal' }
  ]), type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'themes', valeur: JSON.stringify(['Finance Publique', 'Gestion de Projet', 'Marchés Publics', 'Soft Skills', 'Communication', 'Management', 'Informatique']), type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'references', valeur: JSON.stringify(["DP World — Informatique, Novembre 2025", "Eiffage Sénégal — Bureautique avancée, Mars 2024", "OFOR — Excel Avancé, Janvier 2024", "Sonatel — Business Plan Marketing & Marketing Stratégique, Janvier 2024", "TDS — Gestion du Stress et du Temps, Décembre 2023", "ANAM — Communication orale et Prise de parole, Octobre 2025"]), type: 'texte' },
  { page: 'domaines', section: 'domaine4', cle: 'active', valeur: 'true', type: 'boolean' },

  { page: 'domaines', section: 'cta', cle: 'title', valeur: "Besoin d'une expertise sur mesure ?", type: 'texte' },
  { page: 'domaines', section: 'cta', cle: 'subtitle', valeur: 'Contactez-nous pour discuter de votre projet', type: 'texte' },
  { page: 'domaines', section: 'cta', cle: 'btn_text', valeur: 'Demander un Devis', type: 'texte' },
  { page: 'domaines', section: 'cta', cle: 'btn_link', valeur: '/contact', type: 'texte' },

  // --- CONTACT ---
  { page: 'contact', section: 'hero', cle: 'badge', valeur: 'CONTACT - EXPERTISE SENEGAL', type: 'texte' },
  { page: 'contact', section: 'hero', cle: 'title_white', valeur: 'Contactez', type: 'texte' },
  { page: 'contact', section: 'hero', cle: 'title_gold', valeur: 'Notre Cabinet', type: 'texte' },
  { page: 'contact', section: 'hero', cle: 'subtitle', valeur: "Vous avez un projet, une mission ou une demande de formation ? Notre équipe est disponible pour vous accompagner.", type: 'texte' },
  { page: 'contact', section: 'formation', cle: 'badge', valeur: '- PÔLE FORMATION -', type: 'texte' },
  { page: 'contact', section: 'formation', cle: 'title', valeur: 'Demander une Formation', type: 'texte' },
  { page: 'contact', section: 'formation', cle: 'subtitle', valeur: "Expertise Sénégal propose des formations intra-organisation, inter-organisations et sur site dans toutes les régions du Sénégal.", type: 'texte' },
  { page: 'contact', section: 'cta', cle: 'title', valeur: 'Prêt à démarrer votre projet ?', type: 'texte' },
  { page: 'contact', section: 'cta', cle: 'subtitle', valeur: "Contactez-nous dès aujourd'hui pour un accompagnement personnalisé", type: 'texte' },

  // --- SEMINAIRES ---
  { page: 'seminaires', section: 'hero', cle: 'badge', valeur: 'SÉMINAIRES & FORMATIONS - EXPERTISE SÉNÉGAL', type: 'texte' },
  { page: 'seminaires', section: 'hero', cle: 'title', valeur: 'Séminaires & Formations', type: 'texte' },
  { page: 'seminaires', section: 'hero', cle: 'bg_image', valeur: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920', type: 'image' },
  { page: 'seminaires', section: 'hero', cle: 'subtitle', valeur: 'Retrouvez toutes nos formations continues, séminaires professionnels, appels à candidatures et actualités.', type: 'texte' }
];

async function seedDefaultContent() {
  try {
    const [[{ currentMax }]] = await db.query('SELECT COALESCE(MAX(id), 0) AS currentMax FROM contenu');
    let nextId = currentMax + 1;
    for (const item of defaultContent) {
      const [result] = await db.query(
        'INSERT IGNORE INTO contenu (id, page, section, cle, valeur, type) VALUES (?, ?, ?, ?, ?, ?)',
        [nextId, item.page, item.section, item.cle, item.valeur, item.type]
      );
      if (result.affectedRows > 0) nextId++;
    }
  } catch (error) {
    console.error('Error seeding contents:', error);
  }
}

router.get('/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contenu');
    const formatted = {};
    rows.forEach(item => {
      if (!formatted[item.page]) formatted[item.page] = {};
      if (!formatted[item.page][item.section]) formatted[item.page][item.section] = {};
      let val = item.valeur;
      if (item.type === 'boolean') val = item.valeur === 'true';
      else if (item.type === 'number') val = Number(item.valeur);
      formatted[item.page][item.section][item.cle] = val;
    });
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/save', authMiddleware, async (req, res) => {
  const { contents } = req.body;
  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ message: 'Données invalides.' });
  }
  try {
    for (const item of contents) {
      const { page, section, cle, valeur, type } = item;
      const [existing] = await db.query(
        'SELECT id FROM contenu WHERE page = ? AND section = ? AND cle = ?',
        [page, section, cle]
      );
      if (existing.length > 0) {
        await db.query(
          'UPDATE contenu SET valeur = ?, type = ? WHERE id = ?',
          [String(valeur), type || 'texte', existing[0].id]
        );
      } else {
        const [[{ nextId }]] = await db.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM contenu');
        await db.query(
          'INSERT INTO contenu (id, page, section, cle, valeur, type) VALUES (?, ?, ?, ?, ?, ?)',
          [nextId, page, section, cle, String(valeur), type || 'texte']
        );
      }
    }
    res.json({ message: 'Contenu mis à jour avec succès.' });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.get('/parametres', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT cle, valeur FROM parametres');
    const params = {};
    rows.forEach(r => { params[r.cle] = r.valeur; });
    res.json(params);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.put('/parametres', authMiddleware, async (req, res) => {
  const settings = req.body;
  try {
    for (const [cle, valeur] of Object.entries(settings)) {
      const [existing] = await db.query('SELECT id FROM parametres WHERE cle = ?', [cle]);
      if (existing.length > 0) {
        await db.query('UPDATE parametres SET valeur = ? WHERE id = ?', [String(valeur), existing[0].id]);
      } else {
        const [[{ nextId }]] = await db.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM parametres');
        await db.query('INSERT INTO parametres (id, cle, valeur) VALUES (?, ?, ?)', [nextId, cle, String(valeur)]);
      }
    }
    res.json({ message: 'Paramètres mis à jour avec succès.' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
module.exports.seedDefaultContent = seedDefaultContent;
