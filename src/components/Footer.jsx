import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [phone, setPhone] = useState('33 823 54 52 — 77 643 41 60');
  const [email, setEmail] = useState('contact@expertisesenegal.com');
  const [address, setAddress] = useState('75 C Cité Keur Gorgui, Dakar, Sénégal');
  const [rc, setRc] = useState('SN.DKR.2016.B.26579');
  const [ninea, setNinea] = useState('006146642 2V2');

  useEffect(() => {
    fetchParams();
  }, []);

  const fetchParams = async () => {
    try {
      const response = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/parametres');
      if (response.data.contact_phone) setPhone(response.data.contact_phone);
      if (response.data.contact_email) setEmail(response.data.contact_email);
      if (response.data.contact_address) setAddress(response.data.contact_address);
      if (response.data.legal_rc) setRc(response.data.legal_rc);
      if (response.data.legal_ninea) setNinea(response.data.legal_ninea);
    } catch (err) {
      console.warn('Backend not connected for Footer parameters. Using defaults.');
    }
  };

  const handleAdminTrigger = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 1500) {
      const newCount = clickCount + 1;
      if (newCount >= 3) {
        setClickCount(0);
        navigate('/admin/login');
      } else {
        setClickCount(newCount);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(currentTime);
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <div className="logo-container-footer">
              <img src={logoImg} alt="Expertise Sénégal Logo" className="footer-logo-img" />
            </div>
          </Link>
          <p className="footer-desc">
            Cabinet pluridisciplinaire de conseil, de formation et d’études au service du développement socio-économique en Afrique de l’Ouest depuis 2016.
          </p>
        </div>

        <div className="footer-col links-col">
          <h3 className="footer-heading">Navigation</h3>
          <ul className="footer-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/a-propos">À Propos</Link></li>
            <li><Link to="/domaines">Domaines d'Activité</Link></li>
            <li><Link to="/seminaires">Séminaires &amp; Formations</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h3 className="footer-heading">Contact</h3>
          <ul className="footer-contact-info">
            <li>
              <span className="icon">📍</span>
              <span>{address}</span>
            </li>
            <li>
              <span className="icon">📞</span>
              <span>{phone}</span>
            </li>
            <li>
              <span className="icon">✉️</span>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <span className="icon">🏢</span>
              <span>RC : {rc} | NINEA : {ninea}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025 Expertise Sénégal — Études · Conseil · Formation</p>
        </div>
        <span className="admin-trigger" onClick={handleAdminTrigger}>·</span>
      </div>
    </footer>
  );
};

export default Footer;
