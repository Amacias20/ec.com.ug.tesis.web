import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Link } from 'react-router-dom';
import type { AppTopbarRef } from 'types/layout';
import { Ripple } from 'primereact/ripple';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage } from 'locale/i18n';
import setupLocalization from 'locale/PrimeReactLocale';

const AppTopbar = forwardRef<AppTopbarRef>((_props, ref) => {
  const { onMenuToggle, layoutConfig, layoutState } = useContext(LayoutContext);
  const { t } = useTranslation('common');
  const menubuttonRef = useRef<HTMLAnchorElement>(null);
  const languageOverlayRef = useRef<OverlayPanel>(null);
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('i18nextLng') || 'es');

  useEffect(() => {
    const handler = (lng: string) => setCurrentLang(lng);
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
  }));

  const shouldShowLogoText = () => {
    if (layoutConfig.menuMode === 'slim' || layoutConfig.menuMode === 'slim-plus') return false;
    if (layoutConfig.menuMode === 'drawer' || layoutConfig.menuMode === 'reveal') return layoutState.sidebarActive;
    return true;
  };

  const handleLanguageChange = async (lang: string) => {
    const ok = await changeLanguage(lang);
    if (ok) {
      setCurrentLang(lang);
      setupLocalization();
      languageOverlayRef.current?.hide();
    }
  };

  const langCode = currentLang.startsWith('en') ? 'en' : 'es';

  return (
    <div className="layout-topbar shadow-premium z-5" style={{ backgroundColor: '#374766' }}>
      <div className="layout-topbar-start" style={{ backgroundColor: '#374766' }}>
        <Link className="layout-topbar-logo flex align-items-center gap-2" to="/">
          {shouldShowLogoText() ? (
            <span className="font-bold text-xl text-white ml-2">{t('appName')}</span>
          ) : (
            <span className="font-bold text-white ml-2">{t('appNameShort')}</span>
          )}
        </Link>
        <a ref={menubuttonRef} className="p-ripple layout-menu-button flex align-items-center justify-content-center text-white transition-colors border-circle" onClick={onMenuToggle} style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#374766', border: '1px solid rgba(255,255,255,0.2)' }}>
          <i className="pi pi-bars text-xl"></i>
          <Ripple />
        </a>
      </div>
      <div className="layout-topbar-end">
        <ul className="layout-topbar-items m-0 p-0 list-none flex align-items-center gap-3">
          <li className="flex align-items-center">
            <Button
              className="p-button-text p-button-rounded flex align-items-center text-white hover:bg-white-alpha-20 transition-colors"
              onClick={(e) => languageOverlayRef.current?.toggle(e)}
              style={{ fontWeight: '600', height: '3rem' }}
              aria-label={t('language')}
            >
              <span className={`fp fp-md ${langCode === 'en' ? 'us' : 'ec'} mr-2 shadow-1 border-round-sm`}></span>
              {langCode.toUpperCase()}
              <i className="pi pi-chevron-down ml-2 text-xs"></i>
            </Button>
            <OverlayPanel ref={languageOverlayRef} className="shadow-premium border-round-xl">
              <div className="p-2">
                <div
                  className={`p-3 cursor-pointer border-round-lg transition-colors flex align-items-center ${langCode === 'es' ? 'bg-primary text-white' : 'hover:surface-100 text-700'}`}
                  onClick={() => handleLanguageChange('es')}
                >
                  <span className={`fp fp-md ec mr-2 shadow-1 border-round-sm`}></span>
                  <span className="font-bold">{t('spanish') || 'Español'}</span>
                  {langCode === 'es' && <i className="pi pi-check ml-auto"></i>}
                </div>
                <div
                  className={`p-3 cursor-pointer border-round-lg transition-colors flex align-items-center mt-1 ${langCode === 'en' ? 'bg-primary text-white' : 'hover:surface-100 text-700'}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  <span className={`fp fp-md us mr-2 shadow-1 border-round-sm`}></span>
                  <span className="font-bold">{t('english')}</span>
                  {langCode === 'en' && <i className="pi pi-check ml-auto"></i>}
                </div>
              </div>
            </OverlayPanel>
          </li>
        </ul>
      </div>
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
