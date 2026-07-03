import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import ImageUploadButton from '../components/ImageUploadButton';

const SITE = 'https://www.expertisesenegal.com';

const SectionHint = ({ label }) => (
  <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span>📍</span> <span>Affiché sur le site : <strong>{label}</strong></span>
    <a href={`${SITE}/a-propos`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--or)', marginLeft: '8px' }}>Voir →</a>
  </p>
);

const GestionAPropos = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);

  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  const [presentationTitle, setPresentationTitle] = useState('');
  const [presentationText, setPresentationText] = useState('');
  const [presentationImage, setPresentationImage] = useState('');

  const [visionTitle, setVisionTitle] = useState('');
  const [visionSubtitle, setVisionSubtitle] = useState('');
  const [visionCards, setVisionCards] = useState([
    { icon: '🎯', text: '' }, { icon: '🛠️', text: '' }, { icon: '📊', text: '' }, { icon: '🎓', text: '' }
  ]);

  const [atoutsTitle, setAtoutsTitle] = useState('');
  const [atoutsSubtitle, setAtoutsSubtitle] = useState('');
  const [atoutsCards, setAtoutsCards] = useState([
    { icon: '👥', title: '', desc: '' }, { icon: '🌐', title: '', desc: '' }, { icon: '🗂️', title: '', desc: '' }
  ]);
  const [newAtout, setNewAtout] = useState({ icon: '', title: '', desc: '' });

  // Données admin
  const [directorName, setDirectorName] = useState('');
  const [legalForm, setLegalForm] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [adminRC, setAdminRC] = useState('');
  const [adminNinea, setAdminNinea] = useState('');
  const [adminCapital, setAdminCapital] = useState('');
  const [adminFiscalCentre, setAdminFiscalCentre] = useState('');
  const [adminActivity, setAdminActivity] = useState('');

  // CTA
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');
  const [ctaBtnText, setCtaBtnText] = useState('');
  const [ctaBtnLink, setCtaBtnLink] = useState('');

  useEffect(() => { fetchContent(); }, []);

  const parseJson = (str, fallback) => { try { return JSON.parse(str); } catch { return fallback; } };

  const fetchContent = async () => {
    try {
      const [contentRes, paramsRes] = await Promise.all([
        axiosInstance.get('/api/content/all'),
        axiosInstance.get('/api/content/parametres')
      ]);
      const ap = contentRes.data.apropos || {};
      const params = paramsRes.data;

      if (ap.hero) {
        setHeroBadge(ap.hero.badge || '');
        setHeroTitleWhite(ap.hero.title_white || '');
        setHeroTitleGold(ap.hero.title_gold || '');
        setHeroSubtitle(ap.hero.subtitle || '');
      }
      if (ap.presentation) {
        setPresentationTitle(ap.presentation.title || '');
        setPresentationText(ap.presentation.text || '');
        setPresentationImage(ap.presentation.image || '');
      }
      if (ap.vision) {
        setVisionTitle(ap.vision.title || '');
        setVisionSubtitle(ap.vision.subtitle || '');
        if (ap.vision.cards) setVisionCards(parseJson(ap.vision.cards, visionCards));
      }
      if (ap.atouts) {
        setAtoutsTitle(ap.atouts.title || '');
        setAtoutsSubtitle(ap.atouts.subtitle || '');
        if (ap.atouts.cards) setAtoutsCards(parseJson(ap.atouts.cards, atoutsCards));
      }
      if (ap.cta) {
        setCtaTitle(ap.cta.title || '');
        setCtaSubtitle(ap.cta.subtitle || '');
        setCtaBtnText(ap.cta.btn_text || '');
        setCtaBtnLink(ap.cta.btn_link || '');
      }

      setDirectorName(params.director_name || '');
      setLegalForm(params.legal_form || '');
      setAdminPhone(params.contact_phone || '');
      setAdminEmail(params.contact_email || '');
      setAdminAddress(params.contact_address || '');
      setAdminRC(params.legal_rc || '');
      setAdminNinea(params.legal_ninea || '');
      setAdminCapital(params.legal_capital || '');
      setAdminFiscalCentre(params.legal_fiscal_centre || '');
      setAdminActivity(params.legal_activity || '');

      setLoading(false);
    } catch (err) {
      triggerToast('Erreur lors du chargement.', 'error');
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

  const saveParams = async (label, settings) => {
    triggerConfirm(`Enregistrer ${label} ?`, async () => {
      try {
        await axiosInstance.put('/api/content/parametres', settings);
        triggerToast(`${label} mis à jour.`);
      } catch {
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const updateVisionCard = (i, field, val) => {
    const updated = [...visionCards];
    updated[i] = { ...updated[i], [field]: val };
    setVisionCards(updated);
  };

  const updateAtoutCard = (i, field, val) => {
    const updated = [...atoutsCards];
    updated[i] = { ...updated[i], [field]: val };
    setAtoutsCards(updated);
  };

  const addAtout = () => {
    if (!newAtout.title.trim() || !newAtout.desc.trim()) return;
    setAtoutsCards([...atoutsCards, { ...newAtout }]);
    setNewAtout({ icon: '', title: '', desc: '' });
  };

  const removeAtout = (i) => setAtoutsCards(atoutsCards.filter((_, j) => j !== i));

  if (loading) return <div className="loading-spinner">Chargement…</div>;

  return (
    <div className="gestion-apropos-module">

      {/* HERO */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bannière Héro</h2>
        <SectionHint label="Page À Propos → Grande bannière en haut de page" />
        <div className="admin-form">
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
            <button className="admin-btn admin-btn-secondary" onClick={() => save('Bannière Héro', [
              { page: 'apropos', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
              { page: 'apropos', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
              { page: 'apropos', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
              { page: 'apropos', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' }
            ])}>💾 Enregistrer Héro</button>
          </div>
        </div>
      </div>

      {/* PRÉSENTATION */}
      <div className="admin-card">
        <h2 className="admin-card-title">Section "Qui sommes-nous ?"</h2>
        <SectionHint label="Page À Propos → Bloc blanc avec texte et photo" />
        <div className="form-group mb-4">
          <label>Titre</label>
          <input type="text" value={presentationTitle} onChange={e => setPresentationTitle(e.target.value)} />
        </div>
        <div className="form-group mb-4">
          <label>Texte (séparer les paragraphes par une ligne vide)</label>
          <textarea rows="6" value={presentationText} onChange={e => setPresentationText(e.target.value)}></textarea>
        </div>
        <div className="form-group mb-4">
          <label>Photo</label>
          <ImageUploadButton currentUrl={presentationImage} onSuccess={url => setPresentationImage(url)} label="Uploader une photo" />
          <input type="text" value={presentationImage} onChange={e => setPresentationImage(e.target.value)} style={{ marginTop: '8px' }} />
        </div>
        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={() => save('Section Présentation', [
            { page: 'apropos', section: 'presentation', cle: 'title', valeur: presentationTitle, type: 'texte' },
            { page: 'apropos', section: 'presentation', cle: 'text', valeur: presentationText, type: 'texte' },
            { page: 'apropos', section: 'presentation', cle: 'image', valeur: presentationImage, type: 'image' }
          ])}>💾 Enregistrer Présentation</button>
        </div>
      </div>

      {/* VISION */}
      <div className="admin-card">
        <h2 className="admin-card-title">Section "Notre Vision"</h2>
        <SectionHint label="Page À Propos → Bloc gris clair avec 4 cartes de vision" />
        <div className="admin-input-grid mb-4">
          <div className="form-group">
            <label>Libellé de section (petit texte doré)</label>
            <input type="text" value={visionSubtitle} onChange={e => setVisionSubtitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Titre principal</label>
            <input type="text" value={visionTitle} onChange={e => setVisionTitle(e.target.value)} />
          </div>
        </div>
        {visionCards.map((card, i) => (
          <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
            <div className="admin-input-grid" style={{ gridTemplateColumns: '80px 1fr' }}>
              <div className="form-group">
                <label>Icône {i + 1}</label>
                <input type="text" value={card.icon} onChange={e => updateVisionCard(i, 'icon', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Texte de la carte {i + 1}</label>
                <textarea rows="2" value={card.text} onChange={e => updateVisionCard(i, 'text', e.target.value)}></textarea>
              </div>
            </div>
          </div>
        ))}
        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={() => save('Section Vision', [
            { page: 'apropos', section: 'vision', cle: 'title', valeur: visionTitle, type: 'texte' },
            { page: 'apropos', section: 'vision', cle: 'subtitle', valeur: visionSubtitle, type: 'texte' },
            { page: 'apropos', section: 'vision', cle: 'cards', valeur: JSON.stringify(visionCards), type: 'texte' }
          ])}>💾 Enregistrer Vision</button>
        </div>
      </div>

      {/* ATOUTS */}
      <div className="admin-card">
        <h2 className="admin-card-title">Section "Nos Atouts"</h2>
        <SectionHint label="Page À Propos → Bloc sombre avec cartes d'atouts" />
        <div className="admin-input-grid mb-4">
          <div className="form-group">
            <label>Libellé de section (petit texte doré)</label>
            <input type="text" value={atoutsSubtitle} onChange={e => setAtoutsSubtitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Titre principal</label>
            <input type="text" value={atoutsTitle} onChange={e => setAtoutsTitle(e.target.value)} />
          </div>
        </div>
        {atoutsCards.map((atout, i) => (
          <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>Atout {i + 1}</span>
              <button className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => removeAtout(i)}>Supprimer</button>
            </div>
            <div className="admin-input-grid mb-2" style={{ gridTemplateColumns: '80px 1fr' }}>
              <div className="form-group">
                <label>Icône</label>
                <input type="text" value={atout.icon} onChange={e => updateAtoutCard(i, 'icon', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Titre</label>
                <input type="text" value={atout.title} onChange={e => updateAtoutCard(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="2" value={atout.desc} onChange={e => updateAtoutCard(i, 'desc', e.target.value)}></textarea>
            </div>
          </div>
        ))}
        <div style={{ border: '1.5px dashed #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Ajouter un atout</p>
          <div className="admin-input-grid mb-2" style={{ gridTemplateColumns: '80px 1fr' }}>
            <div className="form-group">
              <label>Icône</label>
              <input type="text" value={newAtout.icon} onChange={e => setNewAtout({...newAtout, icon: e.target.value})} placeholder="🌍" />
            </div>
            <div className="form-group">
              <label>Titre</label>
              <input type="text" value={newAtout.title} onChange={e => setNewAtout({...newAtout, title: e.target.value})} placeholder="Ex: Ancrage local" />
            </div>
          </div>
          <div className="form-group mb-3">
            <label>Description</label>
            <textarea rows="2" value={newAtout.desc} onChange={e => setNewAtout({...newAtout, desc: e.target.value})} placeholder="Décrivez cet atout…"></textarea>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={addAtout}>＋ Ajouter cet atout</button>
        </div>
        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={() => save('Section Atouts', [
            { page: 'apropos', section: 'atouts', cle: 'title', valeur: atoutsTitle, type: 'texte' },
            { page: 'apropos', section: 'atouts', cle: 'subtitle', valeur: atoutsSubtitle, type: 'texte' },
            { page: 'apropos', section: 'atouts', cle: 'cards', valeur: JSON.stringify(atoutsCards), type: 'texte' }
          ])}>💾 Enregistrer Atouts</button>
        </div>
      </div>

      {/* DONNÉES ADMINISTRATIVES */}
      <div className="admin-card">
        <h2 className="admin-card-title">Données Administratives & Légales</h2>
        <SectionHint label="Page À Propos → Tableau d'informations légales (aussi visible Footer et Contact)" />
        <div className="admin-form">
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Nom du Directeur</label>
              <input type="text" value={directorName} onChange={e => setDirectorName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Forme juridique</label>
              <input type="text" value={legalForm} onChange={e => setLegalForm(e.target.value)} placeholder="Ex: SARL" />
            </div>
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Téléphone</label>
              <input type="text" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Adresse</label>
            <input type="text" value={adminAddress} onChange={e => setAdminAddress(e.target.value)} />
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>N° RC</label>
              <input type="text" value={adminRC} onChange={e => setAdminRC(e.target.value)} />
            </div>
            <div className="form-group">
              <label>NINEA</label>
              <input type="text" value={adminNinea} onChange={e => setAdminNinea(e.target.value)} />
            </div>
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Capital Social</label>
              <input type="text" value={adminCapital} onChange={e => setAdminCapital(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Centre Fiscal</label>
              <input type="text" value={adminFiscalCentre} onChange={e => setAdminFiscalCentre(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Activité déclarée</label>
            <input type="text" value={adminActivity} onChange={e => setAdminActivity(e.target.value)} />
          </div>
          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={() => saveParams('Données Administratives', {
              director_name: directorName, legal_form: legalForm,
              contact_phone: adminPhone, contact_email: adminEmail, contact_address: adminAddress,
              legal_rc: adminRC, legal_ninea: adminNinea, legal_capital: adminCapital,
              legal_fiscal_centre: adminFiscalCentre, legal_activity: adminActivity
            })}>💾 Enregistrer les données</button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bannière d'Appel à l'Action (CTA)</h2>
        <SectionHint label="Page À Propos → Bloc de fin de page avec bouton de contact" />
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
              { page: 'apropos', section: 'cta', cle: 'title', valeur: ctaTitle, type: 'texte' },
              { page: 'apropos', section: 'cta', cle: 'subtitle', valeur: ctaSubtitle, type: 'texte' },
              { page: 'apropos', section: 'cta', cle: 'btn_text', valeur: ctaBtnText, type: 'texte' },
              { page: 'apropos', section: 'cta', cle: 'btn_link', valeur: ctaBtnLink, type: 'texte' }
            ])}>💾 Enregistrer CTA</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GestionAPropos;
