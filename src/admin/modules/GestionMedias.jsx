import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionMedias = ({ triggerToast, triggerConfirm, onMediaAction }) => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replacingId, setReplacingId] = useState(null);
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  useEffect(() => { fetchMedias(); }, []);

  const fetchMedias = async () => {
    try {
      const { data } = await axiosInstance.get('/api/media');
      setMedias(data);
    } catch {
      triggerToast('Impossible de charger la bibliotheque de medias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (media) =>
    media.resource_type === 'video' || /\.(mp4|webm|mov|avi)$/i.test(media.nom);

  const uploadFile = async (file, replaceId) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axiosInstance.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (replaceId) {
        await axiosInstance.delete(`/api/media/${replaceId}`);
        setMedias(prev => [data.media, ...prev.filter(m => m.id !== replaceId)]);
        triggerToast('Media remplace avec succes !');
      } else {
        setMedias(prev => [data.media, ...prev]);
        triggerToast('Fichier uploade avec succes !');
      }
      onMediaAction();
    } catch (err) {
      triggerToast(err.response?.data?.message || "Erreur lors de l'upload.", 'error');
    } finally {
      setUploading(false);
      setReplacingId(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) { triggerToast('Selectionnez un fichier.', 'error'); return; }
    await uploadFile(file, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplace = (mediaId) => {
    setReplacingId(mediaId);
    replaceInputRef.current.click();
  };

  const handleReplaceFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file, replacingId);
    e.target.value = '';
  };

  const handleDelete = (id) => {
    triggerConfirm('Supprimer ce media definitivement de Cloudinary ?', async () => {
      try {
        await axiosInstance.delete(`/api/media/${id}`);
        setMedias(prev => prev.filter(m => m.id !== id));
        triggerToast('Media supprime.');
        onMediaAction();
      } catch {
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    triggerToast('URL Cloudinary copiee dans le presse-papiers !');
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '-';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) return <div className="loading-spinner">Chargement de la bibliotheque...</div>;

  return (
    <div className="gestion-medias-module">

      {/* Input cache pour remplacer */}
      <input
        type="file"
        ref={replaceInputRef}
        accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov"
        style={{ display: 'none' }}
        onChange={handleReplaceFileSelected}
      />

      {/* Upload */}
      <div className="admin-card">
        <h2 className="admin-card-title">Ajouter un media</h2>
        <div style={{ marginBottom: '12px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', fontSize: '0.85rem', color: '#166534' }}>
          &#9989; Stockage Cloudinary actif - vos fichiers sont permanents et ne seront jamais perdus.
        </div>
        <form onSubmit={handleUpload} className="admin-form">
          <p className="mb-3" style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            Images : JPG, PNG, WebP, GIF (max 10 Mo) &bull; Videos : MP4, WebM, MOV (max 50 Mo)
          </p>
          <div
            className="form-group mb-4"
            style={{ background: '#f9fafb', padding: '30px', border: '2px dashed #D1D5DB', borderRadius: '10px', textAlign: 'center' }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>&#128228;</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov"
              required
              style={{ margin: '0 auto', display: 'block', maxWidth: '340px' }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
            {uploading ? 'Upload en cours...' : 'Envoyer sur Cloudinary'}
          </button>
        </form>
      </div>

      {/* Bibliotheque */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bibliotheque de medias ({medias.length})</h2>
        {medias.length === 0 ? (
          <p className="text-center py-4" style={{ color: '#6b7280' }}>
            Aucun media. Uploadez-en un ci-dessus.
          </p>
        ) : (
          <div className="medias-grid">
            {medias.map(media => {
              const video = isVideo(media);
              return (
                <div key={media.id} className="media-item-card">
                  <div className="media-img-wrapper" style={{ position: 'relative', background: '#111' }}>
                    {video ? (
                      <video
                        src={media.chemin}
                        controls
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={media.chemin}
                        alt={media.nom}
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                    )}
                    <span style={{
                      position: 'absolute', top: '6px', left: '6px',
                      background: video ? '#7c3aed' : '#0369a1',
                      color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                      padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {video ? 'VIDEO' : 'IMAGE'}
                    </span>
                  </div>

                  <div className="media-card-details">
                    <div>
                      <h4
                        title={media.nom}
                        style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px', margin: 0 }}
                      >
                        {media.nom}
                      </h4>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '3px' }}>
                        {formatSize(media.taille)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
                      <button
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => handleCopyUrl(media.chemin)}
                        title="Copier l'URL"
                      >
                        &#128279; URL
                      </button>
                      <a
                        href={media.chemin}
                        download={media.nom}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.72rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                        title="Telecharger"
                      >
                        &#11123; Telecharger
                      </a>
                      <button
                        className="admin-btn admin-btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#d97706', borderColor: '#d97706' }}
                        onClick={() => handleReplace(media.id)}
                        title="Remplacer par un autre fichier"
                        disabled={uploading}
                      >
                        &#8635; Remplacer
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => handleDelete(media.id)}
                        title="Supprimer definitivement"
                      >
                        &#128465; Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionMedias;