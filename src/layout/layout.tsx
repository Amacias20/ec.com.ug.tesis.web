import { useEventListener, useMountEffect, useResizeListener, useUnmountEffect } from 'primereact/hooks';
import type { AppTopbarRef, ChildContainerProps, LayoutConfig, LayoutState } from 'types/index';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { classNames, DomHandler } from 'primereact/utils';
import { useDocumentTitle } from 'hooks/useDocumentTitle';
import { LayoutContext } from './context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routes } from 'routes/Routes';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppFooter from './AppFooter';
import AppBreadCrumb from './AppBreadCrumb';
const Layout = (props: ChildContainerProps) => {
  const { layoutConfig, layoutState, setLayoutState, isSlim, isSlimPlus, isHorizontal, isDesktop, isSidebarActive } =
    useContext(LayoutContext);
  const { setRipple } = useContext(PrimeReactContext);
  const topbarRef = useRef<AppTopbarRef>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const searchParams = location.search;
  const { t } = useTranslation(['menu', 'common']);

  const normalize = (str: string) => str.replace(/\/$/, '');
  const currentRoute = routes.find((route) => normalize(route.path) === normalize(pathname));
  const state = location.state as { editing?: boolean };
  const pageTitle =
    typeof currentRoute?.pathLabel === 'string'
      ? t(currentRoute.pathLabel)
      : currentRoute?.pathLabel?.(state) ?? t('menu:notFound');
  useDocumentTitle(pageTitle, { appName: t('common:appName') });

  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: (event) => {
      const isOutsideClicked = !(
        sidebarRef.current?.isSameNode(event.target as Node) ||
        sidebarRef.current?.contains(event.target as Node) ||
        topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
        topbarRef.current?.menubutton?.contains(event.target as Node)
      );
      if (isOutsideClicked) hideMenu();
    },
  });

  const [bindDocumentResizeListener, unbindDocumentResizeListener] = useResizeListener({
    listener: () => {
      if (isDesktop() && !DomHandler.isTouchDevice()) hideMenu();
    },
  });

  const hideMenu = useCallback(() => {
    const mode = layoutConfig.menuMode;
    const needsReset =
      (mode === 'slim' || mode === 'slim-plus' || mode === 'horizontal') && window.innerWidth > 991;

    setLayoutState((prev: LayoutState) => {
      if (
        !prev.overlayMenuActive &&
        !prev.overlaySubmenuActive &&
        !prev.staticMenuMobileActive &&
        !prev.menuHoverActive &&
        prev.resetMenu === needsReset
      ) {
        return prev;
      }
      return {
        ...prev,
        overlayMenuActive: false,
        overlaySubmenuActive: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        resetMenu: needsReset,
      };
    });
  }, [layoutConfig.menuMode, setLayoutState]);

  const blockBodyScroll = () => document.body.classList.add('blocked-scroll');
  const unblockBodyScroll = () => document.body.classList.remove('blocked-scroll');

  useMountEffect(() => setRipple?.(layoutConfig.ripple));

  const onMouseEnter = () => {
    if (!layoutState.anchored) {
      setLayoutState((prev: LayoutState) => ({ ...prev, sidebarActive: true }));
    }
  };

  const onMouseLeave = () => {
    if (!layoutState.anchored) {
      setLayoutState((prev: LayoutState) => ({ ...prev, sidebarActive: false }));
    }
  };

  useEffect(() => {
    if (isSidebarActive()) bindMenuOutsideClickListener();
    if (layoutState.staticMenuMobileActive) {
      blockBodyScroll();
      if (isSlim() || isSlimPlus() || isHorizontal()) bindDocumentResizeListener();
    }
    return () => {
      unbindMenuOutsideClickListener();
      unbindDocumentResizeListener();
      unblockBodyScroll();
    };
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive, layoutState.overlaySubmenuActive]);

  useEffect(() => {
    hideMenu();
  }, [pathname, searchParams, hideMenu]);

  useUnmountEffect(() => unbindMenuOutsideClickListener());

  const containerClassName = classNames(
    'layout-topbar-' + layoutConfig.topbarTheme,
    'layout-menu-' + layoutConfig.menuTheme,
    {
      'layout-overlay': layoutConfig.menuMode === 'overlay',
      'layout-static': layoutConfig.menuMode === 'static',
      'layout-slim': layoutConfig.menuMode === 'slim',
      'p-input-filled': layoutConfig.inputStyle === 'filled',
      'layout-sidebar-dark': layoutConfig.colorScheme === 'dark',
      'p-ripple-disabled': !layoutConfig.ripple,
      'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
      'layout-overlay-active': layoutState.overlayMenuActive,
      'layout-mobile-active': layoutState.staticMenuMobileActive,
      'layout-sidebar-active': layoutState.sidebarActive,
      'layout-sidebar-anchored': layoutState.anchored,
    }
  );

  return (
    <div className={classNames('layout-container', containerClassName)}>
      <AppTopbar ref={topbarRef} />
      <div ref={sidebarRef} className="layout-sidebar" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <AppSidebar />
      </div>
      <div className="layout-content-wrapper flex flex-column min-h-screen">
        <div className="w-full border-bottom-1 surface-border surface-section">
          <AppBreadCrumb />
        </div>
        <div className="layout-content flex-grow-1 flex flex-column">
          {props.children}
        </div>
        <AppFooter />
      </div>
      <div className="layout-mask"></div>
    </div>
  );
};

export default Layout;
