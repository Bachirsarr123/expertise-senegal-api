import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import ImageOptimisee from '../components/ImageOptimisee';
import './APropos.css';

const API = 'https://expertise-senegal-api-olf5.onrender.com';

const APropos = () => {
  const [heroBadge, setHeroBadge] = useState('● À PROPOS — EXPERTISE SÉNÉGAL');
  const [heroTitleWhite, setHeroTitleWhite] = useState('Un Cabinet au Service du');
  const [heroTitleGold, setHeroTitleGold] = useState('Développement');
  const [heroSubtitle, setHeroSubtitle] = useState("Depuis 2016, nous mobilisons une expertise pluridisciplinaire au service des institutions publiques, des entreprises privées et des organisations de la société civile.");

  const [presentationTitle, setPresentationTitle] = useState('Qui sommes-nous ?');
  const [presentationText, setPresentationText] = useState("Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire, spécialisé dans l'évaluation de projets, l'audit et contrôle, ainsi que dans le renforcement des capacités à travers la formation continue et l'assistance technique.");
  const [presentationImage, setPresentationImage] = useState('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80');

  const [visionTitle, setVisionTitle] = useState('Contribuer durablement au développement socio-économique');
  const [visionSubtitle, setVisionSubtitle] = useState('— NOTRE VISION —');
  const [visionCards, setVisionCards] = useState([
    { icon: '🎯', text: 'Des compétences pointues et multidisciplinaires' },
    { icon: '🛠️', text: 'Des outils innovants et adaptés aux contextes locaux' },
    { icon: '📊', text: 'Des approches rigoureuses pour la conception, la gestion, le suivi-évaluation et le contrôle de projets et programmes' },
    { icon: '🎓', text: "Des dispositifs de formation répondant aux besoins des institutions publiques, entreprises privées et organisations de la société civile" }
  ]);

  const [atoutsTitle, setAtoutsTitle] = useState('Ce qui nous distingue');
  const [atoutsSubtitle, setAtoutsSubtitle] = useState('— NOS ATOUTS —');
  const [atoutsCards, setAtoutsCards] = useState([
    { icon: '👥', title: "Équipe d'experts seniors", desc: 'Solide expérience en management de projets, appui institutionnel et analyse des systèmes publics' },
    { icon: '🌐', title: 'Réseau structuré', desc: 'Consultants et formateurs spécialisés mobilisables selon les besoins spécifiques de chaque mission' },
    { icon: '🗂️', title: 'Base de données opérationnelle', desc: "Enquêteurs et opérateurs de saisie qualifiés pour des enquêtes et collectes de données à l'échelle nationale" }
  ]);

  // Données administratives
  const [directorName, setDirectorName] = useState('Boussirou DIALLO');
  const [legalForm, setLegalForm] = useState('SARL');
  const [address, setAddress] = useState('75 C Cité Keur Gorgui, Dakar, Sénégal');
  const [phone, setPhone] = useState('33 823 54 52 — 77 643 41 60');
  const [emailContact, setEmailContact] = useState('contact@expertisesenegal.com');
  const [rc, setRc] = useState('SN.DKR.2016.B.26579');
  const [ninea, setNinea] = useState('006146642 2V2');

  const [ctaTitle, setCtaTitle] = useState('Travaillons ensemble');
  const [ctaSubtitle, setCtaSubtitle] = useState('Contactez-nous pour discuter de vos besoins');
  const [ctaBtnText, setCtaBtnText] = useState('Nous contacter');
  const [ctaBtnLink, setCtaBtnLink] = useState('/contact');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [contentRes, paramsRes] = await Promise.all([
        axios.get(`${API}/api/content/all`),
        axios.get(`${API}/api/content/parametres`)
      ]);
      const ap = contentRes.data.apropos || {};
      const params = paramsRes.data;

      if (ap.hero) {
        if (ap.hero.badge) setHeroBadge(ap.hero.badge);
        if (ap.hero.title_white) setHeroTitleWhite(ap.hero.title_white);
        if (ap.hero.title_gold) setHeroTitleGold(ap.hero.title_gold);
        if (ap.hero.subtitle) setHeroSubtitle(ap.hero.subtitle);
      }
      if (ap.presentation) {
        if (ap.presentation.title) setPresentationTitle(ap.presentation.title);
        if (ap.presentation.text) setPresentationText(ap.presentation.text);
        if (ap.presentation.image) setPresentationImage(ap.presentation.image);
      }
      if (ap.vision) {
        if (ap.vision.title) setVisionTitle(ap.vision.title);
        if (ap.vision.subtitle) setVisionSubtitle(ap.vision.subtitle);
        if (ap.vision.cards) {
          try { setVisionCards(JSON.parse(ap.vision.cards)); } catch {}
        }
      }
      if (ap.atouts) {
        if (ap.atouts.title) setAtoutsTitle(ap.atouts.title);
        if (ap.atouts.subtitle) setAtoutsSubtitle(ap.atouts.subtitle);
        if (ap.atouts.cards) {
          try { setAtoutsCards(JSON.parse(ap.atouts.cards)); } catch {}
        }
      }
      if (ap.cta) {
        if (ap.cta.title) setCtaTitle(ap.cta.title);
        if (ap.cta.subtitle) setCtaSubtitle(ap.cta.subtitle);
        if (ap.cta.btn_text) setCtaBtnText(ap.cta.btn_text);
        if (ap.cta.btn_link) setCtaBtnLink(ap.cta.btn_link);
      }

      if (params.director_name) setDirectorName(params.director_name);
      if (params.legal_form) setLegalForm(params.legal_form);
      if (params.contact_address) setAddress(params.contact_address);
      if (params.contact_phone) setPhone(params.contact_phone);
      if (params.contact_email) setEmailContact(params.contact_email);
      if (params.legal_rc) setRc(params.legal_rc);
      if (params.legal_ninea) setNinea(params.legal_ninea);
    } catch (err) {
      console.warn('Could not load dynamic content.');
    }
  };

  return (
    <div className="apropos-page">
      <SEO
        title="À Propos — Expertise Sénégal | Cabinet fondé en 2016 à Dakar"
        description="Découvrez Expertise Sénégal, cabinet pluridisciplinaire fondé en 2016. Notre vision, nos atouts et notre équipe d'experts seniors."
        url="https://www.expertisesenegal.com/a-propos"
      />

      {/* HERO */}
      <section className="apropos-hero">
        <div className="container apropos-hero-content">
          <div className="hero-badge">
            <span className="dot"></span> {heroBadge}
          </div>
          <h1 className="hero-title">
            {heroTitleWhite} <span className="text-gold">{heroTitleGold}</span>
          </h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
        </div>
      </section>

      {/* PRÉSENTATION */}
      <section className="presentation-section section-padding bg-white">
        <div className="container presentation-content">
          <div className="presentation-text">
            <h2 className="section-title text-left">{presentationTitle}</h2>
            {presentationText.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="presentation-image">
            <ImageOptimisee
              src={presentationImage}
              alt="Notre équipe au travail"
              className="img-fluid rounded shadow"
              style={{ borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="vision-section section-padding bg-light">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="label-gold">{visionSubtitle}</span>
            <h2 className="section-title mt-2">{visionTitle}</h2>
          </div>
          <div className="vision-grid">
            {visionCards.map((card, i) => (
              <div className="vision-card" key={i}>
                <div className="vision-icon">{card.icon}</div>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATOUTS */}
      <section className="atouts-section section-padding bg-dark">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="label-gold">{atoutsSubtitle}</span>
            <h2 className="section-title text-white mt-2">{atoutsTitle}</h2>
          </div>
          <div className="atouts-grid">
            {atoutsCards.map((atout, i) => (
              <div className="atout-card" key={i}>
                <div className="atout-icon">{atout.icon}</div>
                <h3 className="atout-title">{atout.title}</h3>
                <p className="atout-desc">{atout.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONNÉES ADMINISTRATIVES */}
      <section className="admin-section section-padding bg-white">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="label-gold">— INFORMATIONS LÉGALES —</span>
            <h2 className="section-title mt-2">Données Administratives</h2>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <tbody>
                <tr>
                  <td className="admin-icon">👤</td>
                  <td className="admin-label">Directeur</td>
                  <td className="admin-value fw-bold">{directorName}</td>
                </tr>
                <tr>
                  <td className="admin-icon">🏢</td>
                  <td className="admin-label">Forme juridique</td>
                  <td className="admin-value">{legalForm}</td>
                </tr>
                <tr>
                  <td className="admin-icon">📍</td>
                  <td className="admin-label">Adresse</td>
                  <td className="admin-value">{address}</td>
                </tr>
                <tr>
                  <td className="admin-icon">📞</td>
                  <td className="admin-label">Téléphone</td>
                  <td className="admin-value">{phone}</td>
                </tr>
                <tr>
                  <td className="admin-icon">✉️</td>
                  <td className="admin-label">Email</td>
                  <td className="admin-value">{emailContact}</td>
                </tr>
                <tr>
                  <td className="admin-icon">📋</td>
                  <td className="admin-label">N° RC</td>
                  <td className="admin-value">{rc}</td>
                </tr>
                <tr>
                  <td className="admin-icon">🔢</td>
                  <td className="admin-label">NINEA</td>
                  <td className="admin-value">{ninea}</td>
                </tr>
              </tbody>
            </table>
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

export default APropos;
