import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Link, useLocation } from 'react-router-dom';
import type { Breadcrumb } from 'types/layout';
import { ObjectUtils } from 'primereact/utils';
import { GetMenu } from 'constants/Global';
import { routes } from '../routes/Routes';

const AppBreadCrumb = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const [breadcrumb, setBreadcrumb] = useState<Breadcrumb | null>(null);
    const { breadcrumbs } = useContext(LayoutContext);

    const [appName, setAppName] = useState<string | null>(null);

    useEffect(() => {
        let menu = [];
        try {
            const menuStr = GetMenu();
            if (menuStr) {
                const parsedMenu = JSON.parse(menuStr);
                menu = Array.isArray(parsedMenu[0]) ? parsedMenu[0] : parsedMenu;
            }
        } catch (e) {
            console.error('Error parsing menu in breadcrumb:', e);
        }

        if (!Array.isArray(menu)) {
            menu = [];
        }

        let foundAppName = null;

        for (const app of menu) {
            if (app.menuUserItem && Array.isArray(app.menuUserItem.children)) {
                const match = app.menuUserItem.children.find(child =>
                    pathname.startsWith(child.url)
                );
                if (match) {
                    foundAppName = app.name;
                    break;
                }
                for (const child of app.menuUserItem.children) {
                    if (child.children && child.children.length > 0) {
                        const subMatch = child.children.find(subchild =>
                            pathname.startsWith(subchild.url)
                        );
                        if (subMatch) {
                            foundAppName = app.name;
                            break;
                        }
                    }
                }
            }
        }

        setAppName(foundAppName);

        const path = pathname.replace(/\/$/, '');
        const matchedRoute = routes.find(route =>
            ('/' + route.path).replace(/\/$/, '') === path
        );

        if (matchedRoute) {
            const pathParts = matchedRoute.path.split('/').filter(Boolean);
            const breadcrumbLabels = [];

            if (pathParts.length > 1) {
                let currentPath = '';

                for (let i = 0; i < pathParts.length - 1; i++) {
                    currentPath += (currentPath ? '/' : '') + pathParts[i];
                    const parentRoute = routes.find(r =>
                        r.path === currentPath ||
                        r.path === currentPath + '/'
                    );
                    if (parentRoute) {
                        breadcrumbLabels.push(parentRoute.pathLabel);
                    }
                }
            }

            breadcrumbLabels.push(matchedRoute.pathLabel);

            setBreadcrumb({
                to: pathname,
                labels: breadcrumbLabels
            });
        } else {
            const filteredBreadcrumbs = breadcrumbs?.find((crumb: Breadcrumb) => {
                return crumb.to?.replace(/\/$/, '') === pathname.replace(/\/$/, '');
            });
            setBreadcrumb(filteredBreadcrumbs ?? null);
        }
    }, [pathname, breadcrumbs]);

    return (
        <div className="w-full px-4 md:px-6 lg:px-8 py-3 flex align-items-center">
            <nav className="w-full">
                <ol className="flex align-items-center m-0 p-0 list-none text-700 font-medium">
                    <li className="flex align-items-center">
                        <Link to={'/'} className="text-700 hover:text-primary transition-colors">
                            <i className="pi pi-home text-lg"></i>
                        </Link>
                    </li>
                    {appName && (
                        <>
                            <i className="pi pi-angle-right mx-2 text-500"></i>
                            <li className="flex align-items-center">{appName}</li>
                        </>
                    )}
                    {ObjectUtils.isNotEmpty(breadcrumb?.labels)
                        ? breadcrumb?.labels?.map((label, index) => (
                            <React.Fragment key={index}>
                                <i className="pi pi-angle-right mx-2 text-500"></i>
                                <li key={index} className="flex align-items-center">{label}</li>
                            </React.Fragment>
                        ))
                        : null}
                </ol>
            </nav>
        </div>
    );
};

export default AppBreadCrumb;