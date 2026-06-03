import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import './SeminaireDetail.css';

const SeminaireDetail = () => {
  const { id } = useParams();
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [poste, setPoste] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await axios.get(`https://expertise-senegal-api.onrender.com/api/publications/${id}`);
      setPub(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching detail:', err);
      setErrorMsg('Impossible de charger les détails de cette annonce.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !prenom || !email || !telephone || !organisation) {
      alert('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await axios.post('https://expertise-senegal-api.onrender.com/api/inscriptions', {
        publication_id: id,
        nom,
        prenom,
        email,
        telephone,
        organisation,
        poste,
        message
      });

      setSuccessMsg('Votre inscription / réponse a été enregistrée avec succès !');
      // Reset form
      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('');
      setOrganisation('');
      setPoste('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting registration:', err);
      setErrorMsg(err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!pub) return;
    const fullName = `${prenom.trim()} ${nom.trim()}`.trim() || '[Votre Nom]';
    const org = organisation.trim() || '[Votre Organisation]';
    const rawText = `Bonjour, je suis intéressé(e) par le séminaire / formation "${pub.titre}". Je m’appelle ${fullName} de ${org}. Pouvez-vous me donner plus d’informations ?`;
    const encodedText = encodeURIComponent(rawText);
    const waUrl = `https://wa.me/221776434160?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h2>Chargement des détails...</h2>
      </div>
    );
  }

  if (errorMsg && !pub) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mb-4">{errorMsg}</div>
        <Link to="/seminaires" className="btn btn-primary">◀ Retour aux séminaires &amp; formations</Link>
      </div>
    );
  }

  const isFormation = pub.type === 'formation';
  const isComplet = isFormation && pub.places_disponibles !== null && pub.places_disponibles <= 0;

  let badgeLabel = '📚 Formation';
  let badgeClass = 'badge-formation';
  if (pub.type === 'appel_candidature') {
    badgeLabel = '📣 Appel à candidatures';
    badgeClass = 'badge-appel';
  } else if (pub.type === 'actualite') {
    badgeLabel = '📰 Actualité';
    badgeClass = 'badge-actualite';
  }

  const dynamicTitle = `${pub.titre} — Expertise Sénégal`;
  const dynamicDesc = pub.description || `Découvrez notre annonce : ${pub.titre}.`;
  const dynamicUrl = `https://www.expertisesenegal.com/seminaires/${pub.id}`;
  const dynamicImage = pub.image || 'https://www.expertisesenegal.com/og-image.jpg';

  return (
    <div className="pub-detail-page">
      <SEO 
        title={dynamicTitle}
        description={dynamicDesc}
        url={dynamicUrl}
        image={dynamicImage}
      />
      {/* Banner */}
      <section 
        className="pub-detail-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 36, 86, 0.85), rgba(26, 36, 86, 0.85)), url(${pub.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920'})`
        }}
      >
        <div className="container pub-detail-banner-content">
          <Link to="/seminaires" className="back-link">◀ Tous les séminaires &amp; formations</Link>
          <span className={`pub-detail-badge ${badgeClass}`}>{badgeLabel}</span>
          <h1>{pub.titre}</h1>
          <p className="pub-banner-desc">{pub.description}</p>
        </div>
      </section>

      {/* Main Layout */}
      <section className="pub-detail-body-section section-padding">
        <div className="container pub-detail-layout">
          
          {/* Left Column: Full Content */}
          <div className="pub-content-col">
            
            {/* Metadata bar for Formations */}
            {isFormation && (
              <div className="pub-meta-box">
                {pub.date_debut && (
                  <div className="meta-box-item">
                    <span className="meta-icon">📅 Date</span>
                    <span className="meta-val">
                      Du {new Date(pub.date_debut).toLocaleDateString('fr-FR')} 
                      {pub.date_fin ? ` au ${new Date(pub.date_fin).toLocaleDateString('fr-FR')}` : ''}
                    </span>
                  </div>
                )}

                {pub.lieu && (
                  <div className="meta-box-item">
                    <span className="meta-icon">📍 Lieu</span>
                    <span className="meta-val">{pub.lieu}</span>
                  </div>
                )}

                {pub.prix && (
                  <div className="meta-box-item">
                    <span className="meta-icon">💰 Tarif</span>
                    <span className="meta-val">{pub.prix}</span>
                  </div>
                )}

                {pub.places_disponibles !== null && (
                  <div className="meta-box-item">
                    <span className="meta-icon">👥 Places disponibles</span>
                    <span className={`meta-val ${isComplet ? 'text-red fw-bold' : ''}`}>
                      {isComplet ? 'Complet' : `${pub.places_disponibles} places`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Non-formation simple dates metadata */}
            {!isFormation && pub.date_debut && (
              <div className="pub-meta-box">
                <div className="meta-box-item">
                  <span className="meta-icon">📅 Date de publication</span>
                  <span className="meta-val">{new Date(pub.date_debut).toLocaleDateString('fr-FR')}</span>
                </div>
                {pub.lieu && (
                  <div className="meta-box-item">
                    <span className="meta-icon">📍 Lieu</span>
                    <span className="meta-val">{pub.lieu}</span>
                  </div>
                )}
              </div>
            )}

            {/* Content body */}
            <div className="pub-main-text">
              <h2 className="content-h2">Présentation détaillée</h2>
              <div className="formatted-content">
                {pub.contenu ? (
                  pub.contenu.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>Aucun descriptif détaillé pour le moment.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Form Sidebar */}
          <div className="pub-sidebar-col">
            <div className="pub-registration-card sticky-sidebar">
              <h3>📝 S'inscrire / Répondre</h3>
              <p className="card-subtitle">
                {isComplet 
                  ? 'Désolé, cette session de formation est désormais complète.'
                  : 'Remplissez le formulaire ci-dessous pour réserver votre place.'}
              </p>

              {successMsg && (
                <div className="alert alert-success mb-3" style={{ fontSize: '0.9rem' }}>
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger mb-3" style={{ fontSize: '0.9rem' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group-row">
                  <div className="form-item">
                    <label>Prénom *</label>
                    <input 
                      type="text" 
                      value={prenom} 
                      onChange={e => setPrenom(e.target.value)} 
                      placeholder="ex: Mamadou" 
                      required 
                      disabled={isComplet || submitting}
                    />
                  </div>
                  <div className="form-item">
                    <label>Nom *</label>
                    <input 
                      type="text" 
                      value={nom} 
                      onChange={e => setNom(e.target.value)} 
                      placeholder="ex: Diop" 
                      required 
                      disabled={isComplet || submitting}
                    />
                  </div>
                </div>

                <div className="form-item">
                  <label>Email professionnel *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="ex: m.diop@entreprise.sn" 
                    required 
                    disabled={isComplet || submitting}
                  />
                </div>

                <div className="form-item">
                  <label>Téléphone *</label>
                  <input 
                    type="tel" 
                    value={telephone} 
                    onChange={e => setTelephone(e.target.value)} 
                    placeholder="ex: 77 643 41 60" 
                    required 
                    disabled={isComplet || submitting}
                  />
                </div>

                <div className="form-item">
                  <label>Organisation / Entreprise *</label>
                  <input 
                    type="text" 
                    value={organisation} 
                    onChange={e => setOrganisation(e.target.value)} 
                    placeholder="Nom de votre structure" 
                    required 
                    disabled={isComplet || submitting}
                  />
                </div>

                <div className="form-item">
                  <label>Poste occupé (optionnel)</label>
                  <input 
                    type="text" 
                    value={poste} 
                    onChange={e => setPoste(e.target.value)} 
                    placeholder="ex: Directeur des Ressources Humaines" 
                    disabled={isComplet || submitting}
                  />
                </div>

                <div className="form-item">
                  <label>Message / Notes (optionnel)</label>
                  <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    placeholder="Précisez vos besoins particuliers..." 
                    rows={3} 
                    disabled={isComplet || submitting}
                  />
                </div>

                <button 
                  type="submit" 
                  className={`btn ${isComplet ? 'btn-disabled' : 'btn-primary'} w-100 mt-3`}
                  disabled={isComplet || submitting}
                >
                  {submitting ? 'Enregistrement...' : isComplet ? 'Complet' : "S'inscrire maintenant"}
                </button>
              </form>

              <div className="form-separator">
                <span>ou</span>
              </div>

              <button 
                type="button" 
                className="btn btn-whatsapp-direct w-100"
                onClick={handleWhatsAppContact}
              >
                📱 Contacter WhatsApp
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default SeminaireDetail;
