import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionMedias = ({ triggerToast, triggerConfirm, onMediaAction }) => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await axiosInstance.get('/api/media');
      setMedias(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media:', error);
      triggerToast('Impossible de charger la bibliothèque de médias.', 'error');
    }
  };

  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    const files = fileInputRef.current.files;
    
    if (files.length === 0) {
      triggerToast('Veuillez sélectionner un fichier à uploader.', 'error');
      return;
    }

    const file = files[0];
    
    // Max 5MB check in frontend
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Le fichier est trop volumineux (max 5Mo).', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    triggerToast('Upload en cours...');

    try {
      const response = await axiosInstance.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Insert new media in local state
      setMedias([response.data.media, ...medias]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      triggerToast('Photo uploadée avec succès !');
      onMediaAction(); // Refresh stats count
    } catch (err) {
      console.error('Error uploading media:', err);
      if (err.response && err.response.data && err.response.data.message) {
        triggerToast(err.response.data.message, 'error');
      } else {
        triggerToast("Erreur lors de l'upload.", 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = (id) => {
    triggerConfirm('Êtes-vous sûr de vouloir supprimer cette image ? Elle sera supprimée définitivement du serveur.', async () => {
      try {
        await axiosInstance.delete(`/api/media/${id}`);
        setMedias(medias.filter(m => m.id !== id));
        triggerToast('Image supprimée avec succès.');
        onMediaAction(); // Refresh stats count
      } catch (err) {
        console.error('Error deleting media:', err);
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  const handleCopyLink = (chemin) => {
    const fullLink = `https://expertise-senegal-api.onrender.com${chemin}`;
    navigator.clipboard.writeText(fullLink);
    triggerToast('Lien de la photo copié dans le presse-papiers !');
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div className="loading-spinner">Chargement de la bibliothèque de médias...</div>;

  return (
    <div className="gestion-medias-module">
      {/* Upload Box */}
      <div className="admin-card">
        <h2 className="admin-card-title">Uploader une nouvelle photo</h2>
        <form onSubmit={handleFileUploadSubmit} className="admin-form">
          <p className="mb-3">Formats autorisés : **JPG, PNG, WebP** — Taille max : **5 Mo**</p>
          
          <div className="form-group mb-4" style={{ backgroundColor: 'var(--gris-clair)', padding: '30px', border: '2px dashed #D1D5DB', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>📤</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".jpg,.jpeg,.png,.webp"
              required 
              style={{ margin: '0 auto', display: 'block', maxWidth: '300px' }}
            />
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
            {uploading ? 'Upload en cours...' : 'Téléverser sur le serveur'}
          </button>
        </form>
      </div>

      {/* Medias Grid */}
      <div className="admin-card">
        <h2 className="admin-card-title">Bibliothèque de photos ({medias.length})</h2>
        {medias.length === 0 ? (
          <p className="text-center py-4">Aucune photo dans la bibliothèque. Téléversez-en une ci-dessus.</p>
        ) : (
          <div className="medias-grid">
            {medias.map(media => {
              const fullUrl = `https://expertise-senegal-api.onrender.com${media.chemin}`;

              return (
                <div key={media.id} className="media-item-card">
                  <div className="media-img-wrapper">
                    <img src={fullUrl} alt={media.nom} />
                  </div>
                  <div className="media-card-details">
                    <div>
                      <h4 title={media.nom}>{media.nom}</h4>
                      <div className="media-card-size mt-1">{formatSize(media.taille)}</div>
                    </div>
                    <div className="media-card-actions">
                      <button 
                        className="admin-btn admin-btn-outline" 
                        style={{ padding: '6px', flex: 1, fontSize: '0.8rem', justifyContent: 'center' }} 
                        onClick={() => handleCopyLink(media.chemin)}
                        title="Copier le lien"
                      >
                        🔗 Copier
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger" 
                        style={{ padding: '6px', fontSize: '0.8rem' }} 
                        onClick={() => handleDeleteMedia(media.id)}
                        title="Supprimer"
                      >
                        🗑️
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
