const DevelopmentRibbon: React.FC = () => {
    const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'Development';

    if (!isDevelopment) {
        return null;
    }

    return (
        <div style={{
            width: '300px',
            padding: '10px',
            background: 'repeating-linear-gradient(45deg, #ffd700, #ffd700 10px, #000 10px, #000 20px)',
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '1.5px',
                color: '#000000',
                fontSize: '1rem',
            }}>
                {isDevelopment ? 'Desarrollo' : 'Pruebas'}
            </div>
        </div>
    );
};

export default DevelopmentRibbon;