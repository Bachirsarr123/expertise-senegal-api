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

  useEffect(() => {
    fetchPublications();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/publications/public');
      setPublications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public publications:', error);
      setLoading(false);
    }
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
      <section className="seminaires-hero">
        <div className="seminaires-hero-overlay"></div>
        <div className="container seminaires-hero-content">
          <div className="seminaires-hero-badge">● SÉMINAIRES &amp; FORMATIONS — EXPERTISE SÉNÉGAL</div>
          <h1>Séminaires &amp; Formations</h1>
          <p>Retrouvez toutes nos formations continues, séminaires professionnels, appels à candidatures et actualités.</p>
        </div>
      </section>

      {/* Grid & Filters */}
      <section className="publications-grid-section section-padding">
        <div className="container">
          
          {/* Filters */}
          <div className="pub-filters">
            {[
              { id: 'formation', label: '📚 Formations' },
              { id: 'appel_candidature', label: '📣 Appels à candidatures' },
              { id: 'actualite', label: '📰 Actualités' }
            ].map(filter => (
              <button
                key={filter.id}
                className={`pub-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

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
