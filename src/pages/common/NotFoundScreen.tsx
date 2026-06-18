import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('notFound');

  return (
    <div
      className="layout-content"
      style={{
        minHeight: 'calc(100vh - 9rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        padding: '1rem',
      }}
    >
      <Card style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '2rem' }}>
        <div className="text-6xl font-bold text-primary mb-3">404</div>
        <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
        <p className="text-color-secondary mb-4">{t('subtitle')}</p>
        <p className="text-sm text-color-secondary mb-4">{t('message')}</p>
        <Button label={t('goBack')} icon="pi pi-arrow-left" onClick={() => navigate('/')} />
      </Card>
    </div>
  );
};

export default NotFound;
