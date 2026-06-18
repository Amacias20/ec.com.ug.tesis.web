const DevelopmentIndicator: React.FC = () => {
    const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'Development';

    if (!isDevelopment) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '12px',
                right: '-5px',
                zIndex: 1000,
                color: 'white',
                borderTopLeftRadius: '25px',
                borderBottomLeftRadius: '25px',
                width: '45px',
                height: '35px',
                background: 'repeating-linear-gradient(45deg, #ffd700, #ffd700 10px, #000 10px, #000 20px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.minWidth = '140px';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.minWidth = '15px';
            }}
        >
            <i className="fas fa-warning" style={{ marginRight: '10px', textShadow: '0 4px 8px rgba(0, 0, 0.8, 0.8)' }}></i>
            <span style={{ fontWeight: 'bold', textShadow: '0 4px 8px rgba(0, 0, 0.8, 0.8)' }}>Desarrollo</span>
        </div>
    );
};

export default DevelopmentIndicator;