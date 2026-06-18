import { useTranslation } from 'react-i18next';

const AppFooter = () => {
  const { t } = useTranslation('common');
  return (
    <div className="layout-footer mt-auto py-4 bg-white border-top-1 surface-border">
      <div className="flex flex-column md:flex-row align-items-center justify-content-center gap-3">
        <div className="flex align-items-center gap-2">
            <i className="pi pi-heart-fill text-primary" style={{ fontSize: '1.2rem' }}></i>
            <span className="text-700 font-medium">{t('footer', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
