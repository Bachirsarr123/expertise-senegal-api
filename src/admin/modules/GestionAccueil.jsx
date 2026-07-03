import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import ImageUploadButton from '../components/ImageUploadButton';

const SITE = 'https://www.expertisesenegal.com';

const SectionHint = ({ label }) => (
  <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span>📍</span> <span>Affiché sur le site : <strong>{label}</strong></span>
    <a href={SITE} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--or)', marginLeft: '8px' }}>Voir →</a>
  </p>
);

const GestionAccueil = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);

  // Hero
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaPrimaryText, setHeroCtaPrimaryText] = useState('');
  const [heroCtaPrimaryLink, setHeroCtaPrimaryLink] = useState('');
  const [heroCtaSecondaryText, setHeroCtaSecondaryText] = useState('');
  const [heroCtaSecondaryLink, setHeroCtaSecondaryLink] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');

  // Stats
  const [stat1Num, setStat1Num] = useState('');
  const [stat1Lbl, setStat1Lbl] = useState('');
  const [stat2Num, setStat2Num] = useState('');
  const [stat2Lbl, setStat2Lbl] = useState('');
  const [stat3Num, setStat3Num] = useState('');
  const [stat3Lbl, setStat3Lbl] = useState('');
  const [stat4Num, setStat4Num] = useState('');
  const [stat4Lbl, setStat4Lbl] = useState('');

  // About summary
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [aboutBtnText, setAboutBtnText] = useState('');
  const [aboutBtnLink, setAboutBtnLink] = useState('');

  // Domaines preview cards
  const [domainesTitle, setDomainesTitle] = useState('');
  const [domainesCards, setDomainesCards] = useState([
    { icon: '📊', title: '', text: '' },
    { icon: '📋', title: '', text: '' },
    { icon: '🔍', title: '', text: '' },
    { icon: '🎓', title: '', text: '' }
  ]);

  // Formations vedette
  const [formationsTitle, setFormationsTitle] = useState('');
  const [formationsCards, setFormationsCards] = useState([
    { icon: '⚖️', title: '', items: [] },
    { icon: '📁', title: '', items: [] },
    { icon: '💰', title: '', items: [] }
  ]);
  const [formationsCtaText, setFormationsCtaText] = useState('');
  const [formationsCtaLink, setFormationsCtaLink] = useState('');
  const [newFormationItem, setNewFormationItem] = useState(['', '', '']);

  // Clients
  const [clientsTitle, setClientsTitle] = useState('');
  const [clientsList, setClientsList] = useState([]);
  const [newClient, setNewClient] = useState('');

  // CTA
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');
  const [ctaBtnText, setCtaBtnText] = useState('');
  const [ctaBtnLink, setCtaBtnLink] = useState('');

  useEffect(() => { fetchContent(); }, []);

  const parseJson = (str, fallback) => { try { return JSON.parse(str); } catch { return fallback; } };

  const fetchContent = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/all');
      const a = data.accueil || {};

      if (a.hero) {
        setHeroBadge(a.hero.badge || '');
        setHeroTitleWhite(a.hero.title_white || '');
        setHeroTitleGold(a.hero.title_gold || '');
        setHeroSubtitle(a.hero.subtitle || '');
        setHeroCtaPrimaryText(a.hero.cta_primary_text || '');
        setHeroCtaPrimaryLink(a.hero.cta_primary_link || '');
        setHeroCtaSecondaryText(a.hero.cta_secondary_text || '');
        setHeroCtaSecondaryLink(a.hero.cta_secondary_link || '');
        setHeroBgImage(a.hero.bg_image || '');
      }

      if (a.stats) {
        setStat1Num(a.stats.stat1_num || ''); setStat1Lbl(a.stats.stat1_lbl || '');
        setStat2Num(a.stats.stat2_num || ''); setStat2Lbl(a.stats.stat2_lbl || '');
        setStat3Num(a.stats.stat3_num || ''); setStat3Lbl(a.stats.stat3_lbl || '');
        setStat4Num(a.stats.stat4_num || ''); setStat4Lbl(a.stats.stat4_lbl || '');
      }

      if (a.apropos) {
        setAboutTitle(a.apropos.title || '');
        setAboutText(a.apropos.text || '');
        setAboutImage(a.apropos.image || '');
        setAboutBtnText(a.apropos.btn_text || '');
        setAboutBtnLink(a.apropos.btn_link || '');
      }

      if (a.domaines) {
        setDomainesTitle(a.domaines.title || '');
        if (a.domaines.cards) setDomainesCards(parseJson(a.domaines.cards, domainesCards));
      }

      if (a.formations_vedette) {
        setFormationsTitle(a.formations_vedette.title || '');
        if (a.formations_vedette.cards) setFormationsCards(parseJson(a.formations_vedette.cards, formationsCards));
        setFormationsCtaText(a.formations_vedette.cta_text || '');
        setFormationsCtaLink(a.formations_vedette.cta_link || '');
      }

      if (a.clients) {
        setClientsTitle(a.clients.title || '');
        if (a.clients.list) setClientsList(parseJson(a.clients.list, []));
      }

      if (a.cta) {
        setCtaTitle(a.cta.title || '');
        setCtaSubtitle(a.cta.subtitle || '');
        setCtaBtnText(a.cta.btn_text || '');
        setCtaBtnLink(a.cta.btn_link || '');
      }

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

  const updateDomaineCard = (i, field, val) => {
    const updated = [...domainesCards];
    updated[i] = { ...updated[i], [field]: val };
    setDomainesCards(updated);
  };

  const updateFormationCard = (i, field, val) => {
    const updated = [...formationsCards];
    updated[i] = { ...updated[i], [field]: val };
    setFormationsCards(updated);
  };

  const addFormationItem = (cardIdx) => {
    const val = newFormationItem[cardIdx]?.trim();
    if (!val) return;
    const updated = [...formationsCards];
    updated[cardIdx].items = [...(updated[cardIdx].items || []), val];
    setFormationsCards(updated);
    const ni = [...newFormationItem];
    ni[cardIdx] = '';
    setNewFormationItem(ni);
  };

  const removeFormationItem = (cardIdx, itemIdx) => {
    const updated = [...formationsCards];
    updated[cardIdx].items = updated[cardIdx].items.filter((_, i) => i !== itemIdx);
    setFormationsCards(updated);
  };

  if (loading) return <div className="loading-spinner">Chargement…</div>;

  return (
    <div className="gestion-accueil-module">

      {/* HERO */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bannière Héro</h2>
        <SectionHint label="Page Accueil → Grande bannière en haut de page" />
        <div className="admin-form">
          <div className="form-group mb-4">
            <label>Texte du badge</label>
            <input type="text" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} placeholder="● CABINET DE CONSEIL — DAKAR, SÉNÉGAL" />
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
            <textarea rows="3" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)}></textarea>
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
            <label>Image de fond</label>
            <ImageUploadButton currentUrl={heroBgImage} onSuccess={url => setHeroBgImage(url)} label="Uploader une image de fond" />
            <input type="text" value={heroBgImage} onChange={e => setHeroBgImage(e.target.value)} placeholder="https://..." style={{ marginTop: '8px' }} />
          </div>
          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => save('Bannière Héro', [
              { page: 'accueil', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'cta_primary_text', valeur: heroCtaPrimaryText, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'cta_primary_link', valeur: heroCtaPrimaryLink, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'cta_secondary_text', valeur: heroCtaSecondaryText, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'cta_secondary_link', valeur: heroCtaSecondaryLink, type: 'texte' },
              { page: 'accueil', section: 'hero', cle: 'bg_image', valeur: heroBgImage, type: 'image' }
            ])}>💾 Enregistrer Héro</button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="admin-card">
        <h2 className="admin-card-title">Chiffres Clés</h2>
        <SectionHint label="Page Accueil → Bande de chiffres sous le héro" />
        <div className="admin-form">
          {[
            [stat1Num, setStat1Num, stat1Lbl, setStat1Lbl, 1],
            [stat2Num, setStat2Num, stat2Lbl, setStat2Lbl, 2],
            [stat3Num, setStat3Num, stat3Lbl, setStat3Lbl, 3],
            [stat4Num, setStat4Num, stat4Lbl, setStat4Lbl, 4]
          ].map(([num, setNum, lbl, setLbl, n]) => (
            <div className="admin-input-grid mb-3" key={n}>
              <div className="form-group">
                <label>Chiffre {n}</label>
                <input type="text" value={num} onChange={e => setNum(e.target.value)} placeholder="Ex: 8+" />
              </div>
              <div className="form-group">
                <label>Libellé {n}</label>
                <input type="text" value={lbl} onChange={e => setLbl(e.target.value)} placeholder="Ex: Années d'expérience" />
              </div>
            </div>
          ))}
          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => save('Chiffres Clés', [
              { page: 'accueil', section: 'stats', cle: 'stat1_num', valeur: stat1Num, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat1_lbl', valeur: stat1Lbl, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat2_num', valeur: stat2Num, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat2_lbl', valeur: stat2Lbl, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat3_num', valeur: stat3Num, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat3_lbl', valeur: stat3Lbl, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat4_num', valeur: stat4Num, type: 'texte' },
              { page: 'accueil', section: 'stats', cle: 'stat4_lbl', valeur: stat4Lbl, type: 'texte' }
            ])}>💾 Enregistrer Chiffres</button>
          </div>
        </div>
      </div>

      {/* ABOUT SUMMARY */}
      <div className="admin-card">
        <h2 className="admin-card-title">Section "À Propos" (résumé)</h2>
        <SectionHint label="Page Accueil → Bloc gris clair de présentation du cabinet" />
        <div className="admin-form">
          <div className="form-group mb-4">
            <label>Titre</label>
            <input type="text" value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} />
          </div>
          <div className="form-group mb-4">
            <label>Texte descriptif (séparer les paragraphes par une ligne vide)</label>
            <textarea rows="5" value={aboutText} onChange={e => setAboutText(e.target.value)}></textarea>
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Texte du bouton</label>
              <input type="text" value={aboutBtnText} onChange={e => setAboutBtnText(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Lien du bouton</label>
              <input type="text" value={aboutBtnLink} onChange={e => setAboutBtnLink(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Photo illustrative</label>
            <ImageUploadButton currentUrl={aboutImage} onSuccess={url => setAboutImage(url)} label="Uploader une photo" />
            <input type="text" value={aboutImage} onChange={e => setAboutImage(e.target.value)} style={{ marginTop: '8px' }} />
          </div>
          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => save('Section À Propos', [
              { page: 'accueil', section: 'apropos', cle: 'title', valeur: aboutTitle, type: 'texte' },
              { page: 'accueil', section: 'apropos', cle: 'text', valeur: aboutText, type: 'texte' },
              { page: 'accueil', section: 'apropos', cle: 'image', valeur: aboutImage, type: 'image' },
              { page: 'accueil', section: 'apropos', cle: 'btn_text', valeur: aboutBtnText, type: 'texte' },
              { page: 'accueil', section: 'apropos', cle: 'btn_link', valeur: aboutBtnLink, type: 'texte' }
            ])}>💾 Enregistrer Présentation</button>
          </div>
        </div>
      </div>

      {/* DOMAINES PREVIEW */}
      <div className="admin-card">
        <h2 className="admin-card-title">Section "Domaines d'Intervention" (aperçu)</h2>
        <SectionHint label="Page Accueil → Bloc sombre avec les 4 cartes de domaines" />
        <div className="form-group mb-4">
          <label>Titre de section</label>
          <input type="text" value={domainesTitle} onChange={e => setDomainesTitle(e.target.value)} />
        </div>
        {domainesCards.map((card, i) => (
          <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--or)' }}>Carte {i + 1}</p>
            <div className="admin-input-grid mb-3" style={{ gridTemplateColumns: '80px 1fr' }}>
              <div className="form-group">
                <label>Icône</label>
                <input type="text" value={card.icon} onChange={e => updateDomaineCard(i, 'icon', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Titre</label>
                <input type="text" value={card.title} onChange={e => updateDomaineCard(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Texte descriptif</label>
              <textarea rows="2" value={card.text} onChange={e => updateDomaineCard(i, 'text', e.target.value)}></textarea>
            </div>
          </div>
        ))}
        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={() => save('Domaines aperçu', [
            { page: 'accueil', section: 'domaines', cle: 'title', valeur: domainesTitle, type: 'texte' },
            { page: 'accueil', section: 'domaines', cle: 'cards', valeur: JSON.stringify(domainesCards), type: 'texte' }
          ])}>💾 Enregistrer Domaines</button>
        </div>
      </div>

      {/* FORMATIONS VEDETTE */}
      <div className="admin-card">
        <h2 className="admin-card-title">Formations Vedettes</h2>
        <SectionHint label="Page Accueil → Section blanche avec 3 cartes de formations" />
        <div className="form-group mb-4">
          <label>Titre de section</label>
          <input type="text" value={formationsTitle} onChange={e => setFormationsTitle(e.target.value)} />
        </div>
        {formationsCards.map((card, ci) => (
          <div key={ci} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--or)' }}>Formation {ci + 1}</p>
            <div className="admin-input-grid mb-3" style={{ gridTemplateColumns: '80px 1fr' }}>
              <div className="form-group">
                <label>Icône</label>
                <input type="text" value={card.icon} onChange={e => updateFormationCard(ci, 'icon', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Titre</label>
                <input type="text" value={card.title} onChange={e => updateFormationCard(ci, 'title', e.target.value)} />
              </div>
            </div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Points du programme :</label>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px' }}>
              {(card.items || []).map((item, ii) => (
                <li key={ii} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span>{item}</span>
                  <button style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => removeFormationItem(ci, ii)}>✕</button>
                </li>
              ))}
            </ul>
            <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
              <input type="text" value={newFormationItem[ci] || ''} onChange={e => { const ni = [...newFormationItem]; ni[ci] = e.target.value; setNewFormationItem(ni); }} placeholder="Ajouter un point…" />
              <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => addFormationItem(ci)}>＋</button>
            </div>
          </div>
        ))}
        <div className="admin-input-grid mb-4">
          <div className="form-group">
            <label>Texte du bouton</label>
            <input type="text" value={formationsCtaText} onChange={e => setFormationsCtaText(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Lien du bouton</label>
            <input type="text" value={formationsCtaLink} onChange={e => setFormationsCtaLink(e.target.value)} />
          </div>
        </div>
        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={() => save('Formations Vedettes', [
            { page: 'accueil', section: 'formations_vedette', cle: 'title', valeur: formationsTitle, type: 'texte' },
            { page: 'accueil', section: 'formations_vedette', cle: 'cards', valeur: JSON.stringify(formationsCards), type: 'texte' },
            { page: 'accueil', section: 'formations_vedette', cle: 'cta_text', valeur: formationsCtaText, type: 'texte' },
            { page: 'accueil', section: 'formations_vedette', cle: 'cta_link', valeur: formationsCtaLink, type: 'texte' }
          ])}>💾 Enregistrer Formations</button>
        </div>
      </div>

      {/* CLIENTS */}
      <div className="admin-card">
        <h2 className="admin-card-title">Clients de Référence</h2>
        <SectionHint label="Page Accueil → Section grise « Ils nous font confiance »" />
        <div className="form-group mb-4">
          <label>Titre de section</label>
          <input type="text" value={clientsTitle} onChange={e => setClientsTitle(e.target.value)} />
        </div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Liste des clients :</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {clientsList.map((c, i) => (
            <span key={i} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              {c}
              <button style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', lineHeight: 1 }} onClick={() => setClientsList(clientsList.filter((_, j) => j !== i))}>✕</button>
            </span>
          ))}
        </div>
        <div className="admin-input-grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
          <input type="text" value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="Ajouter un client…" onKeyDown={e => { if (e.key === 'Enter' && newClient.trim()) { setClientsList([...clientsList, newClient.trim()]); setNewClient(''); } }} />
          <button className="admin-btn admin-btn-primary" style={{ marginLeft: '8px' }} onClick={() => { if (newClient.trim()) { setClientsList([...clientsList, newClient.trim()]); setNewClient(''); } }}>＋ Ajouter</button>
        </div>
        <div className="form-actions-bar" style={{ marginTop: '16px' }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => save('Clients de Référence', [
            { page: 'accueil', section: 'clients', cle: 'title', valeur: clientsTitle, type: 'texte' },
            { page: 'accueil', section: 'clients', cle: 'list', valeur: JSON.stringify(clientsList), type: 'texte' }
          ])}>💾 Enregistrer Clients</button>
        </div>
      </div>

      {/* CTA */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bannière d'Appel à l'Action (CTA)</h2>
        <SectionHint label="Page Accueil → Bloc doré en bas de page avec bouton de contact" />
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
              { page: 'accueil', section: 'cta', cle: 'title', valeur: ctaTitle, type: 'texte' },
              { page: 'accueil', section: 'cta', cle: 'subtitle', valeur: ctaSubtitle, type: 'texte' },
              { page: 'accueil', section: 'cta', cle: 'btn_text', valeur: ctaBtnText, type: 'texte' },
              { page: 'accueil', section: 'cta', cle: 'btn_link', valeur: ctaBtnLink, type: 'texte' }
            ])}>💾 Enregistrer CTA</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GestionAccueil;
