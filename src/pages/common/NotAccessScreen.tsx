import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";

const NotAccess: React.FC = () => {
  const navigate = useNavigate();

  const backgroundPatternStyle = {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage:
      'radial-gradient(rgba(0, 0, 0, 0.03) 2px, transparent 2px), radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 20px',
    opacity: 0.8,
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
    border: 'none',
    overflow: 'hidden',
    padding: '2rem',
    textAlign: 'center' as const,
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative' as const,
    zIndex: 1,
    animation: 'fadeIn 0.5s ease-out',
  };

  const errorCodeStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1rem 0 1.5rem',
  };

  const errorNumberStyle = {
    fontSize: '6rem',
    fontWeight: 800,
    color: '#3b82f6',
    lineHeight: 1,
    textShadow: '2px 2px 0 rgba(59, 130, 246, 0.1)',
  };

  const errorIconStyle = {
    fontSize: '4.5rem',
    color: '#3b82f6',
    marginBottom: '0.5rem',
    animation: 'bounce 2s infinite',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '0.5rem',
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 400,
    color: '#4b5563',
    marginBottom: '1.5rem',
  };

  const messageStyle = {
    color: '#6b7280',
    lineHeight: 1.6,
    maxWidth: '550px',
    margin: '0 auto 1.5rem',
    fontSize: '0.95rem',
  };

  const suggestionsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    margin: '1.5rem auto',
    maxWidth: '800px',
    width: '100%',
    justifyContent: 'center',
  };

  const suggestionStyle = {
    background: '#f9fafb',
    padding: '1rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    border: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    minWidth: '220px',
    flex: '1',
    maxWidth: '100%',
  };

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap' as const,
  };

  const handleRedirect = (): void => {
    navigate("/");
  };

  return (
    <div
      className="layout-content"
      style={{
        minHeight: 'calc(100vh - 9rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        position: 'relative',
        padding: '1rem',
      }}
    >
      <div style={backgroundPatternStyle}></div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-8px);
            }
            60% {
              transform: translateY(-4px);
            }
          }
        `}
      </style>

      <div className="grid no-select" style={{ width: '100%' }}>
        <div className="col-12">
          <Card style={cardStyle}>
            <div style={errorCodeStyle}>
              <i style={errorIconStyle} className="pi pi-lock"></i>
              <div style={errorNumberStyle}>403</div>
            </div>
            <h1 style={titleStyle}>Sin acceso</h1>
            <h2 style={subtitleStyle}>
              No tienes permiso para ver esta página
            </h2>
            <div style={messageStyle}>
              <p>
                Es posible que tu usuario no tenga los permisos necesarios o que el acceso
                esté restringido por el administrador del sistema.
              </p>
              <div style={suggestionsStyle}>
                <div style={suggestionStyle}>
                  <i
                    className="pi pi-user"
                    style={{ color: '#3b82f6', fontSize: '1.1rem' }}
                  ></i>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    Verifica tu rol o permisos con el administrador
                  </span>
                </div>
                <div style={suggestionStyle}>
                  <i
                    className="pi pi-home"
                    style={{ color: '#3b82f6', fontSize: '1.1rem' }}
                  ></i>
                  <span style={{ whiteSpace: 'nowrap' }}>Volver a la página de inicio</span>
                </div>
              </div>
            </div>
            <div style={actionsStyle}>
              <Button
                label="Regresar"
                icon="pi pi-arrow-left"
                onClick={handleRedirect}
                className="p-button-primary"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotAccess;