import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Domaines.css';

const Domaines = () => {
  return (
    <div className="domaines-page">
      <SEO 
        title="Domaines d'Activité — Études, Conseil, Audit, Formation | Expertise Sénégal"
        description="4 domaines d'expertise : études sectorielles, évaluation de projets, audit des marchés publics et formation professionnelle au Sénégal et en Afrique de l'Ouest."
        url="https://www.expertisesenegal.com/domaines"
      />
      {/* 1. HERO DE PAGE */}
      <section className="domaines-hero">
        <div className="container domaines-hero-content">
          <div className="hero-badge">
            <span className="dot"></span> NOS DOMAINES — EXPERTISE SÉNÉGAL
          </div>
          <h1 className="hero-title">
            Nos Domaines <span className="text-gold">d'Activité</span>
          </h1>
          <p className="hero-subtitle">
            Nous intervenons dans 4 domaines complémentaires pour accompagner les institutions publiques, les entreprises privées et les organisations de la société civile.
          </p>
        </div>
      </section>

      {/* 2. DOMAINE 1 */}
      <section id="domaine-1" className="domaine-section section-padding bg-white">
        <div className="container domaine-container">
          <div className="domaine-text-col layout-60">
            <span className="label-gold">— DOMAINE 1 —</span>
            <h2 className="domaine-title mt-2">Études et Analyses Sectorielles</h2>
            <p className="domaine-intro">
              Nous réalisons des études approfondies pour éclairer les décisions stratégiques et opérationnelles de nos clients.
            </p>
            <ul className="domaine-list">
              <li>Études de faisabilité, diagnostics territoriaux, socio-économiques ou institutionnels</li>
              <li>Analyses d’impact, capitalisation d’expériences et documentation de projets</li>
            </ul>
          </div>
          <div className="domaine-ref-col layout-40">
            <div className="ref-card">
              <h3 className="ref-title">Références liées :</h3>
              <ul className="ref-list">
                <li>
                  <strong>Programme Agricole Italie Sénégal</strong> — Étude de faisabilité, Ziguinchor
                </li>
                <li>
                  <strong>Ministère de l’Agriculture/PAPSEN</strong> — Étude intégration Genre
                </li>
                <li>
                  <strong>Ministère du Pétrole</strong> — Programme National de Biogaz (2014-2020)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOMAINE 2 */}
      <section id="domaine-2" className="domaine-section section-padding bg-light">
        <div className="container domaine-container reverse-layout">
          <div className="domaine-text-col layout-60">
            <span className="label-gold">— DOMAINE 2 —</span>
            <h2 className="domaine-title mt-2">Évaluation et Suivi de Projets</h2>
            <p className="domaine-intro">
              Nous accompagnons les projets et programmes de développement à toutes les étapes de leur cycle de vie.
            </p>
            <ul className="domaine-list">
              <li>Évaluations ex-ante, à mi-parcours et finales de projets et programmes de développement</li>
              <li>Suivi-évaluation axé sur les résultats (GAR)</li>
              <li>Conception, mise en place et opérationnalisation de systèmes de suivi-évaluation</li>
            </ul>
          </div>
          <div className="domaine-ref-col layout-40">
            <div className="ref-card">
              <h3 className="ref-title">Références liées :</h3>
              <ul className="ref-list">
                <li>
                  <strong>3FPT</strong> — Étude d’impact du financement des jeunes (BFI 2016-2021), 14 régions
                </li>
                <li>
                  <strong>PAGOTRANS/COM</strong> — Évaluation finale du programme, Fonds Européen de Développement
                </li>
                <li>
                  <strong>PAGOTRANS/COM</strong> — Évaluation à mi-parcours
                </li>
                <li>
                  <strong>AGPBE</strong> — Évaluation annuelle du contrat de performance 2017
                </li>
                <li>
                  <strong>UNMOCIR/Ministère Commerce</strong> — Évaluation à mi-parcours Projet Métrologie, 2021
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOMAINE 3 */}
      <section id="domaine-3" className="domaine-section section-padding bg-dark text-white">
        <div className="container domaine-container">
          <div className="domaine-text-col layout-60">
            <span className="label-gold">— DOMAINE 3 —</span>
            <h2 className="domaine-title text-white mt-2">Audit de Conformité — Marchés Publics</h2>
            <p className="domaine-intro text-white-opacity">
              Nous analysons et évaluons les procédures de passation et d’exécution des marchés publics pour garantir la conformité réglementaire.
            </p>
            <ul className="domaine-list list-white">
              <li>Audit de conformité des procédures de passation, d’exécution et de contrôle des marchés publics</li>
              <li>Analyse des risques, des dysfonctionnements et des écarts réglementaires</li>
              <li>Évaluation de la performance des systèmes de passation des marchés</li>
              <li>Élaboration de recommandations opérationnelles et de plans d’actions correctifs</li>
            </ul>
          </div>
          <div className="domaine-ref-col layout-40">
            <div className="ref-card dark-mode">
              <h3 className="ref-title text-white">Références liées :</h3>
              <ul className="ref-list text-white-opacity">
                <li>
                  <strong className="text-white">PAPSEN</strong> — Audit de conformité des procédures et d’exécution des marchés publics, Décembre 2025
                </li>
                <li>
                  <strong className="text-white">PAPSEN</strong> — Formation sur les marchés publics à l’exécution, Février 2020
                </li>
                <li>
                  <strong className="text-white">PAGOTRANS/COM</strong> — Enquêtes de références secteur transports terrestres
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DOMAINE 4 */}
      <section id="domaine-4" className="domaine-section section-padding bg-light">
        <div className="container domaine-container reverse-layout mb-5">
          <div className="domaine-text-col layout-60">
            <span className="label-gold">— DOMAINE 4 —</span>
            <h2 className="domaine-title mt-2">Formation Professionnelle et Accompagnement</h2>
            <p className="domaine-intro">
              Notre pôle formation propose une offre diversifiée couvrant plusieurs domaines clés, avec des interventions adaptées aux besoins de chaque organisation.
            </p>
            
            <div className="formats-grid mt-4">
              <div className="format-card">
                <div className="format-icon">🏢</div>
                <h4>Intra-organisation</h4>
                <p>Organisée au sein de la structure bénéficiaire, avec adaptation ciblée des contenus aux exigences spécifiques</p>
              </div>
              <div className="format-card">
                <div className="format-icon">🤝</div>
                <h4>Inter-organisations</h4>
                <p>Pour les structures souhaitant former un nombre limité de participants</p>
              </div>
              <div className="format-card">
                <div className="format-icon">🗺️</div>
                <h4>Sur site national</h4>
                <p>Déploiement dans l’ensemble des 14 régions du Sénégal</p>
              </div>
            </div>

            <div className="themes-section mt-5">
              <h3 className="themes-title">Thèmes de formation</h3>
              <div className="themes-badges">
                <span className="theme-badge">Finance Publique</span>
                <span className="theme-badge">Gestion de Projet</span>
                <span className="theme-badge">Marchés Publics</span>
                <span className="theme-badge">Soft Skills</span>
                <span className="theme-badge">Communication</span>
                <span className="theme-badge">Management</span>
                <span className="theme-badge">Informatique</span>
              </div>
            </div>
          </div>

          <div className="domaine-ref-col layout-40">
            <div className="ref-card">
              <h3 className="ref-title">Références liées :</h3>
              <ul className="ref-list">
                <li><strong>DP World</strong> — Informatique, Novembre 2025</li>
                <li><strong>Eiffage Sénégal</strong> — Bureautique avancée, Mars 2024</li>
                <li><strong>OFOR</strong> — Excel Avancé, Janvier 2024</li>
                <li><strong>Sonatel</strong> — Business Plan Marketing & Marketing Stratégique, Janvier 2024</li>
                <li><strong>TDS</strong> — Gestion du Stress et du Temps, Décembre 2023</li>
                <li><strong>ANAM</strong> — Communication orale et Prise de parole, Octobre 2025</li>
                <li><strong>GCO/Eramet</strong> — Communication interpersonnelle, 2018-2020</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="cta-section section-padding">
        <div className="container cta-content">
          <h2 className="cta-title">Besoin d’une expertise sur mesure ?</h2>
          <p className="cta-subtitle">Contactez-nous pour discuter de votre projet</p>
          <Link to="/contact" className="btn btn-secondary btn-lg">
            Demander un Devis &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Domaines;
