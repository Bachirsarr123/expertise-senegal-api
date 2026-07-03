import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import './Domaines.css';

const API = 'https://expertise-senegal-api-olf5.onrender.com';
const apiClient = axios.create({ baseURL: API, timeout: 8000 });

const Domaines = () => {
  const [heroBadge, setHeroBadge] = useState('● NOS DOMAINES — EXPERTISE SÉNÉGAL');
  const [heroTitleWhite, setHeroTitleWhite] = useState('Nos Domaines');
  const [heroTitleGold, setHeroTitleGold] = useState("d'Activité");
  const [heroSubtitle, setHeroSubtitle] = useState("Nous intervenons dans 4 domaines complémentaires pour accompagner les institutions publiques, les entreprises privées et les organisations de la société civile.");

  const defaultDomaine = (n, label, title, intro, prestations, references) => ({
    label, title, intro,
    prestations: prestations || [],
    references: references || [],
    formats: [],
    themes: [],
    active: true
  });

  const [domaines, setDomaines] = useState({
    domaine1: defaultDomaine(1, '— DOMAINE 1 —', 'Études et Analyses Sectorielles', "Nous réalisons des études approfondies pour éclairer les décisions stratégiques.", [], []),
    domaine2: defaultDomaine(2, '— DOMAINE 2 —', 'Évaluation et Suivi de Projets', "Nous accompagnons les projets et programmes à toutes les étapes de leur cycle de vie.", [], []),
    domaine3: defaultDomaine(3, '— DOMAINE 3 —', 'Audit de Conformité — Marchés Publics', "Nous analysons les procédures de passation et d'exécution des marchés publics.", [], []),
    domaine4: {
      label: '— DOMAINE 4 —',
      title: 'Formation Professionnelle et Accompagnement',
      intro: "Notre pôle formation propose une offre diversifiée couvrant plusieurs domaines clés.",
      prestations: [],
      references: [],
      formats: [
        { icon: '🏢', title: 'Intra-organisation', desc: 'Organisée au sein de la structure bénéficiaire, avec adaptation ciblée des contenus' },
        { icon: '🤝', title: 'Inter-organisations', desc: 'Pour les structures souhaitant former un nombre limité de participants' },
        { icon: '🗺️', title: 'Sur site national', desc: "Déploiement dans l'ensemble des 14 régions du Sénégal" }
      ],
      themes: ['Finance Publique', 'Gestion de Projet', 'Marchés Publics', 'Soft Skills', 'Communication', 'Management', 'Informatique'],
      active: true
    }
  });

  const [ctaTitle, setCtaTitle] = useState("Besoin d'une expertise sur mesure ?");
  const [ctaSubtitle, setCtaSubtitle] = useState('Contactez-nous pour discuter de votre projet');
  const [ctaBtnText, setCtaBtnText] = useState('Demander un Devis');
  const [ctaBtnLink, setCtaBtnLink] = useState('/contact');

  useEffect(() => {
    fetchContent();
  }, []);

  const parseJson = (str, fallback) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`${API}/api/content/all`);
      const d = data.domaines || {};

      if (d.hero) {
        if (d.hero.badge) setHeroBadge(d.hero.badge);
        if (d.hero.title_white) setHeroTitleWhite(d.hero.title_white);
        if (d.hero.title_gold) setHeroTitleGold(d.hero.title_gold);
        if (d.hero.subtitle) setHeroSubtitle(d.hero.subtitle);
      }

      if (d.cta) {
        if (d.cta.title) setCtaTitle(d.cta.title);
        if (d.cta.subtitle) setCtaSubtitle(d.cta.subtitle);
        if (d.cta.btn_text) setCtaBtnText(d.cta.btn_text);
        if (d.cta.btn_link) setCtaBtnLink(d.cta.btn_link);
      }

      const updated = { ...domaines };
      ['domaine1', 'domaine2', 'domaine3', 'domaine4'].forEach(key => {
        if (d[key]) {
          updated[key] = {
            label: d[key].label || updated[key].label,
            title: d[key].title || updated[key].title,
            intro: d[key].intro || updated[key].intro,
            active: d[key].active !== false,
            prestations: parseJson(d[key].prestations, updated[key].prestations),
            references: parseJson(d[key].references, updated[key].references),
            formats: parseJson(d[key].formats, updated[key].formats || []),
            themes: parseJson(d[key].themes, updated[key].themes || [])
          };
        }
      });
      setDomaines(updated);
    } catch (err) {
      console.warn('Could not load dynamic content.');
    }
  };

  const renderDomaine = (key, bgClass, isReverse, isDark) => {
    const dom = domaines[key];
    if (!dom.active) return null;

    return (
      <section id={key.replace('domaine', 'domaine-')} className={`domaine-section section-padding ${bgClass}`} key={key}>
        <div className={`container domaine-container ${isReverse ? 'reverse-layout' : ''}`}>
          <div className="domaine-text-col layout-60">
            <span className="label-gold">{dom.label}</span>
            <h2 className={`domaine-title mt-2 ${isDark ? 'text-white' : ''}`}>{dom.title}</h2>
            <p className={`domaine-intro ${isDark ? 'text-white-opacity' : ''}`}>{dom.intro}</p>
            <ul className={`domaine-list ${isDark ? 'list-white' : ''}`}>
              {dom.prestations.map((p, i) => <li key={i}>{p}</li>)}
            </ul>

            {key === 'domaine4' && dom.formats.length > 0 && (
              <div className="formats-grid mt-4">
                {dom.formats.map((f, i) => (
                  <div className="format-card" key={i}>
                    <div className="format-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {key === 'domaine4' && dom.themes.length > 0 && (
              <div className="themes-section mt-5">
                <h3 className="themes-title">Thèmes de formation</h3>
                <div className="themes-badges">
                  {dom.themes.map((t, i) => (
                    <span className="theme-badge" key={i}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="domaine-ref-col layout-40">
            <div className={`ref-card ${isDark ? 'dark-mode' : ''}`}>
              <h3 className={`ref-title ${isDark ? 'text-white' : ''}`}>Références liées :</h3>
              <ul className={`ref-list ${isDark ? 'text-white-opacity' : ''}`}>
                {dom.references.map((ref, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: ref.replace(/^([^—]+)—/, '<strong>$1</strong>—') }} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="domaines-page">
      <SEO
        title="Domaines d'Activité — Études, Conseil, Audit, Formation | Expertise Sénégal"
        description="4 domaines d'expertise : études sectorielles, évaluation de projets, audit des marchés publics et formation professionnelle au Sénégal."
        url="https://www.expertisesenegal.com/domaines"
      />

      {/* HERO */}
      <section className="domaines-hero">
        <div className="container domaines-hero-content">
          <div className="hero-badge">
            <span className="dot"></span> {heroBadge}
          </div>
          <h1 className="hero-title">
            {heroTitleWhite} <span className="text-gold">{heroTitleGold}</span>
          </h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
        </div>
      </section>

      {renderDomaine('domaine1', 'bg-white', false, false)}
      {renderDomaine('domaine2', 'bg-light', true, false)}
      {renderDomaine('domaine3', 'bg-dark text-white', false, true)}
      {renderDomaine('domaine4', 'bg-light', true, false)}

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

export default Domaines;
