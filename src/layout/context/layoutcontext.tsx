import type { ChildContainerProps, LayoutContextProps, LayoutConfig, LayoutState, Breadcrumb, ColorScheme } from 'types/index';
import React, { useState, useEffect } from 'react';

export const LayoutContext = React.createContext({} as LayoutContextProps);

export const LayoutProvider = (props: ChildContainerProps) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const getInitialLayoutConfig = () => {
        const stored = localStorage.getItem('layoutConfig');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                // fallback si hay error de parseo
            }
        }
        return {
            ripple: true,
            inputStyle: 'outlined',
            menuMode: 'static',
            menuTheme: localStorage.getItem('menuTheme') || 'light',
            colorScheme: localStorage.getItem('colorScheme') as ColorScheme || 'light',
            scale: 14,
            menuProfilePosition: 'start',
            desktopMenuActive: true,
            mobileMenuActive: false,
            mobileTopbarActive: false,
            componentTheme: 'orange',
            topbarTheme: 'orange',
        };
    };
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(getInitialLayoutConfig());

    useEffect(() => {
        localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
    }, [layoutConfig]);

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        profileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        menuProfileActive: false,
        resetMenu: false
    });

    const onMenuProfileToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            menuProfileActive: !prevLayoutState.menuProfileActive
        }));
    };

    const isSidebarActive = () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive;

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isSlim = () => {
        return layoutConfig.menuMode === 'slim';
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === 'slim-plus';
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === 'horizontal';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    const onTopbarMenuToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            topbarMenuActive: !prevLayoutState.topbarMenuActive
        }));
    };
    const showRightSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            rightMenuActive: true
        }));
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        isSidebarActive,
        breadcrumbs,
        setBreadcrumbs,
        onMenuProfileToggle,
        onTopbarMenuToggle,
        showRightSidebar
    };

    return (
        <LayoutContext.Provider value={value}>
            {props.children}
        </LayoutContext.Provider>
    );
};