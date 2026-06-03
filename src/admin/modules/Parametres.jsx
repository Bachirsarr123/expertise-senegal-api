import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Parametres = ({ triggerToast, triggerConfirm }) => {
  const [loading, setLoading] = useState(true);

  // Site Settings
  const [siteName, setSiteName] = useState('');
  const [siteSlogan, setSiteSlogan] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Contact details
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  // Legal details
  const [legalRC, setLegalRC] = useState('');
  const [legalNinea, setLegalNinea] = useState('');
  const [legalCapital, setLegalCapital] = useState('');
  const [legalFiscalCentre, setLegalFiscalCentre] = useState('');
  const [legalActivity, setLegalActivity] = useState('');

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/api/content/parametres');
      const params = response.data;

      setSiteName(params.site_name || 'Expertise Sénégal');
      setSiteSlogan(params.site_slogan || 'Cabinet Conseil & Études');
      setMaintenanceMode(params.maintenance_mode === 'true');

      setContactPhone(params.contact_phone || '');
      setContactEmail(params.contact_email || '');
      setContactAddress(params.contact_address || '');

      setLegalRC(params.legal_rc || '');
      setLegalNinea(params.legal_ninea || '');
      setLegalCapital(params.legal_capital || '');
      setLegalFiscalCentre(params.legal_fiscal_centre || '');
      setLegalActivity(params.legal_activity || '');

      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      triggerToast('Erreur lors du chargement des paramètres.', 'error');
    }
  };

  const handleSaveGeneralSettings = () => {
    triggerConfirm('Enregistrer les modifications des paramètres généraux ?', async () => {
      try {
        const settings = {
          site_name: siteName,
          site_slogan: siteSlogan,
          maintenance_mode: String(maintenanceMode),
          contact_phone: contactPhone,
          contact_email: contactEmail,
          contact_address: contactAddress,
          legal_rc: legalRC,
          legal_ninea: legalNinea,
          legal_capital: legalCapital,
          legal_fiscal_centre: legalFiscalCentre,
          legal_activity: legalActivity
        };

        await axiosInstance.put('/api/content/parametres', settings);
        triggerToast('Paramètres généraux mis à jour.');
      } catch (err) {
        console.error('Error saving settings:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      triggerToast('Veuillez remplir tous les champs du mot de passe.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerToast('Les nouveaux mots de passe ne correspondent pas.', 'error');
      return;
    }

    triggerConfirm('Confirmer le changement de mot de passe administrateur ?', async () => {
      try {
        await axiosInstance.post('/api/auth/change-password', {
          currentPassword,
          newPassword
        });

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        triggerToast('Votre mot de passe a été modifié avec succès.');
      } catch (err) {
        console.error('Error changing password:', err);
        if (err.response && err.response.data && err.response.data.message) {
          triggerToast(err.response.data.message, 'error');
        } else {
          triggerToast('Erreur lors de la modification du mot de passe.', 'error');
        }
      }
    });
  };

  if (loading) return <div className="loading-spinner">Chargement des paramètres généraux...</div>;

  return (
    <div className="gestion-parametres-module">
      {/* General Settings */}
      <div className="admin-card">
        <h2 className="admin-card-title">Paramètres généraux du site</h2>
        <div className="admin-form">
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Nom du site</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Slogan de l'entreprise</label>
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
                  {maintenanceMode ? 'ACTIF (Site inaccessible au public)' : 'INACTIF (Site public en ligne)'}
                </span>
              </div>
            </div>
          </div>

          <div className="golden-divider" style={{ margin: '30px 0' }}></div>

          <h3>Coordonnées de l'entreprise</h3>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Téléphone de contact</label>
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

          <h3>Informations Administratives &amp; Légales</h3>
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>N° Registre du Commerce (RC)</label>
              <input type="text" value={legalRC} onChange={e => setLegalRC(e.target.value)} />
            </div>
            <div className="form-group">
              <label>N° NINEA</label>
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
            <label>Activité déclarée</label>
            <input type="text" value={legalActivity} onChange={e => setLegalActivity(e.target.value)} />
          </div>

          <button className="admin-btn admin-btn-secondary" onClick={handleSaveGeneralSettings}>
            💾 Enregistrer Paramètres
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="admin-card">
        <h2 className="admin-card-title">Sécurité - Modifier le mot de passe administrateur</h2>
        <form onSubmit={handleChangePasswordSubmit} className="admin-form">
          <div className="form-group mb-3">
            <label>Mot de passe actuel</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
            <div className="form-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-danger">
            🔑 Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Parametres;
