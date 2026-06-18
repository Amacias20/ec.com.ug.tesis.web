import { GetUserApplicationsByUserId } from 'services/security/endpoints/UserApplicationService';
import { GetApplications } from 'services/security/endpoints/ApplicationService';
import { GetUser, ErrorHandler } from 'constants/Global';
import { ToastError } from 'components/Messages/Toast';
import { useTranslation } from 'react-i18next';
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";

const BULLET_COLORS = [
    '#FF9800', // naranja
    '#8e24aa', // púrpura
    '#00bcd4', // cyan
    '#ffb300', // naranja más claro
    '#43a047', // verde
    '#e53935'  // rojo
];

function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const STORAGE_KEY = 'appVisibilitySettings';

export const getSavedAppVisibility = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error al recuperar la configuración de visibilidad:', error);
        return {};
    }
};

export const saveAppVisibility = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error al guardar la configuración de visibilidad:', error);
    }
};

const ApplicationSideBar = ({ visible, setVisible }) => {
    const [applications, setApplications] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [appVisibility, setAppVisibility] = useState(getSavedAppVisibility());
    const [bulletColorsMap, setBulletColorsMap] = useState({});
    const { t, i18n } = useTranslation('common');
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const user = GetUser();

    useEffect(() => {
        if (visible) {
            fetchApplications();
        }
    }, [visible, currentLanguage]);

    useEffect(() => {
        const handleLanguageChange = () => {
            setCurrentLanguage(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, currentLanguage]);

    const fetchApplications = async () => {
        try {
            const userAppsResponse = await GetUserApplicationsByUserId(user.idUser, { Status: 'ACTIVO', IncludeApplication: true });
            setUserApplications(userAppsResponse.data.data);
            const appsResponse = await GetApplications({ status: 'ACTIVO' });
            const apps = appsResponse.data.data.filter(app => !app.isExternalApplication);
            setApplications(apps);

            // Visibilidad
            const savedVisibility = getSavedAppVisibility();
            const initialVisibility = { ...savedVisibility };

            apps.forEach((app) => {
                const name = getLocalizedName(app);
                if (initialVisibility[name] === undefined) {
                    initialVisibility[name] = true;
                }
            });

            setAppVisibility(initialVisibility);
            saveAppVisibility(initialVisibility);

            // Colores aleatorios para cada app
            let shuffledColors = shuffle(BULLET_COLORS);
            let colorMap = {};
            apps.forEach((app, idx) => {
                const name = getLocalizedName(app);
                colorMap[name] = shuffledColors[idx % shuffledColors.length];
            });
            setBulletColorsMap(colorMap);

        } catch (error) {
            ToastError(await ErrorHandler(error));
        }
    };

    const getLocalizedName = (application) => {
        return i18n.language === 'en' && application.nameEnglish
            ? application.nameEnglish
            : application.name;
    };

    const handleAppVisibilityChange = (appName, checked) => {
        const updatedVisibility = {
            ...appVisibility,
            [appName]: checked
        };

        setAppVisibility(updatedVisibility);
        saveAppVisibility(updatedVisibility);
    };

    const filteredApplications = applications.filter(app =>
        userApplications.some(userApp => userApp.applicationId === app.idApplication)
    );

    // Ordenar alfabéticamente por nombre ya localizado
    const sortedApplications = filteredApplications.slice().sort((a, b) => {
        const nameA = getLocalizedName(a).toLowerCase();
        const nameB = getLocalizedName(b).toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // Fallback para textos en español si i18n falla
    const getTextWithFallback = (key) => {
        const translation = t(key);

        if (!translation || translation === key) {
            const fallbackTexts = {
                'appVisibility': 'Visibilidad de Aplicaciones',
                'selectAppVisibility': 'Seleccione qué aplicaciones desea ver en el menú'
            };
            return fallbackTexts[key] || key;
        }
        return translation;
    };

    return (
        <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className="p-sidebar-sm w-80">
            <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
                    {getTextWithFallback('appVisibility')}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '16px' }}>
                    {getTextWithFallback('selectAppVisibility')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sortedApplications.map((app) => {
                        const appName = getLocalizedName(app);
                        const isVisible = appVisibility[appName] !== false;

                        return (
                            <div
                                key={app.idApplication}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    transition: 'background 0.2s',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                                onClick={() => handleAppVisibilityChange(appName, !isVisible)}
                                onKeyDown={e => { if (e.key === "Enter") handleAppVisibilityChange(appName, !isVisible); }}
                                tabIndex={0}
                            >
                                {/* Viñeta */}
                                <span
                                    style={{
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        background: isVisible ? bulletColorsMap[appName] : '#d1d5db', // gris si no visible
                                        border: '1px solid #bdbdbd',
                                        flexShrink: 0
                                    }}
                                />
                                {/* Nombre de la app */}
                                <span
                                    style={{
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        color: isVisible ? '#222' : '#9e9e9e',
                                        textDecoration: !isVisible ? 'line-through' : 'none',
                                        transition: 'color 0.2s, text-decoration 0.2s',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {appName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Sidebar>
    );
};

export default ApplicationSideBar;