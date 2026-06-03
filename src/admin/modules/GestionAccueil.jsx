import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionAccueil = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);
  
  // Hero section state
  const [heroActive, setHeroActive] = useState(true);
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaPrimaryText, setHeroCtaPrimaryText] = useState('');
  const [heroCtaPrimaryLink, setHeroCtaPrimaryLink] = useState('');
  const [heroCtaSecondaryText, setHeroCtaSecondaryText] = useState('');
  const [heroCtaSecondaryLink, setHeroCtaSecondaryLink] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');

  // Stats section state
  const [statsActive, setStatsActive] = useState(true);
  const [stat1Num, setStat1Num] = useState('');
  const [stat1Lbl, setStat1Lbl] = useState('');
  const [stat2Num, setStat2Num] = useState('');
  const [stat2Lbl, setStat2Lbl] = useState('');
  const [stat3Num, setStat3Num] = useState('');
  const [stat3Lbl, setStat3Lbl] = useState('');
  const [stat4Num, setStat4Num] = useState('');
  const [stat4Lbl, setStat4Lbl] = useState('');

  // About summary section state
  const [aproposActive, setAproposActive] = useState(true);
  const [aproposTitle, setAproposTitle] = useState('');
  const [aproposText, setAproposText] = useState('');

  // Sections order state (for mock drag & drop reordering)
  const [sectionsOrder, setSectionsOrder] = useState([
    { id: 'hero', name: 'Bannière Héro' },
    { id: 'stats', name: 'Chiffres Clés' },
    { id: 'apropos', name: 'Présentation À Propos' },
    { id: 'domaines', name: "Domaines d'Intervention" }
  ]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axiosInstance.get('/api/content/all');
      const data = response.data.accueil || {};

      // Hero
      if (data.hero) {
        setHeroActive(data.hero.active);
        setHeroBadge(data.hero.badge || '');
        setHeroTitleWhite(data.hero.title_white || '');
        setHeroTitleGold(data.hero.title_gold || '');
        setHeroSubtitle(data.hero.subtitle || '');
        setHeroCtaPrimaryText(data.hero.cta_primary_text || '');
        setHeroCtaPrimaryLink(data.hero.cta_primary_link || '');
        setHeroCtaSecondaryText(data.hero.cta_secondary_text || '');
        setHeroCtaSecondaryLink(data.hero.cta_secondary_link || '');
        setHeroBgImage(data.hero.bg_image || '');
      }

      // Stats
      if (data.stats) {
        setStatsActive(data.stats.active);
        setStat1Num(data.stats.stat1_num || '');
        setStat1Lbl(data.stats.stat1_lbl || '');
        setStat2Num(data.stats.stat2_num || '');
        setStat2Lbl(data.stats.stat2_lbl || '');
        setStat3Num(data.stats.stat3_num || '');
        setStat3Lbl(data.stats.stat3_lbl || '');
        setStat4Num(data.stats.stat4_num || '');
        setStat4Lbl(data.stats.stat4_lbl || '');
      }

      // A Propos
      if (data.apropos) {
        setAproposActive(data.apropos.active);
        setAproposTitle(data.apropos.title || '');
        setAproposText(data.apropos.text || '');
      }

      // Load section order if saved in settings
      const settingsRes = await axiosInstance.get('/api/content/parametres');
      if (settingsRes.data.homepage_section_order) {
        setSectionsOrder(JSON.parse(settingsRes.data.homepage_section_order));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      triggerToast('Erreur lors du chargement des données.', 'error');
    }
  };

  const handleSaveHero = async () => {
    triggerConfirm('Enregistrer les modifications de la section Héro ?', async () => {
      try {
        const contents = [
          { page: 'accueil', section: 'hero', cle: 'active', valeur: String(heroActive), type: 'boolean' },
          { page: 'accueil', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'cta_primary_text', valeur: heroCtaPrimaryText, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'cta_primary_link', valeur: heroCtaPrimaryLink, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'cta_secondary_text', valeur: heroCtaSecondaryText, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'cta_secondary_link', valeur: heroCtaSecondaryLink, type: 'texte' },
          { page: 'accueil', section: 'hero', cle: 'bg_image', valeur: heroBgImage, type: 'image' }
        ];

        await axiosInstance.post('/api/content/save', { contents });
        triggerToast('Section Héro mise à jour.');
      } catch (err) {
        console.error('Error saving Hero:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleSaveStats = async () => {
    triggerConfirm('Enregistrer les chiffres clés ?', async () => {
      try {
        const contents = [
          { page: 'accueil', section: 'stats', cle: 'active', valeur: String(statsActive), type: 'boolean' },
          { page: 'accueil', section: 'stats', cle: 'stat1_num', valeur: stat1Num, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat1_lbl', valeur: stat1Lbl, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat2_num', valeur: stat2Num, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat2_lbl', valeur: stat2Lbl, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat3_num', valeur: stat3Num, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat3_lbl', valeur: stat3Lbl, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat4_num', valeur: stat4Num, type: 'texte' },
          { page: 'accueil', section: 'stats', cle: 'stat4_lbl', valeur: stat4Lbl, type: 'texte' }
        ];

        await axiosInstance.post('/api/content/save', { contents });
        triggerToast('Chiffres clés mis à jour.');
      } catch (err) {
        console.error('Error saving stats:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleSaveAPropos = async () => {
    triggerConfirm('Enregistrer le résumé À Propos ?', async () => {
      try {
        const contents = [
          { page: 'accueil', section: 'apropos', cle: 'active', valeur: String(aproposActive), type: 'boolean' },
          { page: 'accueil', section: 'apropos', cle: 'title', valeur: aproposTitle, type: 'texte' },
          { page: 'accueil', section: 'apropos', cle: 'text', valeur: aproposText, type: 'texte' }
        ];

        await axiosInstance.post('/api/content/save', { contents });
        triggerToast('Résumé À Propos mis à jour.');
      } catch (err) {
        console.error('Error saving About summary:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  // Click-based reordering logic
  const moveSection = (index, direction) => {
    const updated = [...sectionsOrder];
    if (direction === 'up' && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === 'down' && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }
    setSectionsOrder(updated);
  };

  const handleSaveOrder = async () => {
    try {
      await axiosInstance.put('/api/content/parametres', {
        homepage_section_order: JSON.stringify(sectionsOrder)
      });
      triggerToast("L'ordre des sections a été enregistré.");
    } catch (err) {
      console.error('Error saving section order:', err);
      triggerToast('Erreur lors de la sauvegarde.', 'error');
    }
  };

  if (loading) return <div className="loading-spinner">Chargement des paramètres de la page d'accueil...</div>;

  return (
    <div className="gestion-accueil-module">
      <div className="admin-card">
        <h2 className="admin-card-title">Ordre et visibilité des sections</h2>
        <p className="mb-4">Réorganisez l'ordre d'affichage des sections de la page d'accueil à l'aide des flèches.</p>
        
        <div className="draggable-list mb-4">
          {sectionsOrder.map((section, idx) => (
            <div key={section.id} className="draggable-item">
              <div className="draggable-item-content">
                <strong>{section.name}</strong>
              </div>
              <div className="draggable-item-actions">
                <button 
                  onClick={() => moveSection(idx, 'up')} 
                  disabled={idx === 0} 
                  className="btn-drag-action"
                  title="Monter"
                >
                  ⬆️
                </button>
                <button 
                  onClick={() => moveSection(idx, 'down')} 
                  disabled={idx === sectionsOrder.length - 1} 
                  className="btn-drag-action"
                  title="Descendre"
                >
                  ⬇️
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSaveOrder}>
          💾 Enregistrer l'ordre
        </button>
      </div>

      {/* Hero management */}
      <div className="admin-card">
        <div className="admin-card-title">
          <span>Bannière Hero</span>
          <div className="toggle-switch-container" onClick={() => setHeroActive(!heroActive)}>
            <div className={`toggle-switch ${heroActive ? 'active' : ''}`}>
              <div className="toggle-switch-handle"></div>
            </div>
            <span className="toggle-switch-label">{heroActive ? 'Active' : 'Désactivée'}</span>
          </div>
        </div>

        <div className="admin-form">
          <div className="form-group mb-4">
            <label>Badge de bienvenue</label>
            <input 
              type="text" 
              value={heroBadge} 
              onChange={e => setHeroBadge(e.target.value)} 
              placeholder="Ex: ● CABINET DE CONSEIL" 
            />
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Titre Principal (Blanc)</label>
              <input 
                type="text" 
                value={heroTitleWhite} 
                onChange={e => setHeroTitleWhite(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Titre Principal (Doré)</label>
              <input 
                type="text" 
                value={heroTitleGold} 
                onChange={e => setHeroTitleGold(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label>Sous-titre</label>
            <textarea 
              rows="3" 
              value={heroSubtitle} 
              onChange={e => setHeroSubtitle(e.target.value)}
            ></textarea>
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Texte Bouton Principal</label>
              <input type="text" value={heroCtaPrimaryText} onChange={e => setHeroCtaPrimaryText(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Lien Bouton Principal</label>
              <input type="text" value={heroCtaPrimaryLink} onChange={e => setHeroCtaPrimaryLink(e.target.value)} />
            </div>
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Texte Bouton Secondaire</label>
              <input type="text" value={heroCtaSecondaryText} onChange={e => setHeroCtaSecondaryText(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Lien Bouton Secondaire</label>
              <input type="text" value={heroCtaSecondaryLink} onChange={e => setHeroCtaSecondaryLink(e.target.value)} />
            </div>
          </div>

          <div className="form-group mb-4">
            <label>Lien de la photo de fond</label>
            <input type="text" value={heroBgImage} onChange={e => setHeroBgImage(e.target.value)} placeholder="/src/assets/hero.png" />
            <span className="info-subtext">Astuce: Vous pouvez copier le lien de n'importe quelle photo depuis l'onglet "Médias" et le coller ici.</span>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={handleSaveHero}>
              💾 Sauvegarder Héro
            </button>
          </div>
        </div>
      </div>

      {/* Stats management */}
      <div className="admin-card">
        <div className="admin-card-title">
          <span>Chiffres Clés (Stats)</span>
          <div className="toggle-switch-container" onClick={() => setStatsActive(!statsActive)}>
            <div className={`toggle-switch ${statsActive ? 'active' : ''}`}>
              <div className="toggle-switch-handle"></div>
            </div>
            <span className="toggle-switch-label">{statsActive ? 'Active' : 'Désactivée'}</span>
          </div>
        </div>

        <div className="admin-form">
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Stat 1 - Chiffre</label>
              <input type="text" value={stat1Num} onChange={e => setStat1Num(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Stat 1 - Libellé</label>
              <input type="text" value={stat1Lbl} onChange={e => setStat1Lbl(e.target.value)} />
            </div>
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Stat 2 - Chiffre</label>
              <input type="text" value={stat2Num} onChange={e => setStat2Num(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Stat 2 - Libellé</label>
              <input type="text" value={stat2Lbl} onChange={e => setStat2Lbl(e.target.value)} />
            </div>
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Stat 3 - Chiffre</label>
              <input type="text" value={stat3Num} onChange={e => setStat3Num(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Stat 3 - Libellé</label>
              <input type="text" value={stat3Lbl} onChange={e => setStat3Lbl(e.target.value)} />
            </div>
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Stat 4 - Chiffre</label>
              <input type="text" value={stat4Num} onChange={e => setStat4Num(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Stat 4 - Libellé</label>
              <input type="text" value={stat4Lbl} onChange={e => setStat4Lbl(e.target.value)} />
            </div>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={handleSaveStats}>
              💾 Sauvegarder Chiffres
            </button>
          </div>
        </div>
      </div>

      {/* About Summary */}
      <div className="admin-card">
        <div className="admin-card-title">
          <span>Résumé Présentation</span>
          <div className="toggle-switch-container" onClick={() => setAproposActive(!aproposActive)}>
            <div className={`toggle-switch ${aproposActive ? 'active' : ''}`}>
              <div className="toggle-switch-handle"></div>
            </div>
            <span className="toggle-switch-label">{aproposActive ? 'Active' : 'Désactivée'}</span>
          </div>
        </div>

        <div className="admin-form">
          <div className="form-group mb-4">
            <label>Titre de section</label>
            <input type="text" value={aproposTitle} onChange={e => setAproposTitle(e.target.value)} />
          </div>

          <div className="form-group mb-4">
            <label>Texte descriptif</label>
            <textarea rows="4" value={aproposText} onChange={e => setAproposText(e.target.value)}></textarea>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={handleSaveAPropos}>
              💾 Sauvegarder Présentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionAccueil;
