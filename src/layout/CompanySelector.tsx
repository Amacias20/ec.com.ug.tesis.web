import { GetUserCompany } from 'services/security/endpoints/UserCompanyService';
import { ErrorHandler, GetMenu, GetUser } from 'constants/Global';
import React, { useRef, useState, useEffect } from 'react';
import { ToastError } from 'components/Messages/Toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { useCompanyStore } from 'zustand/store';
import { useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { UserCompanyListResponse } from 'services/security/interfaces/UserCompanyInterface';

interface Company {
    idCompany: number;
    companyTradeName: string;
    companyLegalName: string;
    status?: string;
}

const CompanySelector: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [search, setSearch] = useState('');
    const currentCompany = useCompanyStore((state) => state.currentCompany);
    const setCurrentCompany = useCompanyStore((state) => state.setCurrentCompany);
    const [showCompanySelector, setShowCompanySelector] = useState(false);
    const companyOverlayRef = useRef<OverlayPanel>(null);
    const location = useLocation();
    const user = GetUser();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response:UserCompanyListResponse = await GetUserCompany({ userId: user.idUser, status: 'ACTIVO', includeCompany: true });
                console.log( 'UserCompanyListResponse',response)
                const activeCompanies = response.data
                    .map((item: any) => ({
                        ...item,
                        idCompany: item.companyId
                    }))
                    .sort((a: Company, b: Company) => a.companyTradeName.localeCompare(b.companyTradeName, 'es', { sensitivity: 'base' }));
                setCompanies(activeCompanies);
                if (activeCompanies.length > 0) {
                    if (!currentCompany) {
                        setCurrentCompany(activeCompanies[0]);
                    }
                } else {
                    setCurrentCompany(null);
                }
            } catch (error) {
                ToastError(await ErrorHandler(error));
            }
        };

        const checkMenuLayout = () => {
            const menuStr = GetMenu();
            if (!menuStr) return false;
            try {
                const menu = JSON.parse(menuStr);
                const currentRoute = location.pathname;
                const flattenedMenu = menu[0];
                for (const module of flattenedMenu) {
                    const menuItems = module.menuUserItem?.children || [];
                    const matchedItem = menuItems.find((item: any) => item.url === currentRoute || (currentRoute === '/' && item.url === '/'));
                    if (matchedItem) {
                        return matchedItem.layout === 'MULTI_TENANCY';
                    }
                }
                return false;
            } catch {
                return false;
            }
        };

        setShowCompanySelector(checkMenuLayout());
        fetchCompanies();
        // eslint-disable-next-line
    }, [location.pathname]);

    const selectCompany = (company: Company) => {
        setCurrentCompany(company);
        companyOverlayRef.current?.hide();
        setSearch('');
    };

    // Filtrado por búsqueda
    const filteredCompanies = companies.filter((c) => c.companyTradeName.toLowerCase().includes(search.toLowerCase()));

    if (!showCompanySelector) return null;

    return (
        <li className="flex align-items-center">
            <Button className="p-button-text p-button-rounded flex align-items-center" onClick={(e) => companyOverlayRef.current?.toggle(e)} style={{ fontWeight: 'bold', color: 'white', height: '3rem' }}>
                <i className="pi pi-building mr-2"></i>
                {currentCompany?.companyTradeName || 'Seleccionar Empresa'}
                <i className="pi pi-chevron-down ml-2"></i>
            </Button>
            <OverlayPanel ref={companyOverlayRef} style={{ width: '270px', padding: 0 }}>
                <div style={{ padding: 0 }}>
                    {/* Barra de búsqueda solo si hay más de 5 empresas */}
                    {companies.length > 5 && (
                        <div className="p-2">
                            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa..." className="w-full" autoFocus />
                        </div>
                    )}
                    <div
                        style={{
                            maxHeight: '270px',
                            overflowY: 'auto',
                            padding: companies.length > 5 ? '0 0.5rem 0.5rem 0.5rem' : '0.5rem'
                        }}
                    >
                        {filteredCompanies.length === 0 && <div className="p-2 text-center text-500">No hay resultados</div>}
                        {filteredCompanies.map((company) => (
                            <div
                                key={company.idCompany}
                                className={`p-2 cursor-pointer hover:surface-200 border-round flex align-items-center transition-colors transition-duration-150 ${currentCompany?.idCompany === company.idCompany ? 'bg-primary-100' : ''}`}
                                onClick={() => selectCompany(company)}
                            >
                                {' '}
                                <div className="flex flex-column">
                                    <span className="font-bold">{company.companyTradeName}</span>
                                    <small className="text-color-secondary">{company.companyLegalName}</small>
                                </div>
                                {currentCompany?.idCompany === company.idCompany && <i className="pi pi-check ml-auto text-primary"></i>}
                            </div>
                        ))}
                    </div>
                </div>
            </OverlayPanel>
        </li>
    );
};

export default CompanySelector;