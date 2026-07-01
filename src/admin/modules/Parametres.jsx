import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Parametres = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);

  const [siteName, setSiteName]         = useState('');
  const [siteSlogan, setSiteSlogan]     = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [contactPhone, setContactPhone]   = useState('');
  const [contactEmail, setContactEmail]   = useState('');
  const [contactAddress, setContactAddress] = useState('');

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [hoursMonFri, setHoursMonFri]       = useState('');
  const [hoursSat, setHoursSat]             = useState('');
  const [hoursSun, setHoursSun]             = useState('');

  const [directorName, setDirectorName]   = useState('');
  const [legalForm, setLegalForm]         = useState('');
  const [foundingDate, setFoundingDate]   = useState('');
  const [legalRC, setLegalRC]             = useState('');
  const [legalNinea, setLegalNinea]       = useState('');
  const [legalCapital, setLegalCapital]   = useState('');
  const [legalFiscalCentre, setLegalFiscalCentre] = useState('');
  const [legalActivity, setLegalActivity] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/parametres');
      setSiteName(data.site_name || 'Expertise Senegal');
      setSiteSlogan(data.site_slogan || 'Cabinet Conseil & Etudes');
      setMaintenanceMode(data.maintenance_mode === 'true');
      setContactPhone(data.contact_phone || '');
      setContactEmail(data.contact_email || '');
      setContactAddress(data.contact_address || '');
      setWhatsappNumber(data.whatsapp_number || '221776434160');
      setHoursMonFri(data.hours_mon_fri || '08h00 - 18h00');
      setHoursSat(data.hours_sat || '09h00 - 13h00');
      setHoursSun(data.hours_sun || 'Ferme');
      setDirectorName(data.director_name || 'Boussirou DIALLO');
      setLegalForm(data.legal_form || 'SARL');
      setFoundingDate(data.founding_date || '22/11/2016');
      setLegalRC(data.legal_rc || '');
      setLegalNinea(data.legal_ninea || '');
      setLegalCapital(data.legal_capital || '');
      setLegalFiscalCentre(data.legal_fiscal_centre || '');
      setLegalActivity(data.legal_activity || '');
    } catch {
      triggerToast('Erreur chargement des parametres.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    triggerConfirm('Enregistrer les modifications ?', async () => {
      try {
        await axiosInstance.put('/api/content/parametres', {
          site_name: siteName,
          site_slogan: siteSlogan,
          maintenance_mode: String(maintenanceMode),
          contact_phone: contactPhone,
          contact_email: contactEmail,
          contact_address: contactAddress,
          whatsapp_number: whatsappNumber,
          hours_mon_fri: hoursMonFri,
          hours_sat: hoursSat,
          hours_sun: hoursSun,
          director_name: directorName,
          legal_form: legalForm,
          founding_date: foundingDate,
          legal_rc: legalRC,
          legal_ninea: legalNinea,
          legal_capital: legalCapital,
          legal_fiscal_centre: legalFiscalCentre,
          legal_activity: legalActivity,
        });
        triggerToast('Parametres mis a jour avec succes.');
      } catch {
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('Veuillez remplir tous les champs.', 'error'); return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('Les nouveaux mots de passe ne correspondent pas.', 'error'); return;
    }
    triggerConfirm('Confirmer le changement de mot de passe ?', async () => {
      try {
        await axiosInstance.post('/api/auth/change-password', { currentPassword, newPassword });
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        triggerToast('Mot de passe modifie avec succes.');
      } catch (err) {
        triggerToast(err.response?.data?.message || 'Erreur changement mot de passe.', 'error');
      }
    });
  };

  if (loading) return <div className="loading-spinner">Chargement des parametres...</div>;

  return (
    <div className="gestion-parametres-module">

      <div className="admin-card">
        <h2 className="admin-card-title">Parametres generaux du site</h2>
        <div className="admin-form">

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Nom du site</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Slogan</label>
              <input type="text" value={siteSlogan} onChange={e => setSiteSlogan(e.target.value)} />
            </div>
          </div>

          <div className="form-group mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <label style={{ margin: 0 }}>Mode maintenance :</label>
              <div className="toggle-switch-container" onClick={() => setMaintenanceMode(!maintenanceMode)}>
                <div className={`toggle-switch ${maintenanceMode ? 'active' : ''}`}>
                  <div className="toggle-switch-handle"></div>
                </div>
                <span className="toggle-switch-label" style={{ color: maintenanceMode ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>
                  {maintenanceMode ? 'ACTIF (site inaccessible)' : 'INACTIF (site en ligne)'}
                </span>
              </div>
            </div>
          </div>

          <div className="golden-divider" style={{ margin: '30px 0' }}></div>

          <h3>Coordonnees de l'entreprise</h3>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Telephone de contact</label>
              <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email de contact</label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Adresse physique</label>
            <input type="text" value={contactAddress} onChange={e => setContactAddress(e.target.value)} />
          </div>

          <div className="golden-divider" style={{ margin: '30px 0' }}></div>

          <h3>WhatsApp & Horaires d'ouverture</h3>
          <div className="form-group mb-4">
            <label>Numero WhatsApp <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 400 }}>(chiffres uniquement, ex: 221776434160)</span></label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="221776434160"
            />
            {whatsappNumber && (
              <p style={{ marginTop: '6px', fontSize: '0.78rem', color: '#6b7280' }}>
                Lien genere : wa.me/{whatsappNumber}
              </p>
            )}
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Lundi - Vendredi</label>
              <input type="text" value={hoursMonFri} onChange={e => setHoursMonFri(e.target.value)} placeholder="08h00 - 18h00" />
            </div>
            <div className="form-group">
              <label>Samedi</label>
              <input type="text" value={hoursSat} onChange={e => setHoursSat(e.target.value)} placeholder="09h00 - 13h00" />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Dimanche</label>
            <input type="text" value={hoursSun} onChange={e => setHoursSun(e.target.value)} placeholder="Ferme" style={{ maxWidth: '280px' }} />
          </div>

          <div className="golden-divider" style={{ margin: '30px 0' }}></div>

          <h3>Identite du Cabinet</h3>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Nom du Directeur</label>
              <input type="text" value={directorName} onChange={e => setDirectorName(e.target.value)} placeholder="Boussirou DIALLO" />
            </div>
            <div className="form-group">
              <label>Forme Juridique</label>
              <input type="text" value={legalForm} onChange={e => setLegalForm(e.target.value)} placeholder="SARL" />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Date de Creation</label>
            <input type="text" value={foundingDate} onChange={e => setFoundingDate(e.target.value)} placeholder="22/11/2016" style={{ maxWidth: '280px' }} />
          </div>

          <div className="golden-divider" style={{ margin: '30px 0' }}></div>

          <h3>Informations Administratives & Legales</h3>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>N Registre du Commerce (RC)</label>
              <input type="text" value={legalRC} onChange={e => setLegalRC(e.target.value)} />
            </div>
            <div className="form-group">
              <label>N NINEA</label>
              <input type="text" value={legalNinea} onChange={e => setLegalNinea(e.target.value)} />
            </div>
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Capital Social</label>
              <input type="text" value={legalCapital} onChange={e => setLegalCapital(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Centre Fiscal</label>
              <input type="text" value={legalFiscalCentre} onChange={e => setLegalFiscalCentre(e.target.value)} />
            </div>
          </div>
          <div className="form-group mb-4">
            <label>Activite declaree</label>
            <input type="text" value={legalActivity} onChange={e => setLegalActivity(e.target.value)} />
          </div>

          <button className="admin-btn admin-btn-secondary" onClick={handleSave}>
            Enregistrer les parametres
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Securite - Modifier le mot de passe</h2>
        <form onSubmit={handleChangePassword} className="admin-form">
          <div className="form-group mb-3">
            <label>Mot de passe actuel</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-danger">
            Mettre a jour le mot de passe
          </button>
        </form>
      </div>

    </div>
  );
};

export default Parametres;