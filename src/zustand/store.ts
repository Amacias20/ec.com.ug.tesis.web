import { persist } from 'zustand/middleware';
import { create } from 'zustand';

interface Company {
    idCompany: number;
    companyTradeName: string;
    companyLegalName: string;
    status?: string;
}

interface CompanyState {
    currentCompany: Company | null;
    setCurrentCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>()(
    persist(
        (set) => ({
            currentCompany: null,
            setCurrentCompany: (company) => set({ currentCompany: company }),
        }),
        {
            name: 'selected-company',
        }
    )
);
