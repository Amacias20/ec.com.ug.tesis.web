import { useLocation } from 'react-router-dom';
import { GetMenu } from 'constants/Global';

interface MenuItem {
    url?: string;
    privileges?: string[];
    children?: MenuItem[];
    name?: string;
    icon?: string;
    order?: number;
    description?: string;
    nameEnglish?: string;
}

export const PrivilegesAccess = (specificPath?: string): string[] | null => {
    try {
        const location = useLocation();
        const currentPath = specificPath ?? location.pathname;

        const findPrivileges = (items: MenuItem[], path: string): string[] | null => {
            for (const item of items) {
                if (item.url === path) {
                    return item.privileges || [];
                }
                if (item.children && item.children.length > 0) {
                    const privileges = findPrivileges(item.children, path);
                    if (privileges) {
                        return privileges;
                    }
                }
            }
            return null;
        };
        
        const menuParsed = GetMenu();
        let parsedData;
        
        try {
            parsedData = JSON.parse(menuParsed ?? '[]');
        } catch (error) {
            return null;
        }
        
        // Navegar a través de la estructura de menú compleja
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            if (Array.isArray(parsedData[0])) {
                // Caso: [[ {...}, {...} ]]
                for (const menuGroup of parsedData[0]) {
                    const menuUserItem = menuGroup.menuUserItem;
                    
                    if (menuUserItem) {
                        if (Array.isArray(menuUserItem)) {
                            const privileges = findPrivileges(menuUserItem, currentPath);
                            if (privileges) return privileges;
                        } else {
                            // Si menuUserItem es un objeto con children
                            if (menuUserItem.children && menuUserItem.children.length > 0) {
                                const privileges = findPrivileges(menuUserItem.children, currentPath);
                                if (privileges) return privileges;
                            }
                        }
                    }
                }
            } else {
                // Caso original
                const menuItems = parsedData[0]?.menuUserItem || [];
                const menuArray = Array.isArray(menuItems) ? menuItems : [menuItems];
                return findPrivileges(menuArray, currentPath);
            }
        }
        
        return null;
    } catch (error) {
        console.error("Error al buscar privilegios:", error);
        return null;
    }
};