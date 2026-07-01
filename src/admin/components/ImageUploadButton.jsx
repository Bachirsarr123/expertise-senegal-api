import { useRef, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ImageUploadButton = ({ onSuccess, currentUrl, label }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const lbl = label || 'Choisir une image';

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axiosInstance.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(data.media.chemin);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {currentUrl && (
        <div style={{ marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', maxHeight: '180px' }}>
          <img src={currentUrl} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        accept=".jpg,.jpeg,.png,.webp,.gif"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="admin-btn admin-btn-outline"
        onClick={() => inputRef.current.click()}
        disabled={uploading}
        style={{ fontSize: '0.85rem', marginBottom: '8px' }}
      >
        {uploading ? 'Upload en cours...' : `&#128247; ${lbl}`}
      </button>
      <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '8px' }}>
        ou coller une URL dans le champ ci-dessous
      </span>
    </div>
  );
};

export default ImageUploadButton;