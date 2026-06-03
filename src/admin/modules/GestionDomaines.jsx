import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionDomaines = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [activeDomainTab, setActiveDomainTab] = useState('domaine1');

  // Hero section state
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  // Domains State
  const [domainData, setDomainData] = useState({
    domaine1: { title: '', intro: '', prestations: [], references: [], active: true },
    domaine2: { title: '', intro: '', prestations: [], references: [], active: true },
    domaine3: { title: '', intro: '', prestations: [], references: [], active: true },
    domaine4: { title: '', intro: '', prestations: [], themes: [], active: true }
  });

  // Adding item states
  const [newPrestation, setNewPrestation] = useState('');
  const [newReference, setNewReference] = useState('');
  const [newTheme, setNewTheme] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axiosInstance.get('/api/content/all');
      const data = response.data.domaines || {};

      // Hero
      if (data.hero) {
        setHeroBadge(data.hero.badge || '');
        setHeroTitleWhite(data.hero.title_white || '');
        setHeroTitleGold(data.hero.title_gold || '');
        setHeroSubtitle(data.hero.subtitle || '');
      }

      // Format domains
      const formatted = { ...domainData };
      
      ['domaine1', 'domaine2', 'domaine3', 'domaine4'].forEach(domKey => {
        if (data[domKey]) {
          formatted[domKey] = {
            title: data[domKey].title || '',
            intro: data[domKey].intro || '',
            active: data[domKey].active !== false && data[domKey].active !== 'false',
            prestations: JSON.parse(data[domKey].prestations || '[]'),
            references: JSON.parse(data[domKey].references || '[]'),
            themes: JSON.parse(data[domKey].themes || '[]')
          };
        }
      });

      setDomainData(formatted);
      setLoading(false);
    } catch (error) {
      console.error('Error loading domains:', error);
      triggerToast('Erreur lors du chargement des domaines.', 'error');
    }
  };

  const handleSaveDomain = async (domKey) => {
    triggerConfirm(`Enregistrer les modifications pour le ${domKey.replace('domaine', 'Domaine ')} ?`, async () => {
      try {
        const dom = domainData[domKey];
        const contents = [
          { page: 'domaines', section: domKey, cle: 'title', valeur: dom.title, type: 'texte' },
          { page: 'domaines', section: domKey, cle: 'intro', valeur: dom.intro, type: 'texte' },
          { page: 'domaines', section: domKey, cle: 'active', valeur: String(dom.active), type: 'boolean' },
          { page: 'domaines', section: domKey, cle: 'prestations', valeur: JSON.stringify(dom.prestations), type: 'texte' }
        ];

        if (domKey === 'domaine4') {
          contents.push({ page: 'domaines', section: domKey, cle: 'themes', valeur: JSON.stringify(dom.themes), type: 'texte' });
        } else {
          contents.push({ page: 'domaines', section: domKey, cle: 'references', valeur: JSON.stringify(dom.references), type: 'texte' });
        }

        await axiosInstance.post('/api/content/save', { contents });
        triggerToast('Sauvegarde effectuée avec succès.');
      } catch (err) {
        console.error('Error saving domain:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleSaveHero = async () => {
    triggerConfirm('Enregistrer le Héro de la page Domaines ?', async () => {
      try {
        const contents = [
          { page: 'domaines', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
          { page: 'domaines', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
          { page: 'domaines', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
          { page: 'domaines', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' }
        ];
        await axiosInstance.post('/api/content/save', { contents });
        triggerToast('Héro de la page Domaines mis à jour.');
      } catch (err) {
        console.error('Error saving domain hero:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  // Helper to add list items
  const addPrestation = (domKey) => {
    if (!newPrestation.trim()) return;
    const updated = { ...domainData };
    updated[domKey].prestations.push(newPrestation.trim());
    setDomainData(updated);
    setNewPrestation('');
  };

  const removePrestation = (domKey, idx) => {
    const updated = { ...domainData };
    updated[domKey].prestations = updated[domKey].prestations.filter((_, i) => i !== idx);
    setDomainData(updated);
  };

  const addReference = (domKey) => {
    if (!newReference.trim()) return;
    const updated = { ...domainData };
    updated[domKey].references.push(newReference.trim());
    setDomainData(updated);
    setNewReference('');
  };

  const removeReference = (domKey, idx) => {
    const updated = { ...domainData };
    updated[domKey].references = updated[domKey].references.filter((_, i) => i !== idx);
    setDomainData(updated);
  };

  const addTheme = () => {
    if (!newTheme.trim()) return;
    const updated = { ...domainData };
    updated.domaine4.themes.push(newTheme.trim());
    setDomainData(updated);
    setNewTheme('');
  };

  const removeTheme = (idx) => {
    const updated = { ...domainData };
    updated.domaine4.themes = updated.domaine4.themes.filter((_, i) => i !== idx);
    setDomainData(updated);
  };

  const updateDomainField = (domKey, field, val) => {
    const updated = { ...domainData };
    updated[domKey][field] = val;
    setDomainData(updated);
  };

  if (loading) return <div className="loading-spinner">Chargement des domaines d'activité...</div>;

  return (
    <div className="gestion-domaines-module">
      {/* Hero Section */}
      <div className="admin-card">
        <h2 className="admin-card-title">En-tête (Hero) de la page Domaines</h2>
        <div className="admin-form">
          <div className="form-group mb-4">
            <label>Badge Héro</label>
            <input type="text" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} />
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Titre Héro (Blanc)</label>
              <input type="text" value={heroTitleWhite} onChange={e => setHeroTitleWhite(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Titre Héro (Doré)</label>
              <input type="text" value={heroTitleGold} onChange={e => setHeroTitleGold(e.target.value)} />
            </div>
          </div>

          <div className="form-group mb-4">
            <label>Sous-titre Héro</label>
            <textarea rows="2" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)}></textarea>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={handleSaveHero}>
              💾 Enregistrer En-tête
            </button>
          </div>
        </div>
      </div>

      {/* Domain Modules Selector Tabs */}
      <div className="admin-card">
        <h2 className="admin-card-title">Gestion des Domaines d'Activité</h2>
        
        <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {['domaine1', 'domaine2', 'domaine3', 'domaine4'].map(domKey => (
            <button 
              key={domKey}
              onClick={() => setActiveDomainTab(domKey)}
              className={`admin-btn ${activeDomainTab === domKey ? 'admin-btn-primary' : 'admin-btn-outline'}`}
              style={{ padding: '12px 6px', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {domKey.replace('domaine', 'Domaine ')}
            </button>
          ))}
        </div>

        {/* Selected Domain Fields */}
        {['domaine1', 'domaine2', 'domaine3', 'domaine4'].map(domKey => {
          if (activeDomainTab !== domKey) return null;
          const dom = domainData[domKey];

          return (
            <div key={domKey} className="domain-tab-detail-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Paramètres du {domKey.replace('domaine', 'Domaine ')}</h3>
                <div className="toggle-switch-container" onClick={() => updateDomainField(domKey, 'active', !dom.active)}>
                  <div className={`toggle-switch ${dom.active ? 'active' : ''}`}>
                    <div className="toggle-switch-handle"></div>
                  </div>
                  <span className="toggle-switch-label">{dom.active ? 'Actif' : 'Désactivé'}</span>
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Titre officiel du domaine</label>
                <input 
                  type="text" 
                  value={dom.title} 
                  onChange={e => updateDomainField(domKey, 'title', e.target.value)} 
                />
              </div>

              <div className="form-group mb-4">
                <label>Texte d'introduction</label>
                <textarea 
                  rows="3" 
                  value={dom.intro} 
                  onChange={e => updateDomainField(domKey, 'intro', e.target.value)}
                ></textarea>
              </div>

              <div className="golden-divider" style={{ margin: '30px 0' }}></div>

              {/* Prestations */}
              <div className="form-group mb-4">
                <label>Prestations / Services inclus</label>
                <ul className="draggable-list mb-3">
                  {dom.prestations.map((prest, idx) => (
                    <li key={idx} className="draggable-item" style={{ cursor: 'default' }}>
                      <div className="draggable-item-content">{prest}</div>
                      <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }} onClick={() => removePrestation(domKey, idx)}>
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
                  <div className="form-group">
                    <label>Ajouter une prestation</label>
                    <input 
                      type="text" 
                      value={newPrestation} 
                      onChange={e => setNewPrestation(e.target.value)} 
                      placeholder="Ex: Réalisation d'études de faisabilité..." 
                    />
                  </div>
                  <button className="admin-btn admin-btn-primary" onClick={() => addPrestation(domKey)}>
                    ＋ Ajouter
                  </button>
                </div>
              </div>

              <div className="golden-divider" style={{ margin: '30px 0' }}></div>

              {/* References vs Themes */}
              {domKey === 'domaine4' ? (
                // Pedagogic Pole Themes
                <div className="form-group mb-4">
                  <label>Thématiques de formation (Badges)</label>
                  <div className="draggable-list mb-3">
                    {dom.themes.map((theme, idx) => (
                      <div key={idx} className="draggable-item" style={{ cursor: 'default' }}>
                        <div className="draggable-item-content"><strong>{theme}</strong></div>
                        <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeTheme(idx)}>
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
                    <div className="form-group">
                      <label>Ajouter une thématique</label>
                      <input 
                        type="text" 
                        value={newTheme} 
                        onChange={e => setNewTheme(e.target.value)} 
                        placeholder="Ex: Soft Skills..." 
                      />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={addTheme}>
                      ＋ Ajouter
                    </button>
                  </div>
                </div>
              ) : (
                // References
                <div className="form-group mb-4">
                  <label>Références clients associées</label>
                  <ul className="draggable-list mb-3">
                    {dom.references.map((ref, idx) => (
                      <li key={idx} className="draggable-item" style={{ cursor: 'default' }}>
                        <div className="draggable-item-content">{ref}</div>
                        <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeReference(domKey, idx)}>
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
                    <div className="form-group">
                      <label>Ajouter une référence client</label>
                      <input 
                        type="text" 
                        value={newReference} 
                        onChange={e => setNewReference(e.target.value)} 
                        placeholder="Ex: Étude d'impact environnemental (Client: ONG...)" 
                      />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => addReference(domKey)}>
                      ＋ Ajouter
                    </button>
                  </div>
                </div>
              )}

              <div className="form-actions-bar">
                <button className="admin-btn admin-btn-secondary" onClick={() => handleSaveDomain(domKey)}>
                  💾 Enregistrer {domKey.replace('domaine', 'Domaine ')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GestionDomaines;
