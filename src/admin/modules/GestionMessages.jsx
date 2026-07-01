import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GestionMessages = ({ triggerToast, triggerConfirm, onMessageAction }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Opening hours states
  const [hoursMonFri, setHoursMonFri] = useState('08h00 — 18h00');
  const [hoursSat, setHoursSat] = useState('09h00 — 13h00');
  const [hoursSun, setHoursSun] = useState('Fermé');

  useEffect(() => {
    fetchMessages();
    fetchHours();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/api/messages');
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      triggerToast('Impossible de charger les messages.', 'error');
    }
  };

  const fetchHours = async () => {
    try {
      const response = await axiosInstance.get('/api/content/parametres');
      setHoursMonFri(response.data.hours_mon_fri || '08h00 — 18h00');
      setHoursSat(response.data.hours_sat || '09h00 — 13h00');
      setHoursSun(response.data.hours_sun || 'Fermé');
    } catch (error) {
      console.error('Error fetching opening hours:', error);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axiosInstance.put(`/api/messages/${id}/status`, { lu: newStatus });
      
      // Update locally
      setMessages(messages.map(m => m.id === id ? { ...m, lu: newStatus ? 1 : 0 } : m));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, lu: newStatus ? 1 : 0 });
      }
      
      triggerToast(newStatus ? 'Message marqué comme lu' : 'Message marqué comme non lu');
      onMessageAction(); // Refresh unread count in Sidebar
    } catch (err) {
      console.error('Error changing message status:', err);
      triggerToast('Erreur lors du changement de statut.', 'error');
    }
  };

  const handleDeleteMessage = (id) => {
    triggerConfirm('Êtes-vous sûr de vouloir supprimer ce message définitivement ?', async () => {
      try {
        await axiosInstance.delete(`/api/messages/${id}`);
        setMessages(messages.filter(m => m.id !== id));
        setSelectedMessage(null);
        triggerToast('Message supprimé avec succès.');
        onMessageAction(); // Refresh unread count in Sidebar
      } catch (err) {
        console.error('Error deleting message:', err);
        triggerToast('Erreur lors de la suppression.', 'error');
      }
    });
  };

  const handleSaveHours = async () => {
    triggerConfirm("Enregistrer les nouveaux horaires d'ouverture ?", async () => {
      try {
        await axiosInstance.put('/api/content/parametres', {
          hours_mon_fri: hoursMonFri,
          hours_sat: hoursSat,
          hours_sun: hoursSun
        });
        triggerToast("Horaires d'ouverture mis à jour.");
      } catch (err) {
        console.error('Error saving hours:', err);
        triggerToast('Erreur lors de la sauvegarde.', 'error');
      }
    });
  };

  const handleExportCSV = () => {
    // Standard CSV download trigger from our express CSV export endpoint
    const token = localStorage.getItem('adminToken');
    window.open(`https://expertise-senegal-api-olf5.onrender.com/api/messages/export?token=${token || ''}`, '_blank');
    triggerToast('Téléchargement du fichier CSV démarré.');
  };

  const openMessageDetails = async (msg) => {
    setSelectedMessage(msg);
    // Automatically mark read if unread
    if (!msg.lu) {
      await handleUpdateStatus(msg.id, false);
    }
  };

  if (loading) return <div className="loading-spinner">Chargement des messages de contact...</div>;

  return (
    <div className="gestion-messages-module">
      {/* Opening Hours Panel */}
      <div className="admin-card">
        <h2 className="admin-card-title">Horaires d'ouverture du cabinet</h2>
        <div className="admin-form">
          <div className="admin-input-grid mb-4">
            <div className="form-group">
              <label>Lundi — Vendredi</label>
              <input type="text" value={hoursMonFri} onChange={e => setHoursMonFri(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Samedi</label>
              <input type="text" value={hoursSat} onChange={e => setHoursSat(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dimanche</label>
              <input type="text" value={hoursSun} onChange={e => setHoursSun(e.target.value)} />
            </div>
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={handleSaveHours}>
            💾 Enregistrer Horaires
          </button>
        </div>
      </div>

      {/* Messages List & Details */}
      <div className="admin-card">
        <div className="admin-card-title">
          <span>Messages de contact reçus ({messages.length})</span>
          <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>
            📥 Exporter en CSV
          </button>
        </div>

        {messages.length === 0 ? (
          <p className="text-center py-4">Aucun message reçu pour le moment.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Statut</th>
                  <th>Nom / Organisation</th>
                  <th>Objet de la demande</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} className={!msg.lu ? 'unread-row' : ''}>
                    <td>
                      <span className={`badge-status ${msg.lu ? 'badge-status-read' : 'badge-status-unread'}`}>
                        {msg.lu ? 'Lu' : 'Non lu'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold">{msg.nom}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--texte-moyen)' }}>{msg.organisation}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{msg.objet}</div>
                    </td>
                    <td>
                      {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="admin-btn admin-btn-outline" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => openMessageDetails(msg)}>
                          👁️ Voir
                        </button>
                        <button 
                          className="admin-btn admin-btn-outline" 
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }} 
                          onClick={() => handleUpdateStatus(msg.id, msg.lu)}
                        >
                          {msg.lu ? '✉️ Non lu' : '📩 Lu'}
                        </button>
                        <button className="admin-btn admin-btn-danger" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteMessage(msg.id)}>
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

      {/* Message Read Modal */}
      {selectedMessage && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal" style={{ maxWidth: '600px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--bleu-marine)' }}>Détail du message</h3>
              <span className={`badge-status ${selectedMessage.lu ? 'badge-status-read' : 'badge-status-unread'}`}>
                {selectedMessage.lu ? 'Lu' : 'Non lu'}
              </span>
            </div>

            <div className="admin-input-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <strong>👤 Nom complet:</strong>
                <p style={{ margin: '4px 0 12px 0' }}>{selectedMessage.nom}</p>

                <strong>🏢 Structure:</strong>
                <p style={{ margin: '4px 0 12px 0' }}>{selectedMessage.organisation}</p>

                <strong>📞 Téléphone:</strong>
                <p style={{ margin: '4px 0 12px 0' }}><a href={`tel:${selectedMessage.telephone}`}>{selectedMessage.telephone}</a></p>
              </div>

              <div>
                <strong>✉️ Email:</strong>
                <p style={{ margin: '4px 0 12px 0' }}><a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>

                <strong>❓ Objet:</strong>
                <p style={{ margin: '4px 0 12px 0' }}>{selectedMessage.objet}</p>

                <strong>🕒 Date:</strong>
                <p style={{ margin: '4px 0 12px 0' }}>{new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="form-group mb-4" style={{ backgroundColor: 'var(--gris-clair)', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <strong>💬 Message:</strong>
              <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{selectedMessage.message}</p>
            </div>

            <div className="form-actions-bar" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px' }}>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                🗑️ Supprimer
              </button>
              <button className="admin-btn admin-btn-outline" onClick={() => setSelectedMessage(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMessages;
