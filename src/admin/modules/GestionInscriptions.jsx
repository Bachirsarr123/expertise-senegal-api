import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const STATUT_CONFIG = {
  nouveau:  { label: 'Nouveau',  color: '#3b82f6', bg: '#eff6ff' },
  contacte: { label: 'Contacte', color: '#f59e0b', bg: '#fffbeb' },
  confirme: { label: 'Confirme', color: '#10b981', bg: '#f0fdf4' },
  annule:   { label: 'Annule',   color: '#ef4444', bg: '#fef2f2' },
};

const GestionInscriptions = ({ triggerToast, triggerConfirm }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [publications, setPublications]  = useState([]);
  const [loading, setLoading]            = useState(true);
  const [filterStatut, setFilterStatut]  = useState('tous');
  const [filterPub, setFilterPub]        = useState('tous');
  const [selected, setSelected]          = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm]        = useState({ publicationId: '', subject: '', message: '' });
  const [sendingEmail, setSendingEmail]  = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inscRes, pubRes] = await Promise.all([
        axiosInstance.get('/api/inscriptions'),
        axiosInstance.get('/api/publications'),
      ]);
      setInscriptions(inscRes.data);
      setPublications(pubRes.data);
    } catch {
      triggerToast('Erreur chargement des inscriptions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const changeStatut = async (id, statut) => {
    try {
      await axiosInstance.patch(`/api/inscriptions/${id}/statut`, { statut });
      setInscriptions(prev => prev.map(i => i.id === id ? { ...i, statut } : i));
      if (selected?.id === id) setSelected(prev => ({ ...prev, statut }));
      triggerToast('Statut mis a jour.');
    } catch {
      triggerToast('Erreur mise a jour statut.', 'error');
    }
  };

  const deleteInscription = (ins) => {
    triggerConfirm(`Supprimer l'inscription de ${ins.prenom} ${ins.nom} ?`, async () => {
      try {
        await axiosInstance.delete(`/api/inscriptions/${ins.id}`);
        setInscriptions(prev => prev.filter(i => i.id !== ins.id));
        if (selected?.id === ins.id) setSelected(null);
        triggerToast('Inscription supprimee.');
      } catch {
        triggerToast('Erreur suppression.', 'error');
      }
    });
  };

  const sendGroupEmail = async () => {
    if (!emailForm.publicationId || !emailForm.subject || !emailForm.message) {
      triggerToast('Veuillez remplir tous les champs.', 'error');
      return;
    }
    setSendingEmail(true);
    try {
      const res = await axiosInstance.post('/api/inscriptions/email-group', {
        publicationId: parseInt(emailForm.publicationId),
        subject: emailForm.subject,
        message: emailForm.message,
      });
      triggerToast(res.data.message);
      setShowEmailModal(false);
      setEmailForm({ publicationId: '', subject: '', message: '' });
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Erreur envoi email.', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const filtered = inscriptions.filter(i => {
    const okStatut = filterStatut === 'tous' || i.statut === filterStatut;
    const okPub    = filterPub    === 'tous' || String(i.publication_id) === filterPub;
    return okStatut && okPub;
  });

  const counts = {
    total:    inscriptions.length,
    nouveau:  inscriptions.filter(i => i.statut === 'nouveau').length,
    contacte: inscriptions.filter(i => i.statut === 'contacte').length,
    confirme: inscriptions.filter(i => i.statut === 'confirme').length,
    annule:   inscriptions.filter(i => i.statut === 'annule').length,
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '-';

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Chargement des inscriptions...</div>;

  return (
    <div className="module-container">

      {/* HEADER */}
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="module-title" style={{ margin: 0 }}>Gestion des Inscriptions</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{inscriptions.length} inscription(s) au total</p>
        </div>
        <button
          onClick={() => { setEmailForm({ publicationId: '', subject: '', message: '' }); setShowEmailModal(true); }}
          style={{ padding: '0.6rem 1.25rem', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
        >
          Envoyer email groupe
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',     value: counts.total,    color: '#6366f1' },
          { label: 'Nouveaux',  value: counts.nouveau,  color: '#3b82f6' },
          { label: 'Contactes', value: counts.contacte, color: '#f59e0b' },
          { label: 'Confirmes', value: counts.confirme, color: '#10b981' },
          { label: 'Annules',   value: counts.annule,   color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="stat-card-body">
              <h3>{s.label}</h3>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={sel}>
          <option value="tous">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="contacte">Contacte</option>
          <option value="confirme">Confirme</option>
          <option value="annule">Annule</option>
        </select>
        <select value={filterPub} onChange={e => setFilterPub(e.target.value)} style={sel}>
          <option value="tous">Toutes les formations</option>
          {publications.filter(p => p.type === 'formation').map(p => (
            <option key={p.id} value={String(p.id)}>{p.titre}</option>
          ))}
        </select>
        <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.875rem' }}>{filtered.length} resultat(s)</span>
      </div>

      {/* TABLE + FICHE */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* TABLE */}
        <div style={{ flex: 1, overflowX: 'auto', minWidth: 0 }}>
          {filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', background: 'white', borderRadius: '8px' }}>Aucune inscription pour ces filtres.</div>
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Inscrit', 'Formation', 'Organisation', 'Statut', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ins => {
                    const cfg = STATUT_CONFIG[ins.statut] || STATUT_CONFIG.nouveau;
                    const isSel = selected?.id === ins.id;
                    return (
                      <tr
                        key={ins.id}
                        onClick={() => setSelected(isSel ? null : ins)}
                        style={{ cursor: 'pointer', background: isSel ? '#eff6ff' : 'white', borderBottom: '1px solid #f3f4f6' }}
                      >
                        <td style={td}>
                          <strong style={{ display: 'block' }}>{ins.prenom} {ins.nom}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{ins.email}</span>
                        </td>
                        <td style={td}>
                          <span style={{ fontSize: '0.82rem' }}>{ins.publication_titre || '-'}</span>
                        </td>
                        <td style={td}>{ins.organisation}</td>
                        <td style={td}>
                          <select
                            value={ins.statut}
                            onClick={e => e.stopPropagation()}
                            onChange={e => changeStatut(ins.id, e.target.value)}
                            style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}55`, outline: 'none' }}
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="contacte">Contacte</option>
                            <option value="confirme">Confirme</option>
                            <option value="annule">Annule</option>
                          </select>
                        </td>
                        <td style={td}>{fmt(ins.created_at)}</td>
                        <td style={td}>
                          <button onClick={e => { e.stopPropagation(); deleteInscription(ins); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.4rem', borderRadius: '4px' }} title="Supprimer">
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </div>

        {/* FICHE DETAIL */}
        {selected && (
          <div style={{ width: '300px', flexShrink: 0, background: 'white', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.95rem' }}>Fiche inscrit</strong>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>x</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              {[
                ['Prenom',       selected.prenom],
                ['Nom',          selected.nom],
                ['Email',        selected.email],
                ['Telephone',    selected.telephone],
                ['Organisation', selected.organisation],
                ['Poste',        selected.poste || '-'],
                ['Formation',    selected.publication_titre || '-'],
                ['Date',         fmt(selected.created_at)],
              ].map(([label, value]) => (
                <div key={label} style={{ marginBottom: '0.75rem' }}>
                  <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.04em' }}>{label}</span>
                  <span style={{ fontSize: '0.82rem', color: '#1f2937', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}
            </div>

            {selected.message && (
              <div style={{ gridColumn: '1 / -1', marginTop: '0.25rem' }}>
                <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>Message</span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#1f2937', background: '#f9fafb', padding: '0.5rem', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>
            )}

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Changer le statut</p>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {Object.entries(STATUT_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => changeStatut(selected.id, key)}
                    style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${cfg.color}`, background: selected.statut === key ? cfg.color : 'white', color: selected.statut === key ? 'white' : cfg.color, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => deleteInscription(selected)}
              style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
            >
              Supprimer cette inscription
            </button>
          </div>
        )}
      </div>

      {/* MODAL EMAIL GROUPE */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Email groupe - inscrits confirmes</h3>
              <button onClick={() => setShowEmailModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>x</button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              L'email sera envoye uniquement aux inscrits avec le statut <strong>Confirme</strong> pour la formation selectionnee.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={lbl}>Formation *</label>
                <select value={emailForm.publicationId} onChange={e => setEmailForm(f => ({ ...f, publicationId: e.target.value }))} style={inp}>
                  <option value="">-- Selectionner une formation --</option>
                  {publications.filter(p => p.type === 'formation').map(p => (
                    <option key={p.id} value={p.id}>{p.titre} ({p.inscrits_count || 0} inscrit(s))</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Objet de l'email *</label>
                <input type="text" value={emailForm.subject} onChange={e => setEmailForm(f => ({ ...f, subject: e.target.value }))} placeholder="Ex: Confirmation de participation" style={inp} />
              </div>
              <div>
                <label style={lbl}>Message *</label>
                <textarea value={emailForm.message} onChange={e => setEmailForm(f => ({ ...f, message: e.target.value }))} rows={6} placeholder="Votre message... (le prenom du destinataire sera ajoute automatiquement en debut)" style={{ ...inp, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEmailModal(false)} style={{ padding: '0.6rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Annuler</button>
              <button onClick={sendGroupEmail} disabled={sendingEmail} style={{ padding: '0.6rem 1.25rem', background: sendingEmail ? '#9ca3af' : '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', cursor: sendingEmail ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                {sendingEmail ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const sel = { padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', background: 'white', cursor: 'pointer' };
const td  = { padding: '0.75rem 1rem', verticalAlign: 'middle', fontSize: '0.875rem' };
const lbl = { display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: '#374151' };
const inp = { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box' };

export default GestionInscriptions;