export const ENVIRONMENT: string = import.meta.env.VITE_ENVIRONMENT;
export const API = import.meta.env.VITE_BASE_API;
export const APP_CODE =import.meta.env.VITE_APP_CODE
export const IMAGE_VISOR = import.meta.env.VITE_IMAGE_VISOR;

const URL_SECURITY = `${API}/security/api/`;
const URL_CATALOG = `${API}/catalog/api/`;

console.log('*********************');
console.log('net.diligentec.web.shell');
console.log('API', API);
console.log('ENVIRONMENT', ENVIRONMENT);
console.log('IMAGE_VISOR', IMAGE_VISOR);
console.log('URL_SECURITY', URL_SECURITY);
console.log('*********************');

export const SecurityPathsEnum: Record<string, string> = {
    Auth: 'auth',
    AuthById: 'auth/by_identification',
    Companies: 'companies',
    Menu: 'menus',
    MenuAssignments: 'menu_assignments',
    Applications: 'applications',
    Rol: 'roles',
    RolMenu: 'role_menu_templates',
    Users: 'users',
    UserCompanyRol: 'user_company_roles',
    Log: 'user_access_logs',
    Priviliges: 'privileges',
    UserAppRol: 'user_application_role',
    CheckSum: 'checksums',
    Configurations: 'configurations',
    UserProfile: 'user_profiles',
    UserCompany: 'user_company',
    UserApplications: 'user_applications'
}

export const DataMasterPathsEnum: Record<string, string> = {
    Companies: 'companies',
}

export const SecurityPathBuilder = (paths: string): string =>
    `${URL_SECURITY}${paths}`;

export const DataMasterPathBuilder = (paths: string): string =>
    `${URL_CATALOG}${paths}`;

export const BuildUrlParams = (params: Record<string, string | string[] | undefined>): string => {
    const urlParts: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(item => {

                if (item !== undefined && item !== null && item !== '') {
                    urlParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
                }
            });
        } else if (value !== undefined && value !== null && value !== '') {
            urlParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
    });

    return urlParts.join('&');
}