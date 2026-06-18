import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import type { LayoutState } from 'types/layout';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppMenu from './AppMenu';

const AppSidebar = () => {
  const { t } = useTranslation('common');
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  const anchor = () => {
    setLayoutState((prev: LayoutState) => ({ ...prev, anchored: !prev.anchored }));
  };

  return (
    <React.Fragment>
      <div className="layout-sidebar-top">
        <Link to="/" className="flex align-items-center px-3">
          <span className="font-bold text-lg">{t('appNameShort')}</span>
          <span className="ml-2 text-sm">Multi-Label</span>
        </Link>
        <button className="layout-sidebar-anchor p-link" type="button" onClick={anchor}></button>
      </div>
      <div className="layout-menu-container">
        <MenuProvider>
          <AppMenu />
        </MenuProvider>
      </div>
    </React.Fragment>
  );
};

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
