import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import './Contact.css';

const Contact = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    organisation: '',
    objet: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Dynamic parameters
  const [phone, setPhone] = useState('33 823 54 52 — 77 643 41 60');
  const [email, setEmail] = useState('contact@expertisesenegal.com');
  const [address, setAddress] = useState('75 C Cité Keur Gorgui, Dakar, Sénégal');
  const [rc, setRc] = useState('SN.DKR.2016.B.26579');
  const [ninea, setNinea] = useState('006146642 2V2');
  const [capital, setCapital] = useState('100 000 F CFA');
  const [fiscalCentre, setFiscalCentre] = useState('Dakar-Liberté');
  const [activity, setActivity] = useState('Conseil, Études et Formation');

  const [hoursMonFri, setHoursMonFri] = useState('08h00 — 18h00');
  const [hoursSat, setHoursSat] = useState('09h00 — 13h00');
  const [hoursSun, setHoursSun] = useState('Fermé');

  const [themes, setThemes] = useState([
    'Finance Publique',
    'Gestion de Projet',
    'Marchés Publics',
    'Soft Skills',
    'Communication',
    'Management',
    'Informatique'
  ]);

  useEffect(() => {
    fetchParamsAndContent();
  }, []);

  const fetchParamsAndContent = async () => {
    try {
      const paramsRes = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/parametres');
      const params = paramsRes.data;
      if (params) {
        if (params.contact_phone) setPhone(params.contact_phone);
        if (params.contact_email) setEmail(params.contact_email);
        if (params.contact_address) setAddress(params.contact_address);
        if (params.legal_rc) setRc(params.legal_rc);
        if (params.legal_ninea) setNinea(params.legal_ninea);
        if (params.legal_capital) setCapital(params.legal_capital);
        if (params.legal_fiscal_centre) setFiscalCentre(params.legal_fiscal_centre);
        if (params.legal_activity) setActivity(params.legal_activity);

        if (params.hours_mon_fri) setHoursMonFri(params.hours_mon_fri);
        if (params.hours_sat) setHoursSat(params.hours_sat);
        if (params.hours_sun) setHoursSun(params.hours_sun);
      }

      const contentRes = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/all');
      if (contentRes && contentRes.data && contentRes.data.domaines && contentRes.data.domaines.domaine4 && contentRes.data.domaines.domaine4.themes) {
        setThemes(contentRes.data.domaines.domaine4.themes);
      }
    } catch (err) {
      console.warn('Backend server not connected. Falling back to default contact info.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBadgeClick = () => {
    setFormData((prev) => ({
      ...prev,
      objet: 'Demande de formation'
    }));
    scrollToForm();
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (
      !formData.prenom ||
      !formData.nom ||
      !formData.email ||
      !formData.telephone ||
      !formData.organisation ||
      !formData.objet ||
      !formData.message
    ) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    try {
      // Submit to Backend Node.js express route
      await axios.post('https://expertise-senegal-api-olf5.onrender.com/api/messages', {
        nom: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        telephone: formData.telephone,
        organisation: formData.organisation,
        objet: formData.objet,
        message: formData.message
      });

      // Success State
      setSubmitted(true);
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        organisation: '',
        objet: '',
        message: ''
      });

      // Hide success message after 7 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.');
    }
  };

  return (
    <div className="contact-page">
      <SEO 
        title="Contact — Expertise Sénégal | 75C Cité Keur Gorgui, Dakar"
        description="Contactez Expertise Sénégal pour un devis personnalisé. Adresse : 75C Cité Keur Gorgui, Dakar. Tél : 33 823 54 52 / 77 643 41 60."
        url="https://www.expertisesenegal.com/contact"
      />
      {/* 1. HERO DE PAGE */}
      <section className="contact-hero">
        <div className="container contact-hero-content">
          <div className="hero-badge">
            <span className="dot"></span> CONTACT — EXPERTISE SÉNÉGAL
          </div>
          <h1 className="hero-title">
            Contactez <span className="text-gold">Notre Cabinet</span>
          </h1>
          <p className="hero-subtitle">
            Vous avez un projet, une mission ou une demande de formation ? Notre équipe est disponible pour vous accompagner.
          </p>
        </div>
      </section>

      {/* 2. SECTION PRINCIPALE */}
      <section className="contact-main section-padding" ref={formRef}>
        <div className="container contact-container">
          {/* Colonne gauche — Informations de contact */}
          <div className="contact-info-col">
            <h2 className="section-title text-left">Nos Coordonnées</h2>
            
            <div className="coord-list">
              <div className="coord-item">
                <span className="coord-icon">📍</span>
                <div className="coord-details">
                  <h4>Adresse</h4>
                  <p>{address}</p>
                </div>
              </div>

              <div className="coord-item">
                <span className="coord-icon">📞</span>
                <div className="coord-details">
                  <h4>Téléphone</h4>
                  {typeof phone === 'string' ? phone.split('—').map((p, idx) => (
                    <p key={idx}><a href={`tel:${p.trim()}`}>{p.trim()}</a></p>
                  )) : null}
                </div>
              </div>

              <div className="coord-item">
                <span className="coord-icon">✉️</span>
                <div className="coord-details">
                  <h4>Email</h4>
                  <p><a href={`mailto:${email}`}>{email}</a></p>
                </div>
              </div>

              <div className="coord-item">
                <span className="coord-icon">👤</span>
                <div className="coord-details">
                  <h4>Directeur</h4>
                  <p className="fw-semibold">Boussirou DIALLO</p>
                </div>
              </div>
            </div>

            <div className="golden-divider"></div>

            <div className="horaires-box">
              <h4>🕒 Horaires d'ouverture</h4>
              <ul className="horaires-list">
                <li><span>Lundi — Vendredi :</span> <span>{hoursMonFri}</span></li>
                <li><span>Samedi :</span> <span>{hoursSat}</span></li>
                <li><span>Dimanche :</span> <span className={hoursSun.toLowerCase() === 'fermé' ? 'text-red' : ''}>{hoursSun}</span></li>
              </ul>
            </div>
          </div>

          {/* Colonne droite — Formulaire de contact */}
          <div className="contact-form-col">
            <div className="form-card">
              <h3 className="form-title">Envoyez-nous un Message</h3>
              
              {submitted && (
                <div className="alert alert-success">
                  Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Ex: Babacar"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom">Nom <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Ex: Diop"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email professionnel <span className="required-star">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="b.diop@entreprise.sn"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone <span className="required-star">*</span></label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Ex: 77 123 45 67"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="organisation">Organisation / Structure <span className="required-star">*</span></label>
                  <input
                    type="text"
                    id="organisation"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="Nom de votre entreprise ou ministère"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="objet">Objet de la demande <span className="required-star">*</span></label>
                  <select
                    id="objet"
                    name="objet"
                    value={formData.objet}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionnez une option --</option>
                    <option value="Demande de devis">Demande de devis</option>
                    <option value="Demande de formation">Demande de formation</option>
                    <option value="Étude ou évaluation de projet">Étude ou évaluation de projet</option>
                    <option value="Audit marchés publics">Audit marchés publics</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message <span className="required-star">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Détaillez votre besoin ici..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-submit">
                  Envoyer le Message &rarr;
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION DEMANDE DE FORMATION */}
      <section className="formation-request bg-light section-padding">
        <div className="container text-center">
          <span className="label-gold">— PÔLE FORMATION —</span>
          <h2 className="section-title mt-2">Demander une Formation</h2>
          <p className="formation-subtitle-text max-width-600">
            Expertise Sénégal propose des formations intra-organisation, inter-organisations et sur site dans toutes les régions du Sénégal.
          </p>
          <div className="themes-grid-contact">
            {Array.isArray(themes) && themes.map((theme, index) => (
              <button 
                key={index} 
                onClick={handleBadgeClick} 
                className="theme-badge-btn"
                title="Cliquer pour demander cette formation"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFORMATIONS LÉGALES */}
      <section className="legal-section bg-dark text-white section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <span className="label-gold">— DONNÉES ADMINISTRATIVES —</span>
            <h2 className="section-title text-white mt-2">Informations Légales</h2>
          </div>
          <div className="legal-grid">
            <div className="legal-col">
              <ul className="legal-info-list">
                <li>
                  <span className="bullet">🔹</span>
                  <strong>Forme juridique :</strong> SARL
                </li>
                <li>
                  <span className="bullet">🔹</span>
                  <strong>Date de création :</strong> 22/11/2016
                </li>
                <li>
                  <span className="bullet">🔹</span>
                  <strong>Capital social :</strong> {capital}
                </li>
                <li>
                  <span className="bullet">🔹</span>
                  <strong>N° RC :</strong> {rc}
                </li>
              </ul>
            </div>
            <div className="legal-col">
              <ul className="legal-info-list">
                <li>
                  <span className="bullet">🔹</span>
                  <strong>NINEA :</strong> {ninea}
                </li>
                <li>
                  <span className="bullet">🔹</span>
                  <strong>Centre fiscal :</strong> {fiscalCentre}
                </li>
                <li>
                  <span className="bullet">🔹</span>
                  <strong>Activité :</strong> {activity}
                </li>
                <li>
                  <span className="bullet">🔹</span>
                  <strong>Email :</strong> {email}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="cta-section section-padding">
        <div className="container cta-content">
          <h2 className="cta-title">Prêt à démarrer votre projet ?</h2>
          <p className="cta-subtitle">Contactez-nous dès aujourd’hui pour un accompagnement personnalisé</p>
          <button onClick={scrollToForm} className="btn btn-secondary btn-lg">
            Demander un Devis &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;
