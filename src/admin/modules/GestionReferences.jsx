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

  const [domaines, setDomaines] = useState({
    domaine1: { title: 'Domaine 1', references: [] },
    domaine2: { title: 'Domaine 2', references: [] },
    domaine3: { title: 'Domaine 3', references: [] },
    domaine4: { title: 'Domaine 4', references: [] }
  });
  const [newDomRef, setNewDomRef] = useState('');
  const [savingDom, setSavingDom] = useState('');

  useEffect(() => {
    Promise.all([fetchReferences(), fetchDomaines()]).finally(() => setLoading(false));
  }, []);

  const fetchReferences = async () => {
    try {
      const { data } = await axiosInstance.get('/api/references');
      setReferences(data);
    } catch {
      triggerToast('Impossible de charger les références.', 'error');
    }
  };

  const fetchDomaines = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/all');
      if (data.domaines) {
        const updated = {};
        ['domaine1', 'domaine2', 'domaine3', 'domaine4'].forEach(key => {
          const d = data.domaines[key];
          if (!d) return;
          let refs = d.references;
          if (typeof refs === 'string') { try { refs = JSON.parse(refs); } catch { refs = []; } }
          updated[key] = {
            title: d.title || d.label || `Domaine ${key.replace('domaine', '')}`,
            references: Array.isArray(refs) ? refs : []
          };
        });
        setDomaines(prev => ({ ...prev, ...updated }));
      }
    } catch {
      triggerToast('Impossible de charger les domaines.', 'error');
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
      setLogoUrl(data.chemin || data.url);
      triggerToast('Logo téléversé.');
    } catch {
      triggerToast('Erreur lors du téléversement.', 'error');
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
      triggerToast('Référence ajoutée.');
      setNom(''); setSecteur(''); setLogoUrl(''); setOrdre('');
      fetchReferences();
    } catch {
      triggerToast("Erreur lors de l'ajout.", 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, nomRef) => {
    triggerConfirm('Supprimer la référence "' + nomRef + '" ?', async () => {
      try {
        await axiosInstance.delete('/api/references/' + id);
        triggerToast('Référence supprimée.');
        fetchReferences();
      } catch {
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  const addDomaineRef = (key, val) => {
    if (!val.trim()) return;
    setDomaines(prev => ({
      ...prev,
      [key]: { ...prev[key], references: [...prev[key].references, val.trim()] }
    }));
    setNewDomRef('');
  };

  const removeDomaineRef = (key, idx) => {
    setDomaines(prev => ({
      ...prev,
      [key]: { ...prev[key], references: prev[key].references.filter((_, i) => i !== idx) }
    }));
  };

  const saveDomaineRefs = async (key) => {
    setSavingDom(key);
    try {
      await axiosInstance.post('/api/content/save', {
        contents: [
          { page: 'domaines', section: key, cle: 'references', valeur: JSON.stringify(domaines[key].references), type: 'texte' }
        ]
      });
      triggerToast('Références ' + domaines[key].title + ' enregistrées.');
    } catch {
      triggerToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setSavingDom('');
    }
  };

  if (loading) return <div className="loading-spinner">Chargement des références...</div>;

  return (
    <div className="gestion-references-module">

      {/* ── Références clients (logos) ── */}
      <div className="admin-card" style={{ marginBottom: '28px' }}>
        <h2 className="admin-card-title">➕ Ajouter une référence client</h2>
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
              <label>Secteur d'activité</label>
              <input
                type="text"
                value={secteur}
                onChange={e => setSecteur(e.target.value)}
                placeholder="ex: Agriculture, Énergie, Finance publique..."
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
                {uploadingLogo ? '⏳ Téléversement...' : '🖼️ Choisir un logo'}
              </label>
              {logoUrl && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={logoUrl} alt="logo" style={{ height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                  <button type="button" onClick={() => setLogoUrl('')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>✕</button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Ordre d'affichage (facultatif)</label>
              <input
                type="number"
                value={ordre}
                onChange={e => setOrdre(e.target.value)}
                placeholder="1, 2, 3... (0 = défaut)"
                style={{ maxWidth: '180px' }}
              />
            </div>
          </div>

          <div className="form-actions-bar" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
            <button type="submit" className="admin-btn admin-btn-secondary" disabled={saving}>
              {saving ? '⏳ Enregistrement...' : '💾 Ajouter la référence'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginBottom: '28px' }}>
        <h2 className="admin-card-title">📋 Références clients ({references.length})</h2>
        {references.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--texte-moyen)', padding: '30px 0' }}>
            Aucune référence pour le moment. Ajoutez votre première référence ci-dessus.
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
                    <td style={{ color: 'var(--texte-moyen)', fontSize: '0.88rem' }}>{ref.secteur || '—'}</td>
                    <td>{ref.ordre || 0}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(ref.id, ref.nom)}
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Références par domaine d'activité ── */}
      <div className="admin-card">
        <h2 className="admin-card-title">📌 Références par domaine d'activité</h2>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '20px' }}>
          Ces références texte s'affichent sur la page "Nos Références" (section par domaine).
        </p>
        {['domaine1', 'domaine2', 'domaine3', 'domaine4'].map(key => (
          <div key={key} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--bleu-marine)', marginBottom: '12px' }}>
              {domaines[key].title}
            </h3>
            <ul className="draggable-list mb-2">
              {domaines[key].references.length === 0 ? (
                <li style={{ color: '#9CA3AF', fontSize: '0.85rem', padding: '6px 0', listStyle: 'none' }}>Aucune référence pour ce domaine.</li>
              ) : domaines[key].references.map((r, i) => (
                <li key={i} className="draggable-item" style={{ cursor: 'default' }}>
                  <div className="draggable-item-content">{r}</div>
                  <button
                    className="admin-btn admin-btn-danger"
                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    onClick={() => removeDomaineRef(key, i)}
                  >✕</button>
                </li>
              ))}
            </ul>
            <div className="admin-input-grid mb-3" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
              <input
                type="text"
                value={newDomRef}
                onChange={e => setNewDomRef(e.target.value)}
                placeholder="Ex: PAPSEN — Audit de conformité…"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDomaineRef(key, newDomRef); } }}
              />
              <button
                className="admin-btn admin-btn-primary"
                style={{ marginLeft: '8px' }}
                onClick={() => addDomaineRef(key, newDomRef)}
              >＋</button>
            </div>
            <button
              className="admin-btn admin-btn-secondary"
              disabled={savingDom === key}
              onClick={() => saveDomaineRefs(key)}
            >
              {savingDom === key ? '⏳ Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GestionReferences;
