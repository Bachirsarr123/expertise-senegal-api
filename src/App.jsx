import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy Loaded Pages for performance optimization
const Accueil = lazy(() => import('./pages/Accueil'));
const APropos = lazy(() => import('./pages/APropos'));
const Domaines = lazy(() => import('./pages/Domaines'));
const Seminaires = lazy(() => import('./pages/Seminaires'));
const SeminaireDetail = lazy(() => import('./pages/SeminaireDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const References = lazy(() => import('./pages/References'));

import Maintenance from './pages/Maintenance';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ProtectedRoute from './admin/components/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';
import './App.css';

function App() {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const response = await axios.get('https://expertise-senegal-api-olf5.onrender.com/api/content/parametres');
      if (response.data.maintenance_mode === 'true') {
        // Only trigger maintenance if we are NOT on an admin route
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        if (!isAdminRoute) {
          setMaintenance(true);
        }
      }
    } catch (err) {
      console.warn('Backend server not connected. Falling back to default settings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a2456',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif"
      }}>
        <h2>Chargement des données...</h2>
      </div>
    );
  }

  if (maintenance) {
    return <Maintenance />;
  }

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes (Plain layout, without main Navbar & Footer) */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Public Pages (Wrapper with site Header & Footer + Lazy Loading + Suspense fallback loader) */}
          <Route 
            path="/*" 
            element={
              <div className="app-container">
                <Navbar />
                <main>
                  <Suspense fallback={
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                      background: '#1a2456'
                    }}>
                      <style>{`
                        @keyframes pulse {
                          0% { transform: scale(0.95); opacity: 0.8; }
                          50% { transform: scale(1.05); opacity: 1; }
                          100% { transform: scale(0.95); opacity: 0.8; }
                        }
                      `}</style>
                      <img
                        src="/logo.png"
                        alt="Expertise Sénégal"
                        style={{ width: 80, animation: 'pulse 1.2s infinite ease-in-out' }}
                      />
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Accueil />} />
                      <Route path="/a-propos" element={<APropos />} />
                      <Route path="/domaines" element={<Domaines />} />
                      <Route path="/seminaires" element={<Seminaires />} />
                      <Route path="/seminaires/:id" element={<SeminaireDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/references" element={<References />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            } 
          />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
