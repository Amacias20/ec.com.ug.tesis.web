export const flattenMenu = (menu: any[]): { url: string, privileges: string[] }[] => {
    return menu.flatMap(section => {
        const children = section?.menuUserItem?.children ?? [];
        return flattenItems(children);
    });
};

const flattenItems = (items: any[]): { url: string, privileges: string[] }[] => {
    return items.flatMap(item => {
        const url = item.url ? (item.url.startsWith('/') ? item.url : '/' + item.url) : '';
        const privileges = Array.isArray(item.privileges) ? item.privileges : [];
        const nested = item.children ? flattenItems(item.children) : [];
        return url ? [{ url, privileges }, ...nested] : [...nested];
    });
};

export const checkRoutePermission = (menu: any[]) => {
    const menuItems = flattenMenu(menu);

    return (path: string): boolean => {
        const normalized = path.startsWith('/') ? path : '/' + path;

        // 👇 si todavía no hay menú cargado, deja pasar
        if (!menuItems.length) return true;

        if (normalized === '/' || normalized === '') return true;
        if (normalized.endsWith('/profile')) return true;
        if (normalized.endsWith('/view')) return true;

        const found = menuItems.find(item => item.url === normalized);
        if (found) return true;

        if (normalized.startsWith('/custom/orders/')) {
            const foundBase = menuItems.find(item => item.url === '/custom/orders');
            if (foundBase) return true;
        }

        if (normalized.endsWith('/detail')) {
            const base = normalized.replace(/\/detail$/, '');
            const baseItem = menuItems.find(item => item.url === base);
            if (baseItem && (
                baseItem.privileges.includes('Nuevo') ||
                baseItem.privileges.includes('Editar') ||
                baseItem.privileges.includes('Detalles')
            )) return true;
        }

        if (normalized.endsWith('/new')) {
            const base = normalized.replace(/\/new$/, '');
            const baseItem = menuItems.find(item => item.url === base);
            if (baseItem && (
                baseItem.privileges.includes('Nuevo') ||
                baseItem.privileges.includes('Editar')
            )) return true;
        }

        return false;
    };
};