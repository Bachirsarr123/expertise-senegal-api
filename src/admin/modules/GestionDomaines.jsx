import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const SITE = 'https://www.expertisesenegal.com';

const SectionHint = ({ label }) => (
  <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span>📍</span> <span>Affiché sur le site : <strong>{label}</strong></span>
    <a href={`${SITE}/domaines`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--or)', marginLeft: '8px' }}>Voir →</a>
  </p>
);

const GestionDomaines = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');

  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  const [domaines, setDomaines] = useState({
    domaine1: { label: '', title: '', intro: '', prestations: [], references: [], active: true },
    domaine2: { label: '', title: '', intro: '', prestations: [], references: [], active: true },
    domaine3: { label: '', title: '', intro: '', prestations: [], references: [], active: true },
    domaine4: { label: '', title: '', intro: '', prestations: [], references: [], formats: [], themes: [], active: true }
  });

  const [newItem, setNewItem] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newTheme, setNewTheme] = useState('');

  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');
  const [ctaBtnText, setCtaBtnText] = useState('');
  const [ctaBtnLink, setCtaBtnLink] = useState('');

  useEffect(() => { fetchContent(); }, []);

  const parseJson = (str, fallback) => { try { return JSON.parse(str); } catch { return fallback; } };

  const fetchContent = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/all');
      const d = data.domaines || {};

      if (d.hero) {
        setHeroBadge(d.hero.badge || '');
        setHeroTitleWhite(d.hero.title_white || '');
        setHeroTitleGold(d.hero.title_gold || '');
        setHeroSubtitle(d.hero.subtitle || '');
      }

      if (d.cta) {
        setCtaTitle(d.cta.title || '');
        setCtaSubtitle(d.cta.subtitle || '');
        setCtaBtnText(d.cta.btn_text || '');
        setCtaBtnLink(d.cta.btn_link || '');
      }

      const updated = { ...domaines };
      ['domaine1', 'domaine2', 'domaine3', 'domaine4'].forEach(key => {
        if (d[key]) {
          updated[key] = {
            label: d[key].label || '',
            title: d[key].title || '',
            intro: d[key].intro || '',
            active: d[key].active !== false,
            prestations: parseJson(d[key].prestations, []),
            references: parseJson(d[key].references, []),
            formats: parseJson(d[key].formats, []),
            themes: parseJson(d[key].themes, [])
          };
        }
      });
      setDomaines(updated);
      setLoading(false);
    } catch (err) {
      triggerToast('Erreur lors du chargement.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const save = async (label, contents) => {
    triggerConfirm(`Enregistrer ${label} ?`, async () => {
      try {
        await axiosInstance.post('/api/content/save', { contents });
        triggerToast(`${label} mis à jour.`);
      } catch {
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const update = (key, field, val) => {
    setDomaines(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  };

  const addToList = (key, field, val) => {
    if (!val.trim()) return;
    setDomaines(prev => ({ ...prev, [key]: { ...prev[key], [field]: [...prev[key][field], val.trim()] } }));
  };

  const removeFromList = (key, field, idx) => {
    setDomaines(prev => ({ ...prev, [key]: { ...prev[key], [field]: prev[key][field].filter((_, i) => i !== idx) } }));
  };

  const updateFormatCard = (idx, field, val) => {
    const updated = [...domaines.domaine4.formats];
    updated[idx] = { ...updated[idx], [field]: val };
    update('domaine4', 'formats', updated);
  };

  const saveDomaine = (key) => {
    const dom = domaines[key];
    const label = `Domaine ${key.replace('domaine', '')}`;
    const contents = [
      { page: 'domaines', section: key, cle: 'label', valeur: dom.label, type: 'texte' },
      { page: 'domaines', section: key, cle: 'title', valeur: dom.title, type: 'texte' },
      { page: 'domaines', section: key, cle: 'intro', valeur: dom.intro, type: 'texte' },
      { page: 'domaines', section: key, cle: 'active', valeur: String(dom.active), type: 'boolean' },
      { page: 'domaines', section: key, cle: 'prestations', valeur: JSON.stringify(dom.prestations), type: 'texte' },
      { page: 'domaines', section: key, cle: 'references', valeur: JSON.stringify(dom.references), type: 'texte' }
    ];
    if (key === 'domaine4') {
      contents.push({ page: 'domaines', section: key, cle: 'themes', valeur: JSON.stringify(dom.themes), type: 'texte' });
      contents.push({ page: 'domaines', section: key, cle: 'formats', valeur: JSON.stringify(dom.formats), type: 'texte' });
    }
    save(label, contents);
  };

  const tabs = [
    { id: 'hero', label: 'En-tête' },
    { id: 'domaine1', label: 'Domaine 1' },
    { id: 'domaine2', label: 'Domaine 2' },
    { id: 'domaine3', label: 'Domaine 3' },
    { id: 'domaine4', label: 'Domaine 4' },
    { id: 'cta', label: 'CTA' }
  ];

  if (loading) return <div className="loading-spinner">Chargement…</div>;

  return (
    <div className="gestion-domaines-module">

      {/* Navigation onglets */}
      <div className="admin-card" style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-btn ${activeTab === tab.id ? 'admin-btn-primary' : 'admin-btn-outline'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* EN-TÊTE / HERO */}
      {activeTab === 'hero' && (
        <div className="admin-card">
          <h2 className="admin-card-title">Bannière Héro</h2>
          <SectionHint label="Page Domaines → Grande bannière en haut de page" />
          <div className="form-group mb-4">
            <label>Badge</label>
            <input type="text" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} />
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Titre (partie blanche)</label>
              <input type="text" value={heroTitleWhite} onChange={e => setHeroTitleWhite(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Titre (partie dorée)</label>
              <input type="text" value={heroTitleGold} onChange={e => setHeroTitleGold(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Sous-titre</label>
            <textarea rows="2" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)}></textarea>
          </div>
          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => save('En-tête', [
              { page: 'domaines', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
              { page: 'domaines', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
              { page: 'domaines', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
              { page: 'domaines', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' }
            ])}>💾 Enregistrer En-tête</button>
          </div>
        </div>
      )}

      {/* DOMAINES 1-3 */}
      {['domaine1', 'domaine2', 'domaine3'].map(key => activeTab === key && (
        <div className="admin-card" key={key}>
          <h2 className="admin-card-title">Domaine {key.replace('domaine', '')}</h2>
          <SectionHint label={`Page Domaines → Section Domaine ${key.replace('domaine', '')}`} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Statut :</span>
            <div className="toggle-switch-container" onClick={() => update(key, 'active', !domaines[key].active)}>
              <div className={`toggle-switch ${domaines[key].active ? 'active' : ''}`}>
                <div className="toggle-switch-handle"></div>
              </div>
              <span className="toggle-switch-label">{domaines[key].active ? 'Affiché' : 'Masqué'}</span>
            </div>
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Libellé (petit texte doré)</label>
              <input type="text" value={domaines[key].label} onChange={e => update(key, 'label', e.target.value)} placeholder="— DOMAINE 1 —" />
            </div>
            <div className="form-group">
              <label>Titre</label>
              <input type="text" value={domaines[key].title} onChange={e => update(key, 'title', e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Introduction</label>
            <textarea rows="3" value={domaines[key].intro} onChange={e => update(key, 'intro', e.target.value)}></textarea>
          </div>

          <div className="form-group mb-4">
            <label>Prestations / Services</label>
            <ul className="draggable-list mb-2">
              {domaines[key].prestations.map((p, i) => (
                <li key={i} className="draggable-item" style={{ cursor: 'default' }}>
                  <div className="draggable-item-content">{p}</div>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => removeFromList(key, 'prestations', i)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
              <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Ajouter une prestation…" />
              <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => { addToList(key, 'prestations', newItem); setNewItem(''); }}>＋</button>
            </div>
          </div>

          <div className="form-group mb-4">
            <label>Références clients</label>
            <ul className="draggable-list mb-2">
              {domaines[key].references.map((r, i) => (
                <li key={i} className="draggable-item" style={{ cursor: 'default' }}>
                  <div className="draggable-item-content">{r}</div>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => removeFromList(key, 'references', i)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
              <input type="text" value={newRef} onChange={e => setNewRef(e.target.value)} placeholder="Ex: PAPSEN — Audit de conformité…" />
              <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => { addToList(key, 'references', newRef); setNewRef(''); }}>＋</button>
            </div>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => saveDomaine(key)}>
              💾 Enregistrer Domaine {key.replace('domaine', '')}
            </button>
          </div>
        </div>
      ))}

      {/* DOMAINE 4 */}
      {activeTab === 'domaine4' && (
        <div className="admin-card">
          <h2 className="admin-card-title">Domaine 4 — Formation</h2>
          <SectionHint label="Page Domaines → Section Formation avec formats et thèmes" />

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Libellé (petit texte doré)</label>
              <input type="text" value={domaines.domaine4.label} onChange={e => update('domaine4', 'label', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Titre</label>
              <input type="text" value={domaines.domaine4.title} onChange={e => update('domaine4', 'title', e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Introduction</label>
            <textarea rows="3" value={domaines.domaine4.intro} onChange={e => update('domaine4', 'intro', e.target.value)}></textarea>
          </div>

          <div className="form-group mb-4">
            <label>Prestations / Services</label>
            <ul className="draggable-list mb-2">
              {domaines.domaine4.prestations.map((p, i) => (
                <li key={i} className="draggable-item" style={{ cursor: 'default' }}>
                  <div className="draggable-item-content">{p}</div>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => removeFromList('domaine4', 'prestations', i)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
              <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Ajouter une prestation…" />
              <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => { addToList('domaine4', 'prestations', newItem); setNewItem(''); }}>＋</button>
            </div>
          </div>

          <div className="golden-divider" style={{ margin: '20px 0' }}></div>
          <h3 style={{ marginBottom: '12px' }}>Formats de formation</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '12px' }}>Affiché sur le site : Page Domaines → Cartes "Intra-organisation", "Inter-organisations", "Sur site"</p>
          {domaines.domaine4.formats.map((f, i) => (
            <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
              <div className="admin-input-grid mb-2" style={{ gridTemplateColumns: '80px 1fr' }}>
                <div className="form-group">
                  <label>Icône</label>
                  <input type="text" value={f.icon} onChange={e => updateFormatCard(i, 'icon', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Titre</label>
                  <input type="text" value={f.title} onChange={e => updateFormatCard(i, 'title', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="2" value={f.desc} onChange={e => updateFormatCard(i, 'desc', e.target.value)}></textarea>
              </div>
            </div>
          ))}

          <div className="golden-divider" style={{ margin: '20px 0' }}></div>
          <h3 style={{ marginBottom: '12px' }}>Thèmes de formation (badges)</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '12px' }}>Affiché sur le site : Page Domaines → Badges de thèmes de formation</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {domaines.domaine4.themes.map((t, i) => (
              <span key={i} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                {t}
                <button style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', lineHeight: 1 }} onClick={() => removeFromList('domaine4', 'themes', i)}>✕</button>
              </span>
            ))}
          </div>
          <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
            <input type="text" value={newTheme} onChange={e => setNewTheme(e.target.value)} placeholder="Ex: Soft Skills…" onKeyDown={e => { if (e.key === 'Enter') { addToList('domaine4', 'themes', newTheme); setNewTheme(''); } }} />
            <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => { addToList('domaine4', 'themes', newTheme); setNewTheme(''); }}>＋</button>
          </div>

          <div className="form-group mt-4 mb-4">
            <label>Références clients</label>
            <ul className="draggable-list mb-2">
              {domaines.domaine4.references.map((r, i) => (
                <li key={i} className="draggable-item" style={{ cursor: 'default' }}>
                  <div className="draggable-item-content">{r}</div>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => removeFromList('domaine4', 'references', i)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
              <input type="text" value={newRef} onChange={e => setNewRef(e.target.value)} placeholder="Ex: DP World — Formation Informatique…" />
              <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => { addToList('domaine4', 'references', newRef); setNewRef(''); }}>＋</button>
            </div>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => saveDomaine('domaine4')}>
              💾 Enregistrer Domaine 4
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      {activeTab === 'cta' && (
        <div className="admin-card">
          <h2 className="admin-card-title">Bannière d'Appel à l'Action (CTA)</h2>
          <SectionHint label="Page Domaines → Bloc de fin de page avec bouton de contact" />
          <div className="admin-form">
            <div className="form-group mb-4">
              <label>Titre</label>
              <input type="text" value={ctaTitle} onChange={e => setCtaTitle(e.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label>Sous-titre</label>
              <input type="text" value={ctaSubtitle} onChange={e => setCtaSubtitle(e.target.value)} />
            </div>
            <div className="admin-input-grid mb-4">
              <div className="form-group">
                <label>Texte du bouton</label>
                <input type="text" value={ctaBtnText} onChange={e => setCtaBtnText(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Lien du bouton</label>
                <input type="text" value={ctaBtnLink} onChange={e => setCtaBtnLink(e.target.value)} />
              </div>
            </div>
            <div className="form-actions-bar">
              <button className="admin-btn admin-btn-secondary" onClick={() => save('Bannière CTA', [
                { page: 'domaines', section: 'cta', cle: 'title', valeur: ctaTitle, type: 'texte' },
                { page: 'domaines', section: 'cta', cle: 'subtitle', valeur: ctaSubtitle, type: 'texte' },
                { page: 'domaines', section: 'cta', cle: 'btn_text', valeur: ctaBtnText, type: 'texte' },
                { page: 'domaines', section: 'cta', cle: 'btn_link', valeur: ctaBtnLink, type: 'texte' }
              ])}>💾 Enregistrer CTA</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GestionDomaines;
