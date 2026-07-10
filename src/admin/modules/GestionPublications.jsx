import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import ImageUploadButton from '../components/ImageUploadButton';

const GestionPublications = ({ triggerToast, triggerConfirm }) => {
  const [publications, setPublications] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'inscriptions'
  
  // Selected objects
  const [selectedPub, setSelectedPub] = useState(null);
  const [selectedPubForInscriptions, setSelectedPubForInscriptions] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState('formation');

  // Seminaires page hero content
  const [heroBadge, setHeroBadge] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');

  // Group Email Form State
  const [showGroupEmailModal, setShowGroupEmailModal] = useState(false);
  const [groupEmailSubject, setGroupEmailSubject] = useState('');
  const [groupEmailMessage, setGroupEmailMessage] = useState('');
  const [sendingGroupEmail, setSendingGroupEmail] = useState(false);

  // Form State
  const [formType, setFormType] = useState('formation');
  const [formTitre, setFormTitre] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContenu, setFormContenu] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDateDebut, setFormDateDebut] = useState('');
  const [formDateFin, setFormDateFin] = useState('');
  const [formLieu, setFormLieu] = useState('');
  const [formPlaces, setFormPlaces] = useState('');
  const [formPrix, setFormPrix] = useState('');
  const [formStatut, setFormStatut] = useState('brouillon');
  const [formDocumentUrl, setFormDocumentUrl] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [catalogueUrl, setCatalogueUrl] = useState('');
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false);
  const [savingCatalogue, setSavingCatalogue] = useState(false);

  useEffect(() => {
    fetchPublications();
    fetchHeroContent();
    fetchCatalogueUrl();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/publications');
      setPublications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching publications:', error);
      triggerToast('Impossible de charger les publications.', 'error');
      setLoading(false);
    }
  }

  const fetchHeroContent = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/all');
      if (data.seminaires && data.seminaires.hero) {
        const h = data.seminaires.hero;
        setHeroBadge(h.badge || 'SEMINAIRES & FORMATIONS - EXPERTISE SENEGAL');
        setHeroTitle(h.title || 'Seminaires & Formations');
        setHeroBgImage(h.bg_image || '');
        setHeroSubtitle(h.subtitle || '');
      }
    } catch {
      triggerToast('Erreur chargement hero Seminaires.', 'error');
    }
  };

  const fetchCatalogueUrl = async () => {
    try {
      const { data } = await axiosInstance.get('/api/content/parametres');
      if (data.catalogue_url !== undefined) setCatalogueUrl(data.catalogue_url);
    } catch { /* ignore */ }
  };

  const handleCatalogueUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf') { triggerToast('Seuls les fichiers PDF sont acceptés.', 'error'); return; }
    setUploadingCatalogue(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const { data } = await axiosInstance.post('/api/media/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCatalogueUrl(data.url);
      triggerToast('PDF téléversé. Cliquez sur Enregistrer pour sauvegarder.');
    } catch { triggerToast('Erreur lors du téléversement.', 'error'); }
    finally { setUploadingCatalogue(false); e.target.value = ''; }
  };

  const saveCatalogueUrl = async () => {
    setSavingCatalogue(true);
    try {
      await axiosInstance.put('/api/content/parametres', { catalogue_url: catalogueUrl });
      triggerToast('Catalogue PDF enregistré.');
    } catch { triggerToast('Erreur sauvegarde catalogue.', 'error'); }
    finally { setSavingCatalogue(false); }
  };

  const saveHeroContent = () => {
    triggerConfirm('Enregistrer les textes de la page Seminaires ?', async () => {
      try {
        await axiosInstance.post('/api/content/save', {
          contents: [
            { page: 'seminaires', section: 'hero', cle: 'badge', valeur: heroBadge, type: 'texte' },
            { page: 'seminaires', section: 'hero', cle: 'title', valeur: heroTitle, type: 'texte' },
            { page: 'seminaires', section: 'hero', cle: 'subtitle', valeur: heroSubtitle, type: 'texte' },
            { page: 'seminaires', section: 'hero', cle: 'bg_image', valeur: heroBgImage, type: 'image' },
          ]
        });
        triggerToast('Textes page Seminaires mis a jour.');
      } catch {
        triggerToast('Erreur sauvegarde.', 'error');
      }
    });
  };
;

  const fetchInscriptions = async (pubId) => {
    try {
      const response = await axiosInstance.get(`/api/inscriptions/publication/${pubId}`);
      setInscriptions(response.data);
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
      triggerToast('Impossible de charger les inscriptions.', 'error');
    }
  };

  const handleOpenCreate = () => {
    setFormType('formation');
    setFormTitre('');
    setFormDescription('');
    setFormContenu('');
    setFormImage('');
    setFormDateDebut('');
    setFormDateFin('');
    setFormLieu('');
    setFormPlaces('');
    setFormPrix('');
    setFormStatut('brouillon');
    setFormDocumentUrl('');
    setView('create');
  };

  const handleOpenEdit = (pub) => {
    setSelectedPub(pub);
    setFormType(pub.type);
    setFormTitre(pub.titre);
    setFormDescription(pub.description || '');
    setFormContenu(pub.contenu || '');
    setFormImage(pub.image || '');
    setFormDocumentUrl(pub.document_url || '');
    
    // Format dates for inputs (YYYY-MM-DD)
    setFormDateDebut(pub.date_debut ? pub.date_debut.substring(0, 10) : '');
    setFormDateFin(pub.date_fin ? pub.date_fin.substring(0, 10) : '');
    
    setFormLieu(pub.lieu || '');
    setFormPlaces(pub.places_disponibles !== null ? pub.places_disponibles.toString() : '');
    setFormPrix(pub.prix || '');
    setFormStatut(pub.statut);
    setView('edit');
  };

  const handleOpenInscriptions = async (pub) => {
    setSelectedPubForInscriptions(pub);
    await fetchInscriptions(pub.id);
    setView('inscriptions');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitre.trim()) {
      triggerToast('Le titre est requis.', 'error');
      return;
    }

    const payload = {
      type: formType,
      titre: formTitre,
      description: formDescription,
      contenu: formContenu,
      image: formImage,
      document_url: formDocumentUrl,
      date_debut: formDateDebut || null,
      date_fin: formDateFin || null,
      lieu: formType === 'formation' ? formLieu : null,
      places_disponibles: formType === 'formation' && formPlaces !== '' ? parseInt(formPlaces) : null,
      prix: formType === 'formation' ? formPrix : null,
      statut: formStatut
    };

    try {
      if (view === 'create') {
        await axiosInstance.post('/api/publications', payload);
        triggerToast('Publication créée avec succès.');
      } else {
        await axiosInstance.put(`/api/publications/${selectedPub.id}`, payload);
        triggerToast('Publication modifiée avec succès.');
      }
      fetchPublications();
    fetchHeroContent();
      setView('list');
    } catch (error) {
      console.error('Error saving publication:', error);
      triggerToast('Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = (id) => {
    triggerConfirm('Voulez-vous vraiment supprimer cette publication ainsi que toutes ses inscriptions ?', async () => {
      try {
        await axiosInstance.delete(`/api/publications/${id}`);
        triggerToast('Publication supprimée.');
        fetchPublications();
    fetchHeroContent();
      } catch (error) {
        console.error('Error deleting publication:', error);
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  const handleToggleStatut = async (pub) => {
    const nextStatut = pub.statut === 'publie' ? 'brouillon' : 'publie';
    try {
      await axiosInstance.patch(`/api/publications/${pub.id}/statut`, { statut: nextStatut });
      triggerToast(nextStatut === 'publie' ? 'Publication mise en ligne.' : 'Publication passée en brouillon.');
      fetchPublications();
    fetchHeroContent();
    } catch (error) {
      console.error('Error changing publication status:', error);
      triggerToast('Erreur de changement de statut.', 'error');
    }
  };

  const handleToggleVisible = async (pub) => {
    const newVisible = pub.visible === 0 ? 1 : 0;
    try {
      await axiosInstance.patch('/api/publications/' + pub.id + '/visible', { visible: newVisible });
      triggerToast(newVisible === 1 ? 'Publication affichée sur le site.' : 'Publication masquée du site.');
      fetchPublications();
    } catch { triggerToast('Erreur de changement de visibilité.', 'error'); }
  };

  // Inscriptions Handlers
  const handleUpdateInscritStatut = async (inscritId, newStatut) => {
    try {
      await axiosInstance.patch(`/api/inscriptions/${inscritId}/statut`, { statut: newStatut });
      triggerToast('Statut de l\'inscrit mis à jour.');
      fetchInscriptions(selectedPubForInscriptions.id);
    } catch (error) {
      console.error('Error updating inscrit status:', error);
      triggerToast('Erreur de mise à jour.', 'error');
    }
  };

  const handleDeleteInscrit = (inscritId) => {
    triggerConfirm('Supprimer cette inscription ? Une place sera libérée.', async () => {
      try {
        await axiosInstance.delete(`/api/inscriptions/${inscritId}`);
        triggerToast('Inscription supprimée.');
        fetchInscriptions(selectedPubForInscriptions.id);
        fetchPublications();
    fetchHeroContent(); // Update places count
      } catch (error) {
        console.error('Error deleting inscrit:', error);
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  const handleExportInscritsCSV = () => {
    if (inscriptions.length === 0) {
      triggerToast('Aucun inscrit à exporter.', 'error');
      return;
    }

    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Organisation', 'Poste', 'Statut', 'Date Inscription'];
    const rows = inscriptions.map(i => [
      i.nom,
      i.prenom,
      i.email,
      i.telephone,
      i.organisation,
      i.poste || '',
      i.statut,
      new Date(i.created_at).toLocaleDateString('fr-FR')
    ]);

    // Build CSV string with semicolon delimiter and UTF-8 BOM for Excel
    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inscrits_${selectedPubForInscriptions.titre.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Export CSV téléchargé.');
  };

  const handleSendGroupEmail = async (e) => {
    e.preventDefault();
    if (!groupEmailSubject.trim() || !groupEmailMessage.trim()) {
      triggerToast('Tous les champs sont requis.', 'error');
      return;
    }

    setSendingGroupEmail(true);
    try {
      const response = await axiosInstance.post('/api/inscriptions/email-group', {
        publicationId: selectedPubForInscriptions.id,
        subject: groupEmailSubject,
        message: groupEmailMessage
      });
      triggerToast(response.data.message);
      setShowGroupEmailModal(false);
      setGroupEmailSubject('');
      setGroupEmailMessage('');
    } catch (error) {
      console.error('Error sending group email:', error);
      const msg = error.response?.data?.message || 'Erreur lors de l\'envoi des e-mails.';
      triggerToast(msg, 'error');
    } finally {
      setSendingGroupEmail(false);
    }
  };

  // Filter Logic
  const filteredPubs = publications.filter(pub => {
    const matchesType = pub.type === filterType;
    const matchesStatut = filterStatut === 'all' || pub.statut === filterStatut;
    return matchesType && matchesStatut;
  });


  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      triggerToast('Format non supporté. Utilisez PDF, DOC ou DOCX.', 'error');
      return;
    }
    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const res = await axiosInstance.post('/api/media/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormDocumentUrl(res.data.url);
      triggerToast('Document téléversé avec succès.');
    } catch (err) {
      triggerToast('Erreur lors du téléversement.', 'error');
    } finally {
      setUploadingDoc(false);
      e.target.value = '';
    }
  };
  if (loading) return <div className="loading-spinner">Chargement du module publications...</div>;

  return (
    <div className="gestion-publications-module">
      
      {/* 1. LIST VIEW */}
      {view === 'list' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>Séminaires &amp; Formations ({filteredPubs.length})</h2>
            <button className="admin-btn admin-btn-primary" onClick={handleOpenCreate}>
              ➕ Nouvelle Publication
            </button>
          </div>

          {/* Filter Bar */}
          <div className="filters-bar" style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', backgroundColor: 'var(--gris-clair)', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--bleu-marine)', display: 'block', marginBottom: '4px' }}>Filtrer par type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                <option value="formation">📚 Formations</option>
                <option value="appel_candidature">📣 Appels à candidatures</option>
                <option value="actualite">📰 Actualités</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--bleu-marine)', display: 'block', marginBottom: '4px' }}>Filtrer par statut</label>
              <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                <option value="all">Tous les statuts</option>
                <option value="brouillon">🟡 Brouillon</option>
                <option value="publie">🟢 Publié</option>
                <option value="archive">⚫ Archivé</option>
              </select>
            </div>
          </div>

          {filteredPubs.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px 0', color: 'var(--texte-moyen)' }}>Aucune publication trouvée avec ces critères.</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Date début</th>
                    <th>Inscrits</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPubs.map(pub => {
                    let typeBadge = '⚙️';
                    if (pub.type === 'formation') typeBadge = '📚 Formation';
                    else if (pub.type === 'appel_candidature') typeBadge = '📣 Appel';
                    else if (pub.type === 'actualite') typeBadge = '📰 Actualité';

                    return (
                      <tr key={pub.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--bleu-marine)' }}>{pub.titre}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--texte-moyen)' }}>
                            {pub.lieu ? `📍 ${pub.lieu}` : ''} {pub.prix ? `| 💰 ${pub.prix}` : ''}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{typeBadge}</span>
                        </td>
                        <td>
                          <span className={`badge-status ${
                            pub.statut === 'publie' ? 'badge-status-read' : 
                            pub.statut === 'brouillon' ? 'badge-status-unread' : 'badge-status-archive'
                          }`} style={{
                            backgroundColor: 
                              pub.statut === 'publie' ? '#D1FAE5' : 
                              pub.statut === 'brouillon' ? '#FEF3C7' : '#E5E7EB',
                            color: 
                              pub.statut === 'publie' ? '#065F46' : 
                              pub.statut === 'brouillon' ? '#92400E' : '#374151'
                          }}>
                            {pub.statut === 'publie' ? 'Publié' : pub.statut === 'brouillon' ? 'Brouillon' : 'Archivé'}
                          </span>
                        </td>
                        <td>
                          {pub.date_debut ? new Date(pub.date_debut).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td>
                          <button 
                            className="admin-btn admin-btn-outline" 
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            onClick={() => handleOpenInscriptions(pub)}
                          >
                            👤 {pub.inscrits_count || 0} inscrit(s)
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="admin-btn admin-btn-outline" 
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              onClick={() => handleOpenEdit(pub)}
                            >
                              ✏️ Modifier
                            </button>
                            <a
                              href={'/seminaires/' + pub.id}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-btn admin-btn-outline"
                              style={{ padding: '6px 10px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}
                              title="Voir la page publique"
                            >
                              🔗 Voir
                            </a>
                                                        {(pub.type === 'appel_candidature' || pub.type === 'actualite') && (
                              <button
                                className="admin-btn admin-btn-outline"
                                style={{ padding: '6px 10px', fontSize: '0.8rem', color: pub.visible === 0 ? '#EF4444' : '#059669' }}
                                onClick={() => handleToggleVisible(pub)}
                                title={pub.visible === 0 ? 'Afficher sur le site' : 'Masquer du site'}
                              >
                                {pub.visible === 0 ? '🙈 Masqué' : '👁️ Visible'}
                              </button>
                            )}
                            <button 
                              className="admin-btn admin-btn-outline" 
                              style={{ 
                                padding: '6px 10px', 
                                fontSize: '0.8rem',
                                color: pub.statut === 'publie' ? 'var(--texte-moyen)' : 'var(--or)'
                              }}
                              onClick={() => handleToggleStatut(pub)}
                            >
                              {pub.statut === 'publie' ? '🔴 Dépublier' : '🟢 Publier'}
                            </button>
                            <button 
                              className="admin-btn admin-btn-danger" 
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              onClick={() => handleDelete(pub.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Catalogue PDF */}
      {view === 'list' && (
        <div className="admin-card" style={{ marginTop: '24px', background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <h3 style={{ color: 'var(--bleu-marine)', marginBottom: '12px' }}>
            📥 Catalogue de Formation — PDF téléchargeable
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--texte-moyen)', marginBottom: '16px' }}>
            Ce fichier PDF sera proposé en téléchargement sur la page publique Catalogue de Formation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', border: '1.5px dashed #93C5FD',
              borderRadius: '8px', padding: '10px 20px',
              cursor: uploadingCatalogue ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
            }}>
              <input type="file" accept=".pdf" onChange={handleCatalogueUpload} style={{ display: 'none' }} disabled={uploadingCatalogue} />
              {uploadingCatalogue ? '⏳ Téléversement...' : '📎 Choisir un PDF catalogue'}
            </label>
            {catalogueUrl && (
              <a href={catalogueUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--or)' }}>
                📕 Voir le catalogue actuel →
              </a>
            )}
            {catalogueUrl && (
              <button type="button" onClick={() => setCatalogueUrl('')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                ✕ Retirer
              </button>
            )}
          </div>
          <div style={{ marginTop: '14px' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={saveCatalogueUrl}
              disabled={savingCatalogue}
              style={{ padding: '8px 20px' }}
            >
              {savingCatalogue ? '⏳ Enregistrement...' : '💾 Enregistrer le catalogue'}
            </button>
          </div>
        </div>
      )}

      {/* 2. FORM VIEW (CREATE OR EDIT) */}
      {(view === 'create' || view === 'edit') && (
        <div className="admin-card">
          <h2 className="admin-card-title">{view === 'create' ? '➕ Nouvelle Publication' : `✏️ Modifier la publication : ${selectedPub?.titre}`}</h2>
          
          <form onSubmit={handleSave} className="admin-form">
            <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label>Type de publication *</label>
                <select value={formType} onChange={e => setFormType(e.target.value)}>
                  <option value="formation">📚 Formation continue</option>
                  <option value="appel_candidature">📣 Appel à candidatures</option>
                  <option value="actualite">📰 Actualité cabinet</option>
                </select>
              </div>

              <div className="form-group">
                <label>Titre de la publication *</label>
                <input type="text" value={formTitre} onChange={e => setFormTitre(e.target.value)} placeholder="Saisir le titre..." required />
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Description courte (Affichée sur la grille de cartes)</label>
              <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Petite phrase d'accroche..." rows={2} />
            </div>

            {/* Conditional fields for Formations */}
            {formType === 'formation' && (
              <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="form-group">
                  <label>Lieu de la formation</label>
                  <input type="text" value={formLieu} onChange={e => setFormLieu(e.target.value)} placeholder="ex: Cabinet Keur Gorgui ou En ligne" />
                </div>
                <div className="form-group">
                  <label>Nombre de places disponibles</label>
                  <input type="number" value={formPlaces} onChange={e => setFormPlaces(e.target.value)} placeholder="ex: 25" />
                </div>
                <div className="form-group">
                  <label>Prix</label>
                  <input type="text" value={formPrix} onChange={e => setFormPrix(e.target.value)} placeholder="ex: Gratuit ou 150 000 F CFA" />
                </div>
              </div>
            )}

            <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label>Date de début</label>
                <input type="date" value={formDateDebut} onChange={e => setFormDateDebut(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Date de fin</label>
                <input type="date" value={formDateFin} onChange={e => setFormDateFin(e.target.value)} />
              </div>
            </div>

            <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label>Image de couverture (URL)</label>
                <input type="text" value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="ex: /uploads/img.jpg ou URL externe" />
                <p style={{ fontSize: '0.75rem', color: 'var(--texte-moyen)', marginTop: '4px' }}>Vous pouvez téléverser votre photo dans l'onglet "Médias", puis copier son URL ici.</p>
              </div>

              <div className="form-group">
                <label>Document joint (PDF, Word)</label>
                <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '8px' }}>
                  Ce document sera affiché et téléchargeable sur la page publique du séminaire.
                </p>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#F3F4F6', border: '1.5px dashed #D1D5DB',
                  borderRadius: '8px', padding: '10px 18px',
                  cursor: uploadingDoc ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
                }}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleDocumentUpload} style={{ display: 'none' }} disabled={uploadingDoc} />
                  {uploadingDoc ? '⏳ Téléversement...' : '📎 Choisir un fichier PDF ou Word'}
                </label>
                {formDocumentUrl && (
                  <div style={{ marginTop: '10px', padding: '10px 14px', background: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{formDocumentUrl.match(/\.(docx?)$/i) ? '📄' : '📕'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {decodeURIComponent(formDocumentUrl.split('/').pop().split('_').slice(0,-1).join('_') || formDocumentUrl.split('/').pop())}
                      </p>
                      <a href={formDocumentUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--or)' }}>Voir le document →</a>
                    </div>
                    <button type="button" onClick={() => setFormDocumentUrl('')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.1rem' }} title="Supprimer">✕</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Statut de la publication</label>
                <select value={formStatut} onChange={e => setFormStatut(e.target.value)}>
                  <option value="brouillon">🟡 Brouillon (Invisible sur le site)</option>
                  <option value="publie">🟢 Publié (Visible immédiatement)</option>
                  <option value="archive">⚫ Archivé (Invisible sur le site)</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Contenu complet de la publication (Texte riche)</label>
              <textarea value={formContenu} onChange={e => setFormContenu(e.target.value)} placeholder="Saisir tout le descriptif, programme, détails, etc..." rows={12} style={{ fontFamily: 'monospace' }} />
            </div>

            <div className="form-actions-bar" style={{ display: 'flex', gap: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
              <button type="submit" className="admin-btn admin-btn-secondary">
                💾 {view === 'create' ? 'Créer maintenant' : 'Enregistrer les modifications'}
              </button>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => setView('list')}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. INSCRIPTIONS SUBMODULE VIEW */}
      {view === 'inscriptions' && (
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>Inscriptions reçues</h2>
              <p style={{ color: 'var(--texte-moyen)', margin: '4px 0 0 0' }}>Publication : <strong>{selectedPubForInscriptions?.titre}</strong></p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="admin-btn admin-btn-outline" onClick={handleExportInscritsCSV}>
                📥 Exporter CSV
              </button>
              <button 
                className="admin-btn admin-btn-primary" 
                onClick={() => {
                  const hasConfirmed = inscriptions.some(i => i.statut === 'confirme');
                  if (!hasConfirmed) {
                    triggerToast('Aucun inscrit n\'est actuellement au statut "Confirmé".', 'error');
                  } else {
                    setShowGroupEmailModal(true);
                  }
                }}
              >
                ✉️ E-mail Groupé
              </button>
              <button className="admin-btn admin-btn-outline" onClick={() => setView('list')}>
                ◀ Retour
              </button>
            </div>
          </div>

          {inscriptions.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px 0', color: 'var(--texte-moyen)' }}>Aucun visiteur ne s'est inscrit à cette publication pour le moment.</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom Complet</th>
                    <th>Contact</th>
                    <th>Organisation / Poste</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map(ins => (
                    <tr key={ins.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--bleu-marine)' }}>{ins.prenom} {ins.nom}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--texte-moyen)' }}>
                          📅 {new Date(ins.created_at).toLocaleDateString('fr-FR')} à {new Date(ins.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div>✉️ <a href={`mailto:${ins.email}`}>{ins.email}</a></div>
                        <div>📞 <a href={`tel:${ins.telephone}`}>{ins.telephone}</a></div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{ins.organisation}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--texte-moyen)' }}>{ins.poste || 'Non spécifié'}</div>
                      </td>
                      <td>
                        <select 
                          value={ins.statut} 
                          onChange={e => handleUpdateInscritStatut(ins.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #D1D5DB',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            backgroundColor: 
                              ins.statut === 'confirme' ? '#D1FAE5' : 
                              ins.statut === 'contacte' ? '#DBEAFE' : 
                              ins.statut === 'annule' ? '#FEE2E2' : '#FEF3C7',
                            color: 
                              ins.statut === 'confirme' ? '#065F46' : 
                              ins.statut === 'contacte' ? '#1E40AF' : 
                              ins.statut === 'annule' ? '#991B1B' : '#92400E'
                          }}
                        >
                          <option value="nouveau">🟡 Nouveau</option>
                          <option value="contacte">🔵 Contacté</option>
                          <option value="confirme">🟢 Confirmé</option>
                          <option value="annule">🔴 Annulé</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {ins.message && (
                            <button 
                              className="admin-btn admin-btn-outline" 
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              onClick={() => triggerConfirm(`Message de ${ins.prenom} :\n\n"${ins.message}"`, () => {})}
                            >
                              💬 Voir Notes
                            </button>
                          )}
                          <button 
                            className="admin-btn admin-btn-danger" 
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteInscrit(ins.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. GROUP EMAIL MODAL OVERLAY */}
      {showGroupEmailModal && (
        <div className="confirm-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="confirm-modal" style={{ maxWidth: '600px', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--bleu-marine)' }}>✉️ Envoyer un e-mail groupé aux inscrits confirmés</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--texte-moyen)', marginBottom: '20px' }}>
              Cet e-mail sera envoyé individuellement à tous les inscrits ayant le statut <strong style={{ color: 'var(--green)' }}>"Confirmé"</strong> pour la publication <strong>"{selectedPubForInscriptions?.titre}"</strong>.
            </p>

            <form onSubmit={handleSendGroupEmail}>
              <div className="form-group mb-4">
                <label>Objet de l'e-mail *</label>
                <input 
                  type="text" 
                  value={groupEmailSubject} 
                  onChange={e => setGroupEmailSubject(e.target.value)} 
                  placeholder="ex: Détails pratiques pour la formation..." 
                  required 
                />
              </div>

              <div className="form-group mb-4">
                <label>Message *</label>
                <textarea 
                  value={groupEmailMessage} 
                  onChange={e => setGroupEmailMessage(e.target.value)} 
                  placeholder="Saisir votre message ici. 'Bonjour [Prénom]' et la signature seront automatiquement générés..." 
                  rows={8} 
                  required 
                />
              </div>

              <div className="form-actions-bar" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="admin-btn admin-btn-secondary" disabled={sendingGroupEmail}>
                  {sendingGroupEmail ? 'Envoi en cours...' : '🚀 Envoyer E-mails'}
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowGroupEmailModal(false)} disabled={sendingGroupEmail}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GestionPublications;
