import logoImg from '../assets/logo.png';

const Maintenance = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a2456',
      color: '#FFFFFF',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        marginBottom: '30px'
      }}>
        <img src={logoImg} alt="Expertise Sénégal" style={{ height: '60px', width: 'auto' }} />
      </div>

      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
      
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '15px',
        color: '#FFFFFF'
      }}>
        Site en <span style={{ color: '#C9952A' }}>Maintenance</span>
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        maxWidth: '600px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '30px'
      }}>
        Notre cabinet Expertise Sénégal met à jour ses services pour mieux vous accompagner. Nous serons de retour très prochainement.
      </p>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        paddingTop: '20px',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        Cabinet Conseil &amp; Études pluridisciplinaire depuis 2016.
      </div>
    </div>
  );
};

export default Maintenance;
