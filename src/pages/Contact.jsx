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
  const [phone, setPhone] = useState('33 823 54 52 - 77 643 41 60');
  const [email, setEmail] = useState('contact@expertisesenegal.com');
  const [address, setAddress] = useState('75 C Cite Keur Gorgui, Dakar, Senegal');
  const [rc, setRc] = useState('SN.DKR.2016.B.26579');
  const [ninea, setNinea] = useState('006146642 2V2');
  const [capital, setCapital] = useState('100 000 F CFA');
  const [fiscalCentre, setFiscalCentre] = useState('Dakar-Liberte');
  const [activity, setActivity] = useState('Conseil, Etudes et Formation');
  const [hoursMonFri, setHoursMonFri] = useState('08h00 - 18h00');
  const [hoursSat, setHoursSat] = useState('09h00 - 13h00');
  const [hoursSun, setHoursSun] = useState('Ferme');

  // Director & legal identity
  const [directorName, setDirectorName] = useState('Boussirou DIALLO');
  const [legalForm, setLegalForm] = useState('SARL');
  const [foundingDate, setFoundingDate] = useState('22/11/2016');

  // Contact page content
  const [heroBadge, setHeroBadge] = useState('CONTACT - EXPERTISE SENEGAL');
  const [heroTitleWhite, setHeroTitleWhite] = useState('Contactez');
  const [heroTitleGold, setHeroTitleGold] = useState('Notre Cabinet');
  const [heroSubtitle, setHeroSubtitle] = useState("Vous avez un projet, une mission ou une demande de formation ? Notre equipe est disponible pour vous accompagner.");
  const [formationBadge, setFormationBadge] = useState('- POLE FORMATION -');
  const [formationTitle, setFormationTitle] = useState('Demander une Formation');
  const [formationSubtitle, setFormationSubtitle] = useState("Expertise Senegal propose des formations intra-organisation, inter-organisations et sur site dans toutes les regions du Senegal.");
  const [ctaTitle, setCtaTitle] = useState('Pret a demarrer votre projet ?');
  const [ctaSubtitle, setCtaSubtitle] = useState("Contactez-nous des aujourd'hui pour un accompagnement personnalise");

  const [themes, setThemes] = useState([
    'Finance Publique',
    'Gestion de Projet',
    'Marches Publics',
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
        if (params.director_name) setDirectorName(params.director_name);
        if (params.legal_form) setLegalForm(params.legal_form);
        if (params.founding_date) setFoundingDate(params.founding_date);
      }

      const contentRes = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/all');
      const contentData = contentRes.data;
      if (contentData.domaines && contentData.domaines.domaine4 && contentData.domaines.domaine4.themes) {
        setThemes(contentData.domaines.domaine4.themes);
      }
      if (contentData.contact) {
        const c = contentData.contact;
        if (c.hero) {
          if (c.hero.badge) setHeroBadge(c.hero.badge);
          if (c.hero.title_white) setHeroTitleWhite(c.hero.title_white);
          if (c.hero.title_gold) setHeroTitleGold(c.hero.title_gold);
          if (c.hero.subtitle) setHeroSubtitle(c.hero.subtitle);
        }
        if (c.formation) {
          if (c.formation.badge) setFormationBadge(c.formation.badge);
          if (c.formation.title) setFormationTitle(c.formation.title);
          if (c.formation.subtitle) setFormationSubtitle(c.formation.subtitle);
        }
        if (c.cta) {
          if (c.cta.title) setCtaTitle(c.cta.title);
          if (c.cta.subtitle) setCtaSubtitle(c.cta.subtitle);
        }
      }
    } catch (err) {
      console.warn('Backend server not connected. Falling back to default contact info.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBadgeClick = () => {
    setFormData((prev) => ({ ...prev, objet: 'Demande de formation' }));
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

    if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone || !formData.organisation || !formData.objet || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    try {
      await axios.post('https://expertise-senegal-api-olf5.onrender.com/api/messages', {
        nom: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        telephone: formData.telephone,
        organisation: formData.organisation,
        objet: formData.objet,
        message: formData.message
      });

      setSubmitted(true);
      setFormData({ prenom: '', nom: '', email: '', telephone: '', organisation: '', objet: '', message: '' });
      setTimeout(() => { setSubmitted(false); }, 7000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError("Une erreur est survenue lors de l'envoi de votre message. Veuillez reessayer.");
    }
  };

  return (
    <div className="contact-page">
      <SEO
        title="Contact - Expertise Senegal | 75C Cite Keur Gorgui, Dakar"
        description="Contactez Expertise Senegal pour un devis personnalise. Adresse : 75C Cite Keur Gorgui, Dakar."
        url="https://www.expertisesenegal.com/contact"
      />

      {/* 1. HERO */}
      <section className="contact-hero">
        <div className="container contact-hero-content">
          <div className="hero-badge">
            <span className="dot"></span> {heroBadge}
          </div>
          <h1 className="hero-title">
            {heroTitleWhite} <span className="text-gold">{heroTitleGold}</span>
          </h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
        </div>
      </section>

      {/* 2. SECTION PRINCIPALE */}
      <section className="contact-main section-padding" ref={formRef}>
        <div className="container contact-container">
          <div className="contact-info-col">
            <h2 className="section-title text-left">Nos Coordonnees</h2>
            <div className="coord-list">
              <div className="coord-item">
                <span className="coord-icon">&#128205;</span>
                <div className="coord-details">
                  <h4>Adresse</h4>
                  <p>{address}</p>
                </div>
              </div>
              <div className="coord-item">
                <span className="coord-icon">&#128222;</span>
                <div className="coord-details">
                  <h4>Telephone</h4>
                  {typeof phone === 'string' ? phone.split('-').map((p, idx) => (
                    <p key={idx}><a href={`tel:${p.trim()}`}>{p.trim()}</a></p>
                  )) : null}
                </div>
              </div>
              <div className="coord-item">
                <span className="coord-icon">&#9993;&#65039;</span>
                <div className="coord-details">
                  <h4>Email</h4>
                  <p><a href={`mailto:${email}`}>{email}</a></p>
                </div>
              </div>
              <div className="coord-item">
                <span className="coord-icon">&#128100;</span>
                <div className="coord-details">
                  <h4>Directeur</h4>
                  <p className="fw-semibold">{directorName}</p>
                </div>
              </div>
            </div>
            <div className="golden-divider"></div>
            <div className="horaires-box">
              <h4>&#128338; Horaires d'ouverture</h4>
              <ul className="horaires-list">
                <li><span>Lundi - Vendredi :</span> <span>{hoursMonFri}</span></li>
                <li><span>Samedi :</span> <span>{hoursSat}</span></li>
                <li><span>Dimanche :</span> <span className={hoursSun.toLowerCase() === 'ferme' ? 'text-red' : ''}>{hoursSun}</span></li>
              </ul>
            </div>
          </div>

          <div className="contact-form-col">
            <div className="form-card">
              <h3 className="form-title">Envoyez-nous un Message</h3>
              {submitted && (
                <div className="alert alert-success">
                  Merci ! Votre message a bien ete envoye. Nous vous repondrons dans les plus brefs delais.
                </div>
              )}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prenom">Prenom <span className="required-star">*</span></label>
                    <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Ex: Babacar" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom">Nom <span className="required-star">*</span></label>
                    <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Ex: Diop" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email professionnel <span className="required-star">*</span></label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="b.diop@entreprise.sn" required />
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">Telephone <span className="required-star">*</span></label>
                  <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Ex: 77 123 45 67" required />
                </div>
                <div className="form-group">
                  <label htmlFor="organisation">Organisation / Structure <span className="required-star">*</span></label>
                  <input type="text" id="organisation" name="organisation" value={formData.organisation} onChange={handleChange} placeholder="Nom de votre entreprise ou ministere" required />
                </div>
                <div className="form-group">
                  <label htmlFor="objet">Objet de la demande <span className="required-star">*</span></label>
                  <select id="objet" name="objet" value={formData.objet} onChange={handleChange} required>
                    <option value="">-- Selectionnez une option --</option>
                    <option value="Demande de devis">Demande de devis</option>
                    <option value="Demande de formation">Demande de formation</option>
                    <option value="Etude ou evaluation de projet">Etude ou evaluation de projet</option>
                    <option value="Audit marches publics">Audit marches publics</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message <span className="required-star">*</span></label>
                  <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} placeholder="Detaillez votre besoin ici..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-submit">
                  Envoyer le Message &rarr;
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION FORMATION */}
      <section className="formation-request bg-light section-padding">
        <div className="container text-center">
          <span className="label-gold">{formationBadge}</span>
          <h2 className="section-title mt-2">{formationTitle}</h2>
          <p className="formation-subtitle-text max-width-600">{formationSubtitle}</p>
          <div className="themes-grid-contact">
            {Array.isArray(themes) && themes.map((theme, index) => (
              <button key={index} onClick={handleBadgeClick} className="theme-badge-btn" title="Cliquer pour demander cette formation">
                {theme}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INFORMATIONS LEGALES */}
      <section className="legal-section bg-dark text-white section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <span className="label-gold">- DONNEES ADMINISTRATIVES -</span>
            <h2 className="section-title text-white mt-2">Informations Legales</h2>
          </div>
          <div className="legal-grid">
            <div className="legal-col">
              <ul className="legal-info-list">
                <li><span className="bullet">&#128313;</span><strong>Forme juridique :</strong> {legalForm}</li>
                <li><span className="bullet">&#128313;</span><strong>Date de creation :</strong> {foundingDate}</li>
                <li><span className="bullet">&#128313;</span><strong>Capital social :</strong> {capital}</li>
                <li><span className="bullet">&#128313;</span><strong>N RC :</strong> {rc}</li>
              </ul>
            </div>
            <div className="legal-col">
              <ul className="legal-info-list">
                <li><span className="bullet">&#128313;</span><strong>NINEA :</strong> {ninea}</li>
                <li><span className="bullet">&#128313;</span><strong>Centre fiscal :</strong> {fiscalCentre}</li>
                <li><span className="bullet">&#128313;</span><strong>Activite :</strong> {activity}</li>
                <li><span className="bullet">&#128313;</span><strong>Email :</strong> {email}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="cta-section section-padding">
        <div className="container cta-content">
          <h2 className="cta-title">{ctaTitle}</h2>
          <p className="cta-subtitle">{ctaSubtitle}</p>
          <button onClick={scrollToForm} className="btn btn-secondary btn-lg">
            Demander un Devis &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;