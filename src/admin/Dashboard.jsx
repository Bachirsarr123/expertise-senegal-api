import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Dashboard.css';

// Import modules
import GestionAccueil from './modules/GestionAccueil';
import GestionAPropos from './modules/GestionAPropos';
import GestionDomaines from './modules/GestionDomaines';
import GestionPublications from './modules/GestionPublications';
import GestionInscriptions from './modules/GestionInscriptions';
import GestionMessages from './modules/GestionMessages';
import GestionMedias from './modules/GestionMedias';
import GestionContact from './modules/GestionContact';
import Parametres from './modules/Parametres';
import GestionReferences from './modules/GestionReferences';

import axiosInstance from './utils/axiosInstance'; // We'll create a small axios instance with JWT header

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [stats, setStats] = useState({
    unreadMessages: 0,
    lastUpdate: 'Chargement...',
    uploadedPhotos: 0,
    activeSections: 0,
    newInscriptions: 0
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ onConfirm: () => {}, message: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch messages for stats
      const msgRes = await axiosInstance.get('/api/messages');
      const unread = msgRes.data.filter(m => !m.lu).length;

      // Fetch medias for stats
      const mediaRes = await axiosInstance.get('/api/media');
      const photoCount = mediaRes.data.length;

      // Fetch new inscriptions count
      const inscRes = await axiosInstance.get('/api/inscriptions');
      const newInscr = inscRes.data.filter(i => i.statut === 'nouveau').length;

      // Fetch content for stats
      const contentRes = await axiosInstance.get('/api/content/all');
      
      // Calculate active sections
      let activeSecs = 0;
      if (contentRes.data.accueil) {
        if (contentRes.data.accueil.hero && contentRes.data.accueil.hero.active) activeSecs++;
        if (contentRes.data.accueil.stats && contentRes.data.accueil.stats.active) activeSecs++;
        if (contentRes.data.accueil.apropos && contentRes.data.accueil.apropos.active) activeSecs++;
        if (contentRes.data.accueil.domaines && contentRes.data.accueil.domaines.active) activeSecs++;
      }
      if (contentRes.data.domaines) {
        if (contentRes.data.domaines.domaine1 && contentRes.data.domaines.domaine1.active) activeSecs++;
        if (contentRes.data.domaines.domaine2 && contentRes.data.domaines.domaine2.active) activeSecs++;
        if (contentRes.data.domaines.domaine3 && contentRes.data.domaines.domaine3.active) activeSecs++;
        if (contentRes.data.domaines.domaine4 && contentRes.data.domaines.domaine4.active) activeSecs++;
      }

      setStats({
        unreadMessages: unread,
        lastUpdate: new Date().toLocaleDateString('fr-FR'),
        uploadedPhotos: photoCount,
        activeSections: activeSecs,
        newInscriptions: newInscr
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const triggerConfirm = (message, onConfirm) => {
    setConfirmAction({
      message,
      onConfirm: () => {
        onConfirm();
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="admin-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src={logoImg} alt="Expertise Sénégal" className="sidebar-logo" />
          <span className="brand-badge">Espace Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <span className="nav-icon">🏠</span> Dashboard
          </button>
          
          <button 
            className={`nav-item-btn ${activeTab === 'accueil' ? 'active' : ''}`}
            onClick={() => setActiveTab('accueil')}
          >
            <span className="nav-icon">🖼️</span> Page Accueil
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'apropos' ? 'active' : ''}`}
            onClick={() => setActiveTab('apropos')}
          >
            <span className="nav-icon">👤</span> À Propos
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'domaines' ? 'active' : ''}`}
            onClick={() => setActiveTab('domaines')}
          >
            <span className="nav-icon">🗂️</span> Domaines d'Activité
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'references' ? 'active' : ''}`}
            onClick={() => setActiveTab('references')}
          >
            <span className="nav-icon">⭐</span> Nos Références
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'publications' ? 'active' : ''}`}
            onClick={() => setActiveTab('publications')}
          >
            <span className="nav-icon">📢</span> Catalogue de Formation
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="nav-icon">&#128196;</span> Page Contact
          </button>
          <button 
            className={`nav-item-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <span className="nav-icon">📬</span> Contact &amp; Messages
            {stats.unreadMessages > 0 && <span className="nav-badge-alert">{stats.unreadMessages}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'medias' ? 'active' : ''}`}
            onClick={() => setActiveTab('medias')}
          >
            <span className="nav-icon">🖼️</span> Médias
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span> Paramètres
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={() => triggerConfirm('Êtes-vous sûr de vouloir vous déconnecter ?', handleLogout)}>
            <span className="nav-icon">🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <main className="admin-main">
        {/* HEADER */}
        <header className="admin-header-bar">
          <div className="header-welcome">
            <h1>Bonjour Admin — Expertise Sénégal</h1>
            <p className="header-date">{today}</p>
          </div>
          <div className="header-actions-profile">
            <span className="profile-indicator">🟢 Admin en ligne</span>
          </div>
        </header>

        {/* CONTENU DYNAMIQUE TABS */}
        <div className="admin-content-container">
          {activeTab === 'summary' && (
            <div className="summary-tab-content">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-body">
                    <h3>Messages non lus</h3>
                    <p className="stat-value">{stats.unreadMessages}</p>
                  </div>
                  <span className="stat-card-icon">📬</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-body">
                    <h3>Dernière modif</h3>
                    <p className="stat-value">{stats.lastUpdate}</p>
                  </div>
                  <span className="stat-card-icon">🕒</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-body">
                    <h3>Photos uploadées</h3>
                    <p className="stat-value">{stats.uploadedPhotos}</p>
                  </div>
                  <span className="stat-card-icon">🖼️</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-body">
                    <h3>Sections actives</h3>
                    <p className="stat-value">{stats.activeSections}</p>
                  </div>
                  <span className="stat-card-icon">⚙️</span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="admin-quick-actions-panel mt-5">
                <h2>Raccourcis d'administration</h2>
                <div className="quick-actions-grid mt-4">
                  <button className="quick-action-btn" onClick={() => setActiveTab('messages')}>
                    <span>📨</span> Lire les nouveaux messages
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveTab('accueil')}>
                    <span>✍️</span> Éditer la page d'accueil
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveTab('publications')}>
                    <span>📢</span> Gérer les séminaires &amp; formations
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveTab('medias')}>
                    <span>📤</span> Uploader des photos
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Module 1: Accueil */}
          {activeTab === 'accueil' && (
            <GestionAccueil triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module 2: À Propos */}
          {activeTab === 'apropos' && (
            <GestionAPropos triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module 3: Domaines */}
          {activeTab === 'domaines' && (
            <GestionDomaines triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module 3.5: Publications */}
          {activeTab === 'publications' && (
            <GestionPublications triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module: Références Clients */}
          {activeTab === 'references' && (
            <GestionReferences triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module 3.6: Inscriptions */}
          {activeTab === 'inscriptions' && (
            <GestionInscriptions triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module 3.7: Contact page */}
          {activeTab === 'contact' && (
            <GestionContact triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}

          {/* Module 4: Messages */}
          {activeTab === 'messages' && (
            <GestionMessages triggerToast={triggerToast} triggerConfirm={triggerConfirm} onMessageAction={fetchStats} />
          )}

          {/* Module 5: Medias */}
          {activeTab === 'medias' && (
            <GestionMedias triggerToast={triggerToast} triggerConfirm={triggerConfirm} onMediaAction={fetchStats} />
          )}

          {/* Module 6: Settings */}
          {activeTab === 'settings' && (
            <Parametres triggerToast={triggerToast} triggerConfirm={triggerConfirm} />
          )}
        </div>
      </main>

      {/* CONFIRM MODAL */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Confirmation requise</h3>
            <p>{confirmAction.message}</p>
            <div className="confirm-modal-actions">
              <button className="btn-confirm-cancel" onClick={() => setShowConfirmModal(false)}>Annuler</button>
              <button className="btn-confirm-submit" onClick={confirmAction.onConfirm}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
