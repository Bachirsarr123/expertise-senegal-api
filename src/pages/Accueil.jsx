import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import ImageOptimisee from '../components/ImageOptimisee';
import './Accueil.css';

const API = 'https://expertise-senegal-api-olf5.onrender.com';
const apiClient = axios.create({ baseURL: API, timeout: 8000 });

const Accueil = () => {
  const [spotlight, setSpotlight] = useState(null);
  const [annonces, setAnnonces] = useState([]);

  // Hero
  const [heroBadge, setHeroBadge] = useState('● CABINET DE CONSEIL — DAKAR, SÉNÉGAL');
  const [heroTitleWhite, setHeroTitleWhite] = useState("L'Expertise Éprouvée au Service de");
  const [heroTitleGold, setHeroTitleGold] = useState('votre Performance');
  const [heroSubtitle, setHeroSubtitle] = useState("Cabinet de Formation, Conseil et Études pluridisciplinaire au Sénégal.");
  const [heroCtaPrimaryText, setHeroCtaPrimaryText] = useState('Demander un Devis');
  const [heroCtaPrimaryLink, setHeroCtaPrimaryLink] = useState('/contact');
  const [heroCtaSecondaryText, setHeroCtaSecondaryText] = useState('Découvrir le Cabinet');
  const [heroCtaSecondaryLink, setHeroCtaSecondaryLink] = useState('/a-propos');
  const [heroBgImage, setHeroBgImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80');

  // Stats
  const [stats, setStats] = useState([
    { num: '8+', lbl: "Années d'expérience confirmée" },
    { num: '100+', lbl: 'Missions réalisées avec succès' },
    { num: '14', lbl: 'Régions couvertes' },
    { num: '50+', lbl: 'Experts mobilisés dans le réseau' }
  ]);

  // About summary
  const [aboutTitle, setAboutTitle] = useState('Un Cabinet Pluridisciplinaire au Service du Développement');
  const [aboutText, setAboutText] = useState("Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire.");
  const [aboutImage, setAboutImage] = useState('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80');
  const [aboutBtnText, setAboutBtnText] = useState('En savoir plus');
  const [aboutBtnLink, setAboutBtnLink] = useState('/a-propos');

  // Domaines preview
  const [domainesTitle, setDomainesTitle] = useState("Nos Domaines d'Intervention");
  const [domainesCards, setDomainesCards] = useState([
    { icon: '📊', title: 'Études et analyses sectorielles', text: "Études de faisabilité, diagnostics territoriaux, socio-économiques ou institutionnels." },
    { icon: '📋', title: 'Évaluation et suivi de projets', text: "Évaluations ex-ante, à mi-parcours et finales. Suivi-évaluation axé sur les résultats." },
    { icon: '🔍', title: 'Audit de conformité — Marchés publics', text: "Audit de conformité des procédures de passation, d'exécution et de contrôle." },
    { icon: '🎓', title: 'Formation professionnelle et accompagnement', text: "Ingénierie de formation : diagnostic des besoins, conception de modules, animation." }
  ]);

  // Formations vedette
  const [formationsTitle, setFormationsTitle] = useState('Nos Formations Vedettes');
  const [formationsCards, setFormationsCards] = useState([
    { icon: '⚖️', title: 'Marchés Publics', items: ['Procédures de passation', 'Suivi et exécution', 'Audit de conformité'] },
    { icon: '📁', title: 'Gestion de Projet', items: ['Les fondamentaux', 'Suivi-évaluation', 'Ms Project'] },
    { icon: '💰', title: 'Finance Publique', items: ['Programmation budgétaire', 'Budget programme', 'Contrôle budgétaire'] }
  ]);
  const [formationsCtaText, setFormationsCtaText] = useState('Voir tout le catalogue');
  const [formationsCtaLink, setFormationsCtaLink] = useState('/domaines');

  // Clients
  const [clientsTitle, setClientsTitle] = useState('Ils nous font confiance');
  const [clientsList, setClientsList] = useState(['PAPSEN', 'DP World', 'ANAM', 'Eiffage Sénégal', 'OFOR', 'Sonatel', 'TDS', 'GCO/Eramet', 'ARTP', 'SONAGED', '3FPT', 'PAGOTRANS/COM']);

  // CTA
  const [ctaTitle, setCtaTitle] = useState('Prêt à renforcer votre performance ?');
  const [ctaSubtitle, setCtaSubtitle] = useState('Contactez-nous pour un devis personnalisé');
  const [ctaBtnText, setCtaBtnText] = useState('Demander un Devis');
  const [ctaBtnLink, setCtaBtnLink] = useState('/contact');

  useEffect(() => {
    fetchAnnonces();
    fetchContent();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await axios.get(`${API}/api/publications/public`);
      if (response.data.length > 0) {
        setSpotlight(response.data[0]);
        setAnnonces(response.data.slice(1, 4));
      }
    } catch (err) {}
  };

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`${API}/api/content/all`);
      const a = data.accueil || {};

      if (a.hero) {
        if (a.hero.badge) setHeroBadge(a.hero.badge);
        if (a.hero.title_white) setHeroTitleWhite(a.hero.title_white);
        if (a.hero.title_gold) setHeroTitleGold(a.hero.title_gold);
        if (a.hero.subtitle) setHeroSubtitle(a.hero.subtitle);
        if (a.hero.cta_primary_text) setHeroCtaPrimaryText(a.hero.cta_primary_text);
        if (a.hero.cta_primary_link) setHeroCtaPrimaryLink(a.hero.cta_primary_link);
        if (a.hero.cta_secondary_text) setHeroCtaSecondaryText(a.hero.cta_secondary_text);
        if (a.hero.cta_secondary_link) setHeroCtaSecondaryLink(a.hero.cta_secondary_link);
        if (a.hero.bg_image) setHeroBgImage(a.hero.bg_image);
      }

      if (a.stats) {
        setStats([
          { num: a.stats.stat1_num || '8+', lbl: a.stats.stat1_lbl || "Années d'expérience" },
          { num: a.stats.stat2_num || '100+', lbl: a.stats.stat2_lbl || 'Missions réalisées' },
          { num: a.stats.stat3_num || '14', lbl: a.stats.stat3_lbl || 'Régions couvertes' },
          { num: a.stats.stat4_num || '50+', lbl: a.stats.stat4_lbl || 'Experts mobilisés' }
        ]);
      }

      if (a.apropos) {
        if (a.apropos.title) setAboutTitle(a.apropos.title);
        if (a.apropos.text) setAboutText(a.apropos.text);
        if (a.apropos.image) setAboutImage(a.apropos.image);
        if (a.apropos.btn_text) setAboutBtnText(a.apropos.btn_text);
        if (a.apropos.btn_link) setAboutBtnLink(a.apropos.btn_link);
      }

      if (a.domaines) {
        if (a.domaines.title) setDomainesTitle(a.domaines.title);
        if (a.domaines.cards) {
          try { setDomainesCards(JSON.parse(a.domaines.cards)); } catch {}
        }
      }

      if (a.formations_vedette) {
        if (a.formations_vedette.title) setFormationsTitle(a.formations_vedette.title);
        if (a.formations_vedette.cards) {
          try { setFormationsCards(JSON.parse(a.formations_vedette.cards)); } catch {}
        }
        if (a.formations_vedette.cta_text) setFormationsCtaText(a.formations_vedette.cta_text);
        if (a.formations_vedette.cta_link) setFormationsCtaLink(a.formations_vedette.cta_link);
      }

      if (a.clients) {
        if (a.clients.title) setClientsTitle(a.clients.title);
        if (a.clients.list) {
          try { setClientsList(JSON.parse(a.clients.list)); } catch {}
        }
      }

      if (a.cta) {
        if (a.cta.title) setCtaTitle(a.cta.title);
        if (a.cta.subtitle) setCtaSubtitle(a.cta.subtitle);
        if (a.cta.btn_text) setCtaBtnText(a.cta.btn_text);
        if (a.cta.btn_link) setCtaBtnLink(a.cta.btn_link);
      }
    } catch (err) {
      console.warn('Could not load dynamic content.');
    }
  };

  return (
    <div className="accueil">
      <SEO
        title="Expertise Sénégal — Cabinet de Conseil, Études et Formation à Dakar"
        description="Cabinet pluridisciplinaire de conseil, d'études et de formation au Sénégal depuis 2016."
        url="https://www.expertisesenegal.com"
      />

      {/* HERO */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBgImage})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="dot"></span> {heroBadge}
          </div>
          <h1 className="hero-title">
            {heroTitleWhite} <span className="text-gold">{heroTitleGold}</span>
          </h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
          <div className="hero-actions">
            <Link to={heroCtaPrimaryLink} className="btn btn-primary hero-btn">
              {heroCtaPrimaryText} &rarr;
            </Link>
            <Link to={heroCtaSecondaryLink} className="btn btn-outline hero-btn">
              {heroCtaSecondaryText}
            </Link>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT */}
      {spotlight && (
        <section className="spotlight-section">
          <div className="container">
            <div className="spotlight-box">
              <div className="spotlight-badge-container">
                <span className="live-dot-pulse"></span>
                <span className="spotlight-badge-text">À LA UNE — DERNIÈRE ANNONCE</span>
              </div>
              <div className="spotlight-grid">
                <div className="spotlight-content">
                  <div className="spotlight-type-badge-container">
                    <span className={`spotlight-type-badge type-${spotlight.type}`}>
                      {spotlight.type === 'formation' ? '📚 Formation' :
                       spotlight.type === 'appel_candidature' ? '📣 Appel à candidatures' : '📰 Actualité'}
                    </span>
                  </div>
                  <h2 className="spotlight-title">{spotlight.titre}</h2>
                  <p className="spotlight-desc">{spotlight.description}</p>
                  <div className="spotlight-meta-grid">
                    {spotlight.date_debut && (
                      <div className="spotlight-meta-item">
                        <span className="meta-icon">📅</span>
                        <span>Dès le {new Date(spotlight.date_debut).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {spotlight.lieu && (
                      <div className="spotlight-meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{spotlight.lieu}</span>
                      </div>
                    )}
                  </div>
                  <div className="spotlight-cta-container">
                    <Link to={`/seminaires/${spotlight.id}`} className="btn btn-primary spotlight-btn">
                      Consulter &amp; S'inscrire &rarr;
                    </Link>
                  </div>
                </div>
                <div className="spotlight-visual">
                  <div className="spotlight-image-wrapper">
                    <ImageOptimisee
                      src={spotlight.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'}
                      alt={spotlight.titre}
                      className="spotlight-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CHIFFRES CLÉS */}
      <section className="chiffres-section section-padding">
        <div className="container">
          <div className="chiffres-grid">
            {stats.map((s, i) => (
              <div className="chiffre-card" key={i}>
                <h3 className="chiffre-number">{s.num}</h3>
                <p className="chiffre-text">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À PROPOS RÉSUMÉ */}
      <section className="apropos-section section-padding bg-light">
        <div className="container apropos-content">
          <div className="apropos-text">
            <h2 className="section-title text-left">{aboutTitle}</h2>
            {aboutText.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <Link to={aboutBtnLink} className="btn btn-primary mt-4">
              {aboutBtnText} &rarr;
            </Link>
          </div>
          <div className="apropos-image">
            <div className="image-wrapper">
              <ImageOptimisee src={aboutImage} alt="L'équipe d'Expertise Sénégal" />
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINES D'INTERVENTION */}
      <section className="domaines-section section-padding bg-dark">
        <div className="container">
          <h2 className="section-title text-white">{domainesTitle}</h2>
          <div className="domaines-grid">
            {domainesCards.map((card, i) => (
              <div className="domaine-card" key={i}>
                <div className="domaine-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLICATIONS DYNAMIQUES */}
      {annonces.length > 0 && (
        <section className="dynamic-annonces-section section-padding bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-badge">— SÉMINAIRES & FORMATIONS —</span>
              <h2 className="section-title">Nos Prochains Séminaires, Formations & Actualités</h2>
            </div>
            <div className="annonces-grid">
              {annonces.map(item => {
                let badgeLabel = '📚 Formation';
                let badgeClass = 'badge-formation';
                if (item.type === 'appel_candidature') { badgeLabel = '📣 Appel à candidatures'; badgeClass = 'badge-appel'; }
                else if (item.type === 'actualite') { badgeLabel = '📰 Actualité'; badgeClass = 'badge-actualite'; }
                return (
                  <div key={item.id} className="annonce-card">
                    <div className="annonce-img-container">
                      <ImageOptimisee
                        src={item.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'}
                        alt={item.titre}
                        className="annonce-img"
                      />
                      <span className={`annonce-badge ${badgeClass}`}>{badgeLabel}</span>
                    </div>
                    <div className="annonce-body">
                      <h3 className="annonce-title">{item.titre}</h3>
                      <p className="annonce-desc">{item.description}</p>
                      <div className="annonce-footer" style={{ marginTop: '16px', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                        <Link to={`/seminaires/${item.id}`} className="annonce-link" style={{ color: 'var(--or)', fontWeight: 600, textDecoration: 'none' }}>
                          En savoir plus &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-5">
              <Link to="/seminaires" className="btn btn-secondary">Voir tout &rarr;</Link>
            </div>
          </div>
        </section>
      )}

      {/* FORMATIONS VEDETTE */}
      <section className="formations-section section-padding">
        <div className="container">
          <h2 className="section-title">{formationsTitle}</h2>
          <div className="formations-grid">
            {formationsCards.map((card, i) => (
              <div className="formation-card" key={i}>
                <div className="formation-header">
                  <span className="formation-icon">{card.icon}</span>
                  <h3>{card.title}</h3>
                </div>
                <ul className="formation-list">
                  {(card.items || []).map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to={formationsCtaLink} className="btn btn-outline text-dark border-dark">
              {formationsCtaText}
            </Link>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="clients-section section-padding bg-light">
        <div className="container">
          <h2 className="section-title">{clientsTitle}</h2>
          <div className="clients-grid">
            {clientsList.map((client, i) => (
              <div className="client-badge" key={i}>{client}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section-padding">
        <div className="container cta-content">
          <h2 className="cta-title">{ctaTitle}</h2>
          <p className="cta-subtitle">{ctaSubtitle}</p>
          <Link to={ctaBtnLink} className="btn btn-secondary btn-lg">
            {ctaBtnText} &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
