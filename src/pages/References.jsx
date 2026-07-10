import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import './References.css';

const API = 'https://expertise-senegal-api-olf5.onrender.com';
const apiClient = axios.create({ baseURL: API, timeout: 8000 });

const References = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferences();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchReferences = async () => {
    try {
      const { data } = await apiClient.get('/api/references/public');
      setReferences(data);
    } catch (err) {
      console.warn('Could not load references.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="references-page">
      <SEO
        title="Nos References - Expertise Senegal"
        description="Decouvrez les institutions et entreprises qui font confiance a Expertise Senegal pour leurs missions de conseil, formation et etudes."
        url="https://www.expertisesenegal.com/references"
      />

      <section className="references-hero">
        <div className="references-hero-overlay"></div>
        <div className="container references-hero-content">
          <div className="references-hero-badge">NOS REFERENCES - EXPERTISE SENEGAL</div>
          <h1>Nos References Clients</h1>
          <p>Des institutions publiques, entreprises et organisations qui nous font confiance depuis 2016.</p>
        </div>
      </section>

      <section className="references-grid-section section-padding">
        <div className="container">
          {loading ? (
            <div className="ref-loading">Chargement des references...</div>
          ) : references.length === 0 ? (
            <div className="ref-empty">
              <p>Aucune reference disponible pour le moment.</p>
            </div>
          ) : (
            <div className="references-grid">
              {references.map(ref => (
                <div key={ref.id} className="ref-card">
                  {ref.logo_url ? (
                    <div className="ref-logo-wrapper">
                      <img src={ref.logo_url} alt={ref.nom} className="ref-logo" />
                    </div>
                  ) : (
                    <div className="ref-logo-placeholder">
                      <span>{ref.nom.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="ref-info">
                    <p className="ref-name">{ref.nom}</p>
                    {ref.secteur && <p className="ref-secteur">{ref.secteur}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default References;