import type { MenuProps, MenuModel, Breadcrumb, BreadcrumbItem } from 'types/index';
import { LayoutContext } from './context/layoutcontext';
import { useContext, useEffect, useRef } from 'react';
import { MenuProvider } from './context/menucontext';
import { Tooltip } from 'primereact/tooltip';
import AppMenuitem from './AppMenuitem';

const AppSubMenu = (props: MenuProps) => {
    const { layoutState, setBreadcrumbs } = useContext(LayoutContext);
    const tooltipRef = useRef<Tooltip | null>(null);

    useEffect(() => {
        if (tooltipRef.current) {
            tooltipRef.current.hide();
            (tooltipRef.current as Tooltip).updateTargetEvents();
        }
    }, [layoutState.overlaySubmenuActive]);

    useEffect(() => {
        generateBreadcrumbs(props.model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateBreadcrumbs = (model: MenuModel[]) => {
        const breadcrumbs: Breadcrumb[] = [];

        const getBreadcrumb = (item: BreadcrumbItem, labels: string[] = []) => {
            const { label, to, items } = item;

            if (label) labels.push(label);
            if (items) {
                items.forEach((_item) => {
                    getBreadcrumb(_item, labels.slice());
                });
            }
            if (to) breadcrumbs.push({ labels, to });
        };

        model.forEach((item) => {
            getBreadcrumb(item);
        });
        setBreadcrumbs(breadcrumbs);
    };

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {props.model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
            <Tooltip ref={tooltipRef} target="li:not(.active-menuitem)>.tooltip-target" />
        </MenuProvider>
    );
};

export default AppSubMenu;