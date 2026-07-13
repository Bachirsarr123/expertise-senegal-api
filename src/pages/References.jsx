import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import './References.css';

const API = 'https://expertise-senegal-api-olf5.onrender.com';
const apiClient = axios.create({ baseURL: API, timeout: 8000 });

const References = () => {
  const [references, setReferences] = useState([]);
  const [domaines, setDomaines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchReferences(), fetchDomaineRefs()]).finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchReferences = async () => {
    try {
      const { data } = await apiClient.get('/api/references/public');
      setReferences(data);
    } catch (err) {
      console.warn('Could not load references.');
    }
  };

  const fetchDomaineRefs = async () => {
    try {
      const { data } = await apiClient.get('/api/content/all');
      if (data.domaines) {
        const parsed = {};
        ['domaine1', 'domaine2', 'domaine3', 'domaine4'].forEach(key => {
          const d = data.domaines[key];
          if (!d) return;
          let refs = d.references;
          if (typeof refs === 'string') { try { refs = JSON.parse(refs); } catch { refs = []; } }
          parsed[key] = { title: d.title || d.label || key, references: Array.isArray(refs) ? refs : [] };
        });
        setDomaines(parsed);
      }
    } catch (err) {
      console.warn('Could not load domain references.');
    }
  };

  const domainesWithRefs = ['domaine1', 'domaine2', 'domaine3', 'domaine4']
    .filter(key => domaines[key] && domaines[key].references.length > 0);

  return (
    <div className="references-page">
      <SEO
        title="Nos Références — Expertise Sénégal | Dakar, Sénégal"
        description="Découvrez les institutions et entreprises qui font confiance à Expertise Sénégal pour leurs missions de conseil, formation et études."
        url="https://www.expertisesenegal.com/references"
      />

      <section className="references-hero">
        <div className="references-hero-overlay"></div>
        <div className="container references-hero-content">
          <div className="references-hero-badge">NOS RÉFÉRENCES — EXPERTISE SÉNÉGAL</div>
          <h1>Nos Références Clients</h1>
          <p>Des institutions publiques, entreprises privées et organisations qui nous font confiance depuis 2016.</p>
        </div>
      </section>

      <section className="references-grid-section section-padding">
        <div className="container">
          {loading ? (
            <div className="ref-loading">Chargement des références...</div>
          ) : references.length === 0 ? (
            <div className="ref-empty">
              <p>Aucune référence disponible pour le moment.</p>
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

      {!loading && domainesWithRefs.length > 0 && (
        <section className="domaine-refs-section section-padding">
          <div className="container">
            <h2 className="section-title text-center mb-5">Références par domaine d'activité</h2>
            <div className="domaine-refs-grid">
              {domainesWithRefs.map(key => (
                <div key={key} className="domaine-ref-block">
                  <h3 className="domaine-ref-title">{domaines[key].title}</h3>
                  <ul className="domaine-ref-list">
                    {domaines[key].references.map((ref, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: ref.replace(/^([^—]+)—/, '<strong>$1</strong>—') }} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default References;
