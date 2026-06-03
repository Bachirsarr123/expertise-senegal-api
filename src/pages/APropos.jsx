import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ImageOptimisee from '../components/ImageOptimisee';
import './APropos.css';

const APropos = () => {
  return (
    <div className="apropos-page">
      <SEO 
        title="À Propos — Expertise Sénégal | Cabinet fondé en 2016 à Dakar"
        description="Découvrez Expertise Sénégal, cabinet pluridisciplinaire fondé en 2016 par Boussirou DIALLO. Notre vision, nos atouts et notre équipe d'experts seniors."
        url="https://www.expertisesenegal.com/a-propos"
      />
      {/* 1. HERO DE PAGE */}
      <section className="apropos-hero">
        <div className="container apropos-hero-content">
          <div className="hero-badge">
            <span className="dot"></span> À PROPOS — EXPERTISE SÉNÉGAL
          </div>
          <h1 className="hero-title">
            Un Cabinet au Service du <span className="text-gold">Développement</span>
          </h1>
          <p className="hero-subtitle">
            Depuis 2016, nous mobilisons une expertise pluridisciplinaire au service des institutions publiques, des entreprises privées et des organisations de la société civile.
          </p>
        </div>
      </section>

      {/* 2. PRÉSENTATION GÉNÉRALE */}
      <section className="presentation-section section-padding bg-white">
        <div className="container presentation-content">
          <div className="presentation-text">
            <h2 className="section-title text-left">Qui sommes-nous ?</h2>
            <p>
              Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire, spécialisé dans l’évaluation de projets, l’audit et contrôle, ainsi que dans le renforcement des capacités à travers la formation continue et l’assistance technique.
            </p>
            <p>
              Fondé en 2016, le cabinet incarne une expertise éprouvée, mobilisée au service des politiques publiques, des projets de développement et de la performance organisationnelle, aussi bien au Sénégal que dans la sous-région.
            </p>
          </div>
          <div className="presentation-image">
            <ImageOptimisee
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
              alt="Notre équipe au travail"
              className="img-fluid rounded shadow"
              style={{ borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {/* 3. NOTRE VISION */}
      <section className="vision-section section-padding bg-light">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="label-gold">— NOTRE VISION —</span>
            <h2 className="section-title mt-2">Contribuer durablement au développement socio-économique</h2>
          </div>
          <div className="vision-grid">
            <div className="vision-card">
              <div className="vision-icon">🎯</div>
              <p>Des compétences pointues et multidisciplinaires</p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">🛠️</div>
              <p>Des outils innovants et adaptés aux contextes locaux</p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">📊</div>
              <p>Des approches rigoureuses pour la conception, la gestion, le suivi-évaluation et le contrôle de projets et programmes</p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">🎓</div>
              <p>Des dispositifs de formation répondant aux besoins des institutions publiques, entreprises privées et organisations de la société civile</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NOS ATOUTS */}
      <section className="atouts-section section-padding bg-dark">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="label-gold">— NOS ATOUTS —</span>
            <h2 className="section-title text-white mt-2">Ce qui nous distingue</h2>
          </div>
          <div className="atouts-grid">
            <div className="atout-card">
              <div className="atout-icon">👥</div>
              <h3 className="atout-title">Équipe d’experts seniors</h3>
              <p className="atout-desc">Solide expérience en management de projets, appui institutionnel et analyse des systèmes publics</p>
            </div>
            <div className="atout-card">
              <div className="atout-icon">🌐</div>
              <h3 className="atout-title">Réseau structuré</h3>
              <p className="atout-desc">Consultants et formateurs spécialisés mobilisables selon les besoins spécifiques de chaque mission</p>
            </div>
            <div className="atout-card">
              <div className="atout-icon">🗂️</div>
              <h3 className="atout-title">Base de données opérationnelle</h3>
              <p className="atout-desc">Enquêteurs et opérateurs de saisie qualifiés pour des enquêtes et collectes de données à l’échelle nationale</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DONNÉES ADMINISTRATIVES */}
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
                  <td className="admin-value fw-bold">Boussirou DIALLO</td>
                </tr>
                <tr>
                  <td className="admin-icon">🏢</td>
                  <td className="admin-label">Forme juridique</td>
                  <td className="admin-value">SARL</td>
                </tr>
                <tr>
                  <td className="admin-icon">📍</td>
                  <td className="admin-label">Adresse</td>
                  <td className="admin-value">75 C Cité Keur Gorgui, Dakar, Sénégal</td>
                </tr>
                <tr>
                  <td className="admin-icon">📞</td>
                  <td className="admin-label">Téléphone</td>
                  <td className="admin-value">33 823 54 52 — 77 643 41 60</td>
                </tr>
                <tr>
                  <td className="admin-icon">✉️</td>
                  <td className="admin-label">Email</td>
                  <td className="admin-value">contact@expertisesenegal.com</td>
                </tr>
                <tr>
                  <td className="admin-icon">📋</td>
                  <td className="admin-label">N° RC</td>
                  <td className="admin-value">SN.DKR.2016.B.26579</td>
                </tr>
                <tr>
                  <td className="admin-icon">🔢</td>
                  <td className="admin-label">NINEA</td>
                  <td className="admin-value">006146642 2V2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="cta-section section-padding">
        <div className="container cta-content">
          <h2 className="cta-title">Travaillons ensemble</h2>
          <p className="cta-subtitle">Contactez-nous pour discuter de vos besoins</p>
          <Link to="/contact" className="btn btn-secondary btn-lg">
            Nous contacter &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default APropos;
