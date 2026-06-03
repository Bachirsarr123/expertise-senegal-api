import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/logo.png';
import './Login.css';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Connect to our express server on PORT 5000
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        login,
        password
      });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Impossible de se connecter au serveur. Assurez-vous que le serveur Node.js est démarré.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-container">
            <img src={logoImg} alt="Expertise Sénégal" className="login-logo-img" />
          </div>
          <h2>Accès Administration</h2>
          <p>Expertise Sénégal — Cabinet Conseil &amp; Études</p>
        </div>

        {error && <div className="login-alert-danger">{error}</div>}

        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="login">Identifiant</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Saisissez votre identifiant"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Saisissez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
