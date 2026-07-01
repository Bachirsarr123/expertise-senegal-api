import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionContact = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);

  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  const [formationBadge, setFormationBadge] = useState('');
  const [formationTitle, setFormationTitle] = useState('');
  const [formationSubtitle, setFormationSubtitle] = useState('');

  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/all');
      const c = data.contact || {};
      if (c.hero) {
        setHeroBadge(c.hero.badge || 'CONTACT - EXPERTISE SENEGAL');
        setHeroTitleWhite(c.hero.title_white || 'Contactez');
        setHeroTitleGold(c.hero.title_gold || 'Notre Cabinet');
        setHeroSubtitle(c.hero.subtitle || '');
      }
      if (c.formation) {
        setFormationBadge(c.formation.badge || '- POLE FORMATION -');
        setFormationTitle(c.formation.title || 'Demander une Formation');
        setFormationSubtitle(c.formation.subtitle || '');
      }
      if (c.cta) {
        setCtaTitle(c.cta.title || 'Pret a demarrer votre projet ?');
        setCtaSubtitle(c.cta.subtitle || '');
      }
    } catch {
      triggerToast('Erreur chargement contenu page Contact.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    triggerConfirm('Enregistrer les modifications de la page Contact ?', async () => {
      try {
        await axiosInstance.post('/api/content/save', {
          contents: [
            { page: 'contact', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
            { page: 'contact', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
            { page: 'contact', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
            { page: 'contact', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' },
            { page: 'contact', section: 'formation', cle: 'badge', valeur: formationBadge, type: 'texte' },
            { page: 'contact', section: 'formation', cle: 'title', valeur: formationTitle, type: 'texte' },
            { page: 'contact', section: 'formation', cle: 'subtitle', valeur: formationSubtitle, type: 'texte' },
            { page: 'contact', section: 'cta', cle: 'title', valeur: ctaTitle, type: 'texte' },
            { page: 'contact', section: 'cta', cle: 'subtitle', valeur: ctaSubtitle, type: 'texte' },
          ]
        });
        triggerToast('Page Contact mise a jour avec succes.');
      } catch {
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;

  return (
    <div className="gestion-contact-module">
      <div className="admin-card">
        <h2 className="admin-card-title">Page Contact - Textes de la page</h2>
        <div className="admin-form">

          <h3>Section Hero (bandeau d'entree)</h3>
          <div className="form-group mb-3">
            <label>Badge</label>
            <input type="text" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} />
          </div>
          <div className="admin-input-grid mb-3">
            <div className="form-group">
              <label>Titre (partie blanche)</label>
              <input type="text" value={heroTitleWhite} onChange={e => setHeroTitleWhite(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Titre (partie doree)</label>
              <input type="text" value={heroTitleGold} onChange={e => setHeroTitleGold(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Sous-titre</label>
            <textarea rows="2" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} />
          </div>

          <div className="golden-divider" style={{ margin: '20px 0' }}></div>

          <h3>Section Formation (pole formation)</h3>
          <div className="form-group mb-3">
            <label>Badge</label>
            <input type="text" value={formationBadge} onChange={e => setFormationBadge(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <label>Titre</label>
            <input type="text" value={formationTitle} onChange={e => setFormationTitle(e.target.value)} />
          </div>
          <div className="form-group mb-4">
            <label>Sous-titre</label>
            <textarea rows="2" value={formationSubtitle} onChange={e => setFormationSubtitle(e.target.value)} />
          </div>

          <div className="golden-divider" style={{ margin: '20px 0' }}></div>

          <h3>Section CTA (appel a l'action final)</h3>
          <div className="form-group mb-3">
            <label>Titre</label>
            <input type="text" value={ctaTitle} onChange={e => setCtaTitle(e.target.value)} />
          </div>
          <div className="form-group mb-4">
            <label>Sous-titre</label>
            <input type="text" value={ctaSubtitle} onChange={e => setCtaSubtitle(e.target.value)} />
          </div>

          <button className="admin-btn admin-btn-secondary" onClick={handleSave}>
            Enregistrer les textes Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionContact;