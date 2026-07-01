import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [phone, setPhone] = useState('33 823 54 52 - 77 643 41 60');
  const [email, setEmail] = useState('contact@expertisesenegal.com');
  const [address, setAddress] = useState('75 C Cite Keur Gorgui, Dakar, Senegal');
  const [rc, setRc] = useState('SN.DKR.2016.B.26579');
  const [ninea, setNinea] = useState('006146642 2V2');
  const [footerDesc, setFooterDesc] = useState("Cabinet pluridisciplinaire de conseil, de formation et d'etudes au service du developpement socio-economique en Afrique de l'Ouest depuis 2016.");
  const [footerCopyright, setFooterCopyright] = useState('2025 Expertise Senegal - Etudes · Conseil · Formation');

  useEffect(() => { fetchParams(); }, []);

  const fetchParams = async () => {
    try {
      const { data } = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/parametres');
      if (data.contact_phone) setPhone(data.contact_phone);
      if (data.contact_email) setEmail(data.contact_email);
      if (data.contact_address) setAddress(data.contact_address);
      if (data.legal_rc) setRc(data.legal_rc);
      if (data.legal_ninea) setNinea(data.legal_ninea);
      if (data.footer_description) setFooterDesc(data.footer_description);
      if (data.footer_copyright) setFooterCopyright(data.footer_copyright);
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
              <img src={logoImg} alt="Expertise Senegal Logo" className="footer-logo-img" />
            </div>
          </Link>
          <p className="footer-desc">{footerDesc}</p>
        </div>

        <div className="footer-col links-col">
          <h3 className="footer-heading">Navigation</h3>
          <ul className="footer-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/a-propos">A Propos</Link></li>
            <li><Link to="/domaines">Domaines d'Activite</Link></li>
            <li><Link to="/seminaires">Seminaires &amp; Formations</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h3 className="footer-heading">Contact</h3>
          <ul className="footer-contact-info">
            <li>
              <span className="icon">&#128205;</span>
              <span>{address}</span>
            </li>
            <li>
              <span className="icon">&#128222;</span>
              <span>{phone}</span>
            </li>
            <li>
              <span className="icon">&#9993;&#65039;</span>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <span className="icon">&#127970;</span>
              <span>RC : {rc} | NINEA : {ninea}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {footerCopyright}</p>
        </div>
        <span className="admin-trigger" onClick={handleAdminTrigger}>&middot;</span>
      </div>
    </footer>
  );
};

export default Footer;