import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionAPropos = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);

  // Content state
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleWhite, setHeroTitleWhite] = useState('');
  const [heroTitleGold, setHeroTitleGold] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  const [presentationTitle, setPresentationTitle] = useState('');
  const [presentationText, setPresentationText] = useState('');

  const [visionTitle, setVisionTitle] = useState('');
  const [visionPoints, setVisionPoints] = useState([]);
  const [newVisionPoint, setNewVisionPoint] = useState('');

  const [atoutsTitle, setAtoutsTitle] = useState('');
  const [atoutsList, setAtoutsList] = useState([]);
  const [newAtout, setNewAtout] = useState({ title: '', desc: '' });

  // Admin Data state
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [adminRC, setAdminRC] = useState('');
  const [adminNinea, setAdminNinea] = useState('');
  const [adminCapital, setAdminCapital] = useState('');
  const [adminFiscalCentre, setAdminFiscalCentre] = useState('');
  const [adminActivity, setAdminActivity] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axiosInstance.get('/api/content/all');
      const data = response.data.apropos || {};

      // Hero
      if (data.hero) {
        setHeroBadge(data.hero.badge || '');
        setHeroTitleWhite(data.hero.title_white || '');
        setHeroTitleGold(data.hero.title_gold || '');
        setHeroSubtitle(data.hero.subtitle || '');
      }

      // Presentation
      if (data.presentation) {
        setPresentationTitle(data.presentation.title || '');
        setPresentationText(data.presentation.text || '');
      }

      // Vision
      if (data.vision) {
        setVisionTitle(data.vision.title || '');
        try {
          setVisionPoints(JSON.parse(data.vision.points || '[]'));
        } catch {
          setVisionPoints([]);
        }
      }

      // Atouts
      if (data.atouts) {
        setAtoutsTitle(data.atouts.title || '');
        try {
          setAtoutsList(JSON.parse(data.atouts.list || '[]'));
        } catch {
          setAtoutsList([]);
        }
      }

      // Admin Data parameters
      const paramsRes = await axiosInstance.get('/api/content/parametres');
      const params = paramsRes.data;
      setAdminPhone(params.contact_phone || '');
      setAdminEmail(params.contact_email || '');
      setAdminAddress(params.contact_address || '');
      setAdminRC(params.legal_rc || '');
      setAdminNinea(params.legal_ninea || '');
      setAdminCapital(params.legal_capital || '');
      setAdminFiscalCentre(params.legal_fiscal_centre || '');
      setAdminActivity(params.legal_activity || '');

      setLoading(false);
    } catch (error) {
      console.error('Error loading About content:', error);
      triggerToast('Erreur lors du chargement des données.', 'error');
    }
  };

  const handleSaveTextContent = async () => {
    triggerConfirm('Enregistrer les textes de la page À Propos ?', async () => {
      try {
        const contents = [
          { page: 'apropos', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
          { page: 'apropos', section: 'hero', cle: 'title_white', valeur: heroTitleWhite, type: 'texte' },
          { page: 'apropos', section: 'hero', cle: 'title_gold', valeur: heroTitleGold, type: 'texte' },
          { page: 'apropos', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' },
          { page: 'apropos', section: 'presentation', cle: 'title', valeur: presentationTitle, type: 'texte' },
          { page: 'apropos', section: 'presentation', cle: 'text', valeur: presentationText, type: 'texte' },
          { page: 'apropos', section: 'vision', cle: 'title', valeur: visionTitle, type: 'texte' },
          { page: 'apropos', section: 'vision', cle: 'points', valeur: JSON.stringify(visionPoints), type: 'texte' },
          { page: 'apropos', section: 'atouts', cle: 'title', valeur: atoutsTitle, type: 'texte' },
          { page: 'apropos', section: 'atouts', cle: 'list', valeur: JSON.stringify(atoutsList), type: 'texte' }
        ];

        await axiosInstance.post('/api/content/save', { contents });
        triggerToast('Textes À Propos enregistrés.');
      } catch (err) {
        console.error('Error saving About texts:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleSaveAdminData = async () => {
    triggerConfirm('Enregistrer les données administratives et légales ?', async () => {
      try {
        const settings = {
          contact_phone: adminPhone,
          contact_email: adminEmail,
          contact_address: adminAddress,
          legal_rc: adminRC,
          legal_ninea: adminNinea,
          legal_capital: adminCapital,
          legal_fiscal_centre: adminFiscalCentre,
          legal_activity: adminActivity
        };

        await axiosInstance.put('/api/content/parametres', settings);
        triggerToast('Données administratives et légales mises à jour.');
      } catch (err) {
        console.error('Error saving admin parameters:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  // Vision point actions
  const addVisionPoint = () => {
    if (!newVisionPoint.trim()) return;
    setVisionPoints([...visionPoints, newVisionPoint.trim()]);
    setNewVisionPoint('');
  };

  const removeVisionPoint = (idx) => {
    setVisionPoints(visionPoints.filter((_, i) => i !== idx));
  };

  // Atouts actions
  const addAtout = () => {
    if (!newAtout.title.trim() || !newAtout.desc.trim()) return;
    setAtoutsList([...atoutsList, { title: newAtout.title.trim(), desc: newAtout.desc.trim() }]);
    setNewAtout({ title: '', desc: '' });
  };

  const removeAtout = (idx) => {
    setAtoutsList(atoutsList.filter((_, i) => i !== idx));
  };

  if (loading) return <div className="loading-spinner">Chargement des données de la page À Propos...</div>;

  return (
    <div className="gestion-apropos-module">
      {/* Text Contents */}
      <div className="admin-card">
        <h2 className="admin-card-title">Présentation &amp; Héro</h2>
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

          <div className="golden-divider" style={{ margin: '20px 0' }}></div>

          <div className="form-group mb-4">
            <label>Titre de Présentation</label>
            <input type="text" value={presentationTitle} onChange={e => setPresentationTitle(e.target.value)} />
          </div>

          <div className="form-group mb-4">
            <label>Texte de Présentation ("Qui sommes-nous ?")</label>
            <textarea rows="6" value={presentationText} onChange={e => setPresentationText(e.target.value)}></textarea>
          </div>

          <div className="form-actions-bar">
            <button className="admin-btn admin-btn-secondary" onClick={handleSaveTextContent}>
              💾 Enregistrer les textes
            </button>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="admin-card">
        <h2 className="admin-card-title">Vision stratégique</h2>
        
        <div className="form-group mb-4">
          <label>Titre Vision</label>
          <input type="text" value={visionTitle} onChange={e => setVisionTitle(e.target.value)} />
        </div>

        <div className="form-group mb-4">
          <label>Points de vision actuels</label>
          <ul className="draggable-list">
            {visionPoints.map((point, idx) => (
              <li key={idx} className="draggable-item" style={{ cursor: 'default' }}>
                <div className="draggable-item-content">{point}</div>
                <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeVisionPoint(idx)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
          <div className="form-group">
            <label>Ajouter un point de vision</label>
            <input 
              type="text" 
              value={newVisionPoint} 
              onChange={e => setNewVisionPoint(e.target.value)} 
              placeholder="Ex: Devenir la référence de l'audit..." 
            />
          </div>
          <button className="admin-btn admin-btn-primary" onClick={addVisionPoint}>
            ＋ Ajouter
          </button>
        </div>

        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={handleSaveTextContent}>
            💾 Enregistrer la Vision
          </button>
        </div>
      </div>

      {/* Atouts */}
      <div className="admin-card">
        <h2 className="admin-card-title">Atouts du cabinet</h2>
        
        <div className="form-group mb-4">
          <label>Titre Section Atouts</label>
          <input type="text" value={atoutsTitle} onChange={e => setAtoutsTitle(e.target.value)} />
        </div>

        <div className="form-group mb-4">
          <label>Atouts actuels</label>
          <div className="draggable-list">
            {atoutsList.map((atout, idx) => (
              <div key={idx} className="draggable-item" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <strong>{atout.title}</strong>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeAtout(idx)}>
                    Supprimer
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--texte-moyen)' }}>{atout.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{ backgroundColor: 'var(--gris-clair)', padding: '20px', border: '1.5px dashed #E5E7EB' }}>
          <h4>Ajouter un nouvel atout</h4>
          <div className="form-group mb-3">
            <label>Titre de l'atout</label>
            <input 
              type="text" 
              value={newAtout.title} 
              onChange={e => setNewAtout({...newAtout, title: e.target.value})} 
              placeholder="Ex: Rigueur scientifique"
            />
          </div>
          <div className="form-group mb-3">
            <label>Description de l'atout</label>
            <textarea 
              rows="2" 
              value={newAtout.desc} 
              onChange={e => setNewAtout({...newAtout, desc: e.target.value})} 
              placeholder="Détaillez en quoi consiste cet atout..."
            ></textarea>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={addAtout}>
            ＋ Ajouter cet atout
          </button>
        </div>

        <div className="form-actions-bar">
          <button className="admin-btn admin-btn-secondary" onClick={handleSaveTextContent}>
            💾 Enregistrer les Atouts
          </button>
        </div>
      </div>

      {/* Données Administratives */}
      <div className="admin-card">
        <h2 className="admin-card-title">Données administratives &amp; légales</h2>
        <p className="mb-4">Ces informations s'affichent dans les tableaux administratifs de la page À Propos, de la page Contact et dans le Footer.</p>
        
        <div className="admin-form">
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Téléphone professionnel</label>
              <input type="text" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email de contact</label>
              <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
            </div>
          </div>

          <div className="form-group mb-4">
            <label>Adresse physique</label>
            <input type="text" value={adminAddress} onChange={e => setAdminAddress(e.target.value)} />
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>N° Registre du Commerce (RC)</label>
              <input type="text" value={adminRC} onChange={e => setAdminRC(e.target.value)} />
            </div>
            <div className="form-group">
              <label>N° NINEA</label>
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
            <button className="admin-btn admin-btn-secondary" onClick={handleSaveAdminData}>
              💾 Enregistrer les données administratives
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionAPropos;
