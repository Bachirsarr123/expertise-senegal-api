import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import ImageOptimisee from '../components/ImageOptimisee';
import './Accueil.css';

const Accueil = () => {
  const [spotlight, setSpotlight] = useState(null);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/publications/public');
      if (response.data.length > 0) {
        setSpotlight(response.data[0]); // The latest publication goes in full spotlight at the top
        setAnnonces(response.data.slice(1, 4)); // The subsequent go in the bottom card grid
      }
    } catch (err) {
      console.warn('Backend server not connected for Accueil publications.');
    }
  };

  return (
    <div className="accueil">
      <SEO 
        title="Expertise Sénégal — Cabinet de Conseil, Études et Formation à Dakar"
        description="Cabinet pluridisciplinaire de conseil, d'études et de formation au Sénégal depuis 2016. Évaluation de projets, audit marchés publics, formation professionnelle."
        url="https://www.expertisesenegal.com"
      />
      {/* 2. HERO */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="dot"></span> CABINET DE CONSEIL — DAKAR, SÉNÉGAL
          </div>
          <h1 className="hero-title">
            L'Expertise Éprouvée au Service de <span className="text-gold">votre Performance</span>
          </h1>
          <p className="hero-subtitle">
            Cabinet de Formation, Conseil et Études pluridisciplinaire au Sénégal. Nous accompagnons vos politiques publiques, projets de développement et performance organisationnelle depuis 2016.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary hero-btn">
              Demander un Devis &rarr;
            </Link>
            <Link to="/a-propos" className="btn btn-outline hero-btn">
              Découvrir le Cabinet
            </Link>
          </div>
        </div>
      </section>

      {/* 2.5. SPOTLIGHT / MISE EN AVANT DE LA DERNIÈRE PUBLICATION (Avec Classe) */}
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
                    {spotlight.type === 'formation' && spotlight.places_disponibles !== null && (
                      <div className="spotlight-meta-item">
                        <span className="meta-icon">👥</span>
                        <span className={spotlight.places_disponibles === 0 ? 'text-red fw-bold' : ''}>
                          {spotlight.places_disponibles === 0 ? 'Complet' : `${spotlight.places_disponibles} places disponibles`}
                        </span>
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

      {/* 3. CHIFFRES CLÉS */}
      <section className="chiffres-section section-padding">
        <div className="container">
          <div className="chiffres-grid">
            <div className="chiffre-card">
              <h3 className="chiffre-number">8+</h3>
              <p className="chiffre-text">Années d’expérience confirmée</p>
            </div>
            <div className="chiffre-card">
              <h3 className="chiffre-number">100+</h3>
              <p className="chiffre-text">Missions réalisées avec succès</p>
            </div>
            <div className="chiffre-card">
              <h3 className="chiffre-number">14</h3>
              <p className="chiffre-text">Régions couvertes</p>
            </div>
            <div className="chiffre-card">
              <h3 className="chiffre-number">50+</h3>
              <p className="chiffre-text">Experts mobilisés dans le réseau</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. À PROPOS RÉSUMÉ */}
      <section className="apropos-section section-padding bg-light">
        <div className="container apropos-content">
          <div className="apropos-text">
            <h2 className="section-title text-left">Un Cabinet Pluridisciplinaire au Service du Développement</h2>
            <p>
              Expertise Sénégal est un cabinet de Formation, Conseil et Études pluridisciplinaire, spécialisé dans l’évaluation de projets, l’audit et contrôle, ainsi que dans le renforcement des capacités à travers la formation continue et l’assistance technique.
            </p>
            <p>
              Fondé en 2016, le cabinet incarne une expertise éprouvée, mobilisée au service des politiques publiques, des projets de développement et de la performance organisationnelle, aussi bien au Sénégal que dans la sous-région.
            </p>
            <Link to="/a-propos" className="btn btn-primary mt-4">
              En savoir plus &rarr;
            </Link>
          </div>
          <div className="apropos-image">
            <div className="image-wrapper">
              <ImageOptimisee src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" alt="L'équipe d'Expertise Sénégal en réunion" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. DOMAINES D’INTERVENTION */}
      <section className="domaines-section section-padding bg-dark">
        <div className="container">
          <h2 className="section-title text-white">Nos Domaines d'Intervention</h2>
          <div className="domaines-grid">
            <div className="domaine-card">
              <div className="domaine-icon">📊</div>
              <h3>Études et analyses sectorielles</h3>
              <p>Études de faisabilité, diagnostics territoriaux, socio-économiques ou institutionnels. Analyses d’impact, capitalisation d’expériences et documentation de projets.</p>
            </div>
            <div className="domaine-card">
              <div className="domaine-icon">📋</div>
              <h3>Évaluation et suivi de projets</h3>
              <p>Évaluations ex-ante, à mi-parcours et finales. Suivi-évaluation axé sur les résultats (GAR). Conception et opérationnalisation de systèmes de suivi-évaluation.</p>
            </div>
            <div className="domaine-card">
              <div className="domaine-icon">🔍</div>
              <h3>Audit de conformité — Marchés publics</h3>
              <p>Audit de conformité des procédures de passation, d’exécution et de contrôle. Analyse des risques et des écarts réglementaires. Élaboration de recommandations opérationnelles.</p>
            </div>
            <div className="domaine-card">
              <div className="domaine-icon">🎓</div>
              <h3>Formation professionnelle et accompagnement</h3>
              <p>Ingénierie de formation : diagnostic des besoins, conception de modules, animation et évaluation. Renforcement des capacités organisationnelles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5. DYNAMIC PUBLICATIONS SECTION (Only visible if publications exist) */}
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
                if (item.type === 'appel_candidature') {
                  badgeLabel = '📣 Appel à candidatures';
                  badgeClass = 'badge-appel';
                } else if (item.type === 'actualite') {
                  badgeLabel = '📰 Actualité';
                  badgeClass = 'badge-actualite';
                }

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
                      
                      {item.type === 'formation' && (
                        <div className="annonce-meta" style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--texte-moyen)', margin: '12px 0' }}>
                          {item.lieu && <span>📍 {item.lieu}</span>}
                          {item.places_disponibles !== null && (
                            <span className={item.places_disponibles === 0 ? 'text-red fw-bold' : ''}>
                              👥 {item.places_disponibles === 0 ? 'Complet' : `${item.places_disponibles} places`}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="annonce-footer" style={{ marginTop: '16px', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                        <Link to={`/seminaires/${item.id}`} className="annonce-link" style={{ color: 'var(--or)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                          En savoir plus &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-5">
              <Link to="/seminaires" className="btn btn-secondary">
                Voir tout &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. FORMATIONS VEDETTE */}
      <section className="formations-section section-padding">
        <div className="container">
          <h2 className="section-title">Nos Formations Vedettes</h2>
          <div className="formations-grid">
            <div className="formation-card">
              <div className="formation-header">
                <span className="formation-icon">⚖️</span>
                <h3>Marchés Publics</h3>
              </div>
              <ul className="formation-list">
                <li>Procédures de passation des marchés publics</li>
                <li>Suivi et exécution des marchés publics</li>
                <li>Audit de conformité dans les marchés publics</li>
                <li>Gestion des contrats / Partenariat public-privé</li>
              </ul>
            </div>
            <div className="formation-card">
              <div className="formation-header">
                <span className="formation-icon">📁</span>
                <h3>Gestion de Projet</h3>
              </div>
              <ul className="formation-list">
                <li>Les fondamentaux de la Gestion de Projet</li>
                <li>Suivi-évaluation des Projets et Programmes</li>
                <li>Planification avec Ms Project</li>
              </ul>
            </div>
            <div className="formation-card">
              <div className="formation-header">
                <span className="formation-icon">💰</span>
                <h3>Finance Publique</h3>
              </div>
              <ul className="formation-list">
                <li>Préparation et programmation budgétaire</li>
                <li>Budget programme axé sur les résultats</li>
                <li>Exécution et suivi budgétaire</li>
                <li>Contrôle budgétaire</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link to="/domaines" className="btn btn-outline text-dark border-dark">
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CLIENTS DE RÉFÉRENCE */}
      <section className="clients-section section-padding bg-light">
        <div className="container">
          <h2 className="section-title">Ils nous font confiance</h2>
          <div className="clients-grid">
            {['PAPSEN', 'DP World', 'ANAM', 'Eiffage Sénégal', 'OFOR', 'Sonatel', 'TDS', 'GCO/Eramet', 'ARTP', 'SONAGED', 'Hôpital de Tambacounda', '3FPT', 'PAGOTRANS/COM'].map((client, index) => (
              <div className="client-badge" key={index}>
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="cta-section section-padding">
        <div className="container cta-content">
          <h2 className="cta-title">Prêt à renforcer votre performance ?</h2>
          <p className="cta-subtitle">Contactez-nous pour un devis personnalisé</p>
          <Link to="/contact" className="btn btn-secondary btn-lg">
            Demander un Devis &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
