import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionReferences = ({ triggerToast, triggerConfirm }) => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState('');
  const [secteur, setSecteur] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [ordre, setOrdre] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/references');
      setReferences(data);
    } catch {
      triggerToast('Impossible de charger les references.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await axiosInstance.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLogoUrl(data.chemin || data.url || '');
      triggerToast('Logo televerse.');
    } catch {
      triggerToast('Erreur lors du telechargement.', 'error');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nom.trim()) { triggerToast('Le nom est requis.', 'error'); return; }
    setSaving(true);
    try {
      await axiosInstance.post('/api/references', { nom, secteur, logo_url: logoUrl, ordre });
      triggerToast('Reference ajoutee.');
      setNom(''); setSecteur(''); setLogoUrl(''); setOrdre('');
      fetchReferences();
    } catch {
      triggerToast("Erreur lors de l'ajout.", 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, nomRef) => {
    triggerConfirm('Supprimer la reference "' + nomRef + '" ?', async () => {
      try {
        await axiosInstance.delete('/api/references/' + id);
        triggerToast('Reference supprimee.');
        fetchReferences();
      } catch {
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  if (loading) return <div className="loading-spinner">Chargement des references...</div>;

  return (
    <div className="gestion-references-module">
      <div className="admin-card" style={{ marginBottom: '28px' }}>
        <h2 className="admin-card-title">Ajouter une reference client</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Nom du client / organisme *</label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="ex: PAPSEN, DP World, ANAM..."
                required
              />
            </div>
            <div className="form-group">
              <label>Secteur d'activite</label>
              <input
                type="text"
                value={secteur}
                onChange={e => setSecteur(e.target.value)}
                placeholder="ex: Agriculture, Energie, Finance publique..."
              />
            </div>
          </div>

          <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Logo (optionnel)</label>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#F3F4F6', border: '1.5px dashed #D1D5DB',
                borderRadius: '8px', padding: '10px 18px',
                cursor: uploadingLogo ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
              }}>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} disabled={uploadingLogo} />
                {uploadingLogo ? 'Telechargement...' : 'Choisir un logo'}
              </label>
              {logoUrl && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={logoUrl} alt="logo" style={{ height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                  <button type="button" onClick={() => setLogoUrl('')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>X</button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Ordre d'affichage (facultatif)</label>
              <input
                type="number"
                value={ordre}
                onChange={e => setOrdre(e.target.value)}
                placeholder="1, 2, 3... (0 = defaut)"
                style={{ maxWidth: '180px' }}
              />
            </div>
          </div>

          <div className="form-actions-bar" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
            <button type="submit" className="admin-btn admin-btn-secondary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Ajouter la reference'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">References clients ({references.length})</h2>
        {references.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--texte-moyen)', padding: '30px 0' }}>
            Aucune reference pour le moment.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Nom</th>
                  <th>Secteur</th>
                  <th>Ordre</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {references.map(ref => (
                  <tr key={ref.id}>
                    <td>
                      {ref.logo_url ? (
                        <img src={ref.logo_url} alt={ref.nom} style={{ height: '36px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{
                          width: '36px', height: '36px', background: 'var(--bleu-marine)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem'
                        }}>
                          {ref.nom.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--bleu-marine)' }}>{ref.nom}</td>
                    <td style={{ color: 'var(--texte-moyen)', fontSize: '0.88rem' }}>{ref.secteur || '-'}</td>
                    <td>{ref.ordre || 0}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(ref.id, ref.nom)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionReferences;