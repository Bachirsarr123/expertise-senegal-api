import { useState } from 'react';

const ImageOptimisee = ({ 
  src, 
  alt, 
  className, 
  fallback = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', 
  style, 
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div 
      className={`image-optimisee-wrapper ${className || ''}`}
      style={{
        position: 'relative',
        backgroundColor: '#E5E7EB', // Grey placeholder
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'block',
        ...style
      }}
    >
      <img
        src={error ? fallback : src}
        alt={alt || 'Image cabinet de conseil Expertise Sénégal'}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease-in-out',
          display: 'block'
        }}
        {...props}
      />
      {!loaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#E5E7EB',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} />
      )}
    </div>
  );
};

export default ImageOptimisee;
