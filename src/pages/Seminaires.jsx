import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import ImageOptimisee from '../components/ImageOptimisee';
import './Seminaires.css';

const Seminaires = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('formation');
  const [heroBgImage, setHeroBgImage] = useState('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920');
  const [heroBadge, setHeroBadge] = useState('CATALOGUE FORMATION - EXPERTISE SENEGAL');
  const [heroTitle, setHeroTitle] = useState('Catalogue de Formation');
  const [heroSubtitle, setHeroSubtitle] = useState('Retrouvez toutes nos formations continues, seminaires professionnels, appels a candidatures et actualites.');
  const [catalogueUrl, setCatalogueUrl] = useState('');

  useEffect(() => {
    fetchPublications();
    fetchHeroContent();
    fetchCatalogueUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/publications/public');
      const data = response.data;
      setPublications(data);
      // Auto-select the first type that has publications
      const order = ['formation', 'appel_candidature', 'actualite'];
      const firstAvailable = order.find(t => data.some(p => p.type === t));
      if (firstAvailable) setActiveFilter(firstAvailable);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public publications:', error);
      setLoading(false);
    }
  };

  const fetchHeroContent = async () => {
    try {
      const { data } = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/all');
      if (data.seminaires && data.seminaires.hero) {
        const h = data.seminaires.hero;
        if (h.badge) setHeroBadge(h.badge);
        if (h.bg_image) setHeroBgImage(h.bg_image);
        if (h.title) setHeroTitle(h.title);
        if (h.subtitle) setHeroSubtitle(h.subtitle);
      }
    } catch (err) {
      console.warn('Could not load seminaires hero content.');
    }
  };

  const fetchCatalogueUrl = async () => {
    try {
      const { data } = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/parametres');
      if (data.catalogue_url) setCatalogueUrl(data.catalogue_url);
    } catch (err) { /* ignore */ }
  };

  const filteredPublications = publications.filter(pub => {
    return pub.type === activeFilter;
  });

  return (
    <div className="seminaires-page">
      <SEO 
        title="Séminaires &amp; Formations — Expertise Sénégal | Dakar, Sénégal"
        description="Découvrez nos séminaires, formations professionnelles et appels à candidatures. Cabinet pluridisciplinaire d'études à Dakar."
        url="https://www.expertisesenegal.com/seminaires"
      />
      {/* Banner */}
      <section className="seminaires-hero" style={{ backgroundImage: `url(${heroBgImage})` }}>
        <div className="seminaires-hero-overlay"></div>
        <div className="container seminaires-hero-content">
          <div className="seminaires-hero-badge">{heroBadge}</div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
        </div>
      </section>

      {/* Grid & Filters */}
      <section className="publications-grid-section section-padding">
        <div className="container">
          
          {/* Filters — only show types that have published content */}
          {[
            { id: 'formation', label: '📚 Formations' },
            { id: 'appel_candidature', label: '📣 Appels à candidatures' },
            { id: 'actualite', label: '📰 Actualités' }
          ].filter(f => publications.some(p => p.type === f.id)).length > 0 && (
            <div className="pub-filters">
              {[
                { id: 'formation', label: '📚 Formations' },
                { id: 'appel_candidature', label: '📣 Appels à candidatures' },
                { id: 'actualite', label: '📰 Actualités' }
              ].filter(f => publications.some(p => p.type === f.id)).map(filter => (
                <button
                  key={filter.id}
                  className={`pub-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {catalogueUrl && (
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <a
                href={catalogueUrl}
                target='_blank'
                rel='noopener noreferrer'
                download
                className='btn btn-secondary'
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>📥</span> Télécharger le Catalogue de Formation (PDF)
              </a>
            </div>
          )}

          {loading ? (
            <div className="pub-loading">Chargement des éléments en cours...</div>
          ) : filteredPublications.length === 0 ? (
            <div className="pub-no-results">
              <p>Aucun élément ne correspond à vos critères pour le moment.</p>
            </div>
          ) : (
            <div className="seminaires-grid">
              {filteredPublications.map(pub => {
                let badgeLabel = '📚 Formation';
                let badgeClass = 'badge-formation';
                if (pub.type === 'appel_candidature') {
                  badgeLabel = '📣 Appel à candidatures';
                  badgeClass = 'badge-appel';
                } else if (pub.type === 'actualite') {
                  badgeLabel = '📰 Actualité';
                  badgeClass = 'badge-actualite';
                }

                return (
                  <div key={pub.id} className="pub-grid-card">
                    <div className="pub-card-image-container">
                      <ImageOptimisee 
                        src={pub.image || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'} 
                        alt={pub.titre} 
                        className="pub-card-image"
                      />
                      <span className={`pub-card-badge ${badgeClass}`}>{badgeLabel}</span>
                    </div>

                    <div className="pub-card-body">
                      <h3 className="pub-card-title">{pub.titre}</h3>
                      <p className="pub-card-desc">{pub.description}</p>
                      
                      <div className="pub-card-meta">
                        {pub.date_debut && (
                          <div className="meta-item">
                            <span>📅</span> {new Date(pub.date_debut).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {pub.lieu && (
                          <div className="meta-item">
                            <span>📍</span> {pub.lieu}
                          </div>
                        )}
                        {pub.type === 'formation' && pub.places_disponibles !== null && (
                          <div className="meta-item">
                            <span>👥</span> 
                            <strong className={pub.places_disponibles === 0 ? 'text-red' : ''}>
                              {pub.places_disponibles === 0 ? 'Complet' : `${pub.places_disponibles} places restantes`}
                            </strong>
                          </div>
                        )}
                      </div>

                      <div className="pub-card-action">
                        <Link to={`/seminaires/${pub.id}`} className="pub-card-link">
                          En savoir plus &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Seminaires;
