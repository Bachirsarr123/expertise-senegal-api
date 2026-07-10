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
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [poste, setPoste] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { fetchDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/publications/' + id);
      setPub(response.data);
    } catch (err) {
      setErrorMsg('Impossible de charger les details de cette annonce.');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !prenom || !email || !telephone || !organisation) {
      alert('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setSubmitting(true); setSuccessMsg(''); setErrorMsg('');
    try {
      await axios.post('https://expertise-senegal-api-olf5.onrender.com/api/inscriptions', {
        publication_id: id, nom, prenom, email, telephone, organisation, poste, message
      });
      setSuccessMsg('Votre inscription a ete enregistree avec succes !');
      setNom(''); setPrenom(''); setEmail('');
      setTelephone(''); setOrganisation(''); setPoste(''); setMessage('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Une erreur est survenue.');
    } finally { setSubmitting(false); }
  };

  const getDownloadUrl = (url) => {
    if (url && url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  const handleWhatsAppContact = () => {
    if (!pub) return;
    const fullName = (prenom.trim() + ' ' + nom.trim()).trim() || '[Votre Nom]';
    const org = organisation.trim() || '[Votre Organisation]';
    const rawText = 'Bonjour, je suis interesse(e) par : ' + pub.titre + '. Contactez-moi : ' + fullName + ' de ' + org;
    window.open('https://wa.me/221776434160?text=' + encodeURIComponent(rawText), '_blank');
  };

  if (loading) return <div className="container py-5 text-center"><h2>Chargement...</h2></div>;

  if (errorMsg && !pub) return (
    <div className="container py-5 text-center">
      <div className="alert alert-danger mb-4">{errorMsg}</div>
      <Link to="/seminaires" className="btn btn-primary">Retour</Link>
    </div>
  );

  const isFormation = pub.type === 'formation';
  const isComplet = isFormation && pub.places_disponibles !== null && pub.places_disponibles <= 0;
  const showForm = pub.show_form === 1;

  let badgeLabel = 'Formation';
  let badgeClass = 'badge-formation';
  if (pub.type === 'appel_candidature') { badgeLabel = 'Appel a candidatures'; badgeClass = 'badge-appel'; }
  else if (pub.type === 'actualite') { badgeLabel = 'Actualite'; badgeClass = 'badge-actualite'; }

  return (
    <div className="pub-detail-page">
      <SEO
        title={pub.titre + ' — Expertise Senegal'}
        description={pub.description || pub.titre}
        url={'https://www.expertisesenegal.com/seminaires/' + pub.id}
        image={pub.image || 'https://www.expertisesenegal.com/og-image.jpg'}
      />

      <section className="pub-detail-banner" style={{ backgroundImage: 'linear-gradient(rgba(26,36,86,0.85),rgba(26,36,86,0.85)), url(' + (pub.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1920') + ')' }}>
        <div className="container pub-detail-banner-content">
          <Link to="/seminaires" className="back-link">Retour au Catalogue de Formation</Link>
          <span className={'pub-detail-badge ' + badgeClass}>{badgeLabel}</span>
          <h1>{pub.titre}</h1>
          <p className="pub-banner-desc">{pub.description}</p>
        </div>
      </section>

      <section className="pub-detail-body-section section-padding">
        <div className="container">
          <div className={showForm ? 'pub-detail-layout' : 'pub-detail-layout-full'}>

            <div className="pub-content-col">

              {isFormation && (pub.date_debut || pub.lieu || pub.prix || pub.places_disponibles !== null) && (
                <div className="pub-meta-box">
                  {pub.date_debut && (
                    <div className="meta-box-item">
                      <span className="meta-icon">Date</span>
                      <span className="meta-val">
                        {new Date(pub.date_debut).toLocaleDateString('fr-FR')}
                        {pub.date_fin && (' au ' + new Date(pub.date_fin).toLocaleDateString('fr-FR'))}
                      </span>
                    </div>
                  )}
                  {pub.lieu && <div className="meta-box-item"><span className="meta-icon">Lieu</span><span className="meta-val">{pub.lieu}</span></div>}
                  {pub.prix && <div className="meta-box-item"><span className="meta-icon">Tarif</span><span className="meta-val">{pub.prix}</span></div>}
                  {pub.places_disponibles !== null && (
                    <div className="meta-box-item">
                      <span className="meta-icon">Places</span>
                      <span className={'meta-val' + (isComplet ? ' text-red fw-bold' : '')}>
                        {isComplet ? 'Complet' : pub.places_disponibles + ' places'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {!isFormation && pub.date_debut && (
                <div className="pub-meta-box">
                  <div className="meta-box-item">
                    <span className="meta-icon">Date</span>
                    <span className="meta-val">{new Date(pub.date_debut).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {pub.lieu && <div className="meta-box-item"><span className="meta-icon">Lieu</span><span className="meta-val">{pub.lieu}</span></div>}
                </div>
              )}

              <div className="pub-main-text">
                <h2 className="content-h2">Presentation detaillee</h2>
                <div className="formatted-content">
                  {pub.contenu
                    ? pub.contenu.split('\n').map((para, i) => <p key={i}>{para}</p>)
                    : <p>Aucun descriptif detaille pour le moment.</p>}
                </div>
              </div>

              {pub.document_url && (
                <div className="pub-document-section">
                  <h2 className="content-h2">Document joint</h2>
                  <div className="pub-document-card">
                    <div className="pub-document-header">
                      <span className="doc-icon">{pub.document_url.toLowerCase().includes('.doc') ? 'W' : 'P'}</span>
                      <div className="doc-info">
                        <p className="doc-name">{decodeURIComponent(pub.document_url.split('/').pop().split('?')[0])}</p>
                        <p className="doc-type">{pub.document_url.toLowerCase().includes('.doc') ? 'Document Word' : 'Document PDF'}</p>
                      </div>
                      <a href={getDownloadUrl(pub.document_url)} target="_blank" rel="noopener noreferrer" className="btn btn-download">
                        Telecharger
                      </a>
                    </div>
                    {!pub.document_url.toLowerCase().includes('.doc') && (
                      <div className="pub-pdf-viewer">
                        <iframe
                          src={pub.document_url}
                          title="Apercu du document"
                          className="pdf-iframe"
                          frameBorder="0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {showForm && (
              <div className="pub-sidebar-col">
                <div className="pub-registration-card sticky-sidebar">
                  <h3>S'inscrire / Repondre</h3>
                  <p className="card-subtitle">
                    {isComplet ? 'Cette session est complete.' : 'Remplissez le formulaire pour reserver votre place.'}
                  </p>
                  {successMsg && <div className="alert alert-success mb-3" style={{ fontSize: '0.9rem' }}>{successMsg}</div>}
                  {errorMsg && <div className="alert alert-danger mb-3" style={{ fontSize: '0.9rem' }}>{errorMsg}</div>}
                  <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group-row">
                      <div className="form-item">
                        <label>Prenom *</label>
                        <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Mamadou" required disabled={isComplet || submitting} />
                      </div>
                      <div className="form-item">
                        <label>Nom *</label>
                        <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Diop" required disabled={isComplet || submitting} />
                      </div>
                    </div>
                    <div className="form-item">
                      <label>Email *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="m.diop@entreprise.sn" required disabled={isComplet || submitting} />
                    </div>
                    <div className="form-item">
                      <label>Telephone *</label>
                      <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="77 643 41 60" required disabled={isComplet || submitting} />
                    </div>
                    <div className="form-item">
                      <label>Organisation *</label>
                      <input type="text" value={organisation} onChange={e => setOrganisation(e.target.value)} placeholder="Votre structure" required disabled={isComplet || submitting} />
                    </div>
                    <div className="form-item">
                      <label>Poste (optionnel)</label>
                      <input type="text" value={poste} onChange={e => setPoste(e.target.value)} placeholder="ex: Directeur RH" disabled={isComplet || submitting} />
                    </div>
                    <div className="form-item">
                      <label>Message (optionnel)</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} disabled={isComplet || submitting} />
                    </div>
                    <button type="submit" className={'btn ' + (isComplet ? 'btn-disabled' : 'btn-primary') + ' w-100 mt-3'} disabled={isComplet || submitting}>
                      {submitting ? 'Enregistrement...' : isComplet ? 'Complet' : "S'inscrire"}
                    </button>
                  </form>
                  <div className="form-separator"><span>ou</span></div>
                  <button type="button" className="btn btn-whatsapp-direct w-100" onClick={handleWhatsAppContact}>
                    Contacter par WhatsApp
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default SeminaireDetail;
