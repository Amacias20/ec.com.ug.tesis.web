import type { MenuModel } from 'types/layout';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
  const { t } = useTranslation('menu');

  const model: MenuModel[] = useMemo(
    () => [
      {
        label: t('sectionMain'),
        icon: 'pi pi-home',
        items: [
          { label: t('home'), icon: 'pi pi-home', to: '/' },
          { label: t('dashboard'), icon: 'pi pi-chart-line', to: '/dashboard' },
          { label: t('diagnosis'), icon: 'pi pi-user-edit', to: '/diagnosis' },
          { label: t('modelInfo'), icon: 'pi pi-info-circle', to: '/model-info' },
          { label: t('explainability'), icon: 'pi pi-chart-bar', to: '/explainability' },
          { label: t('glossary'), icon: 'pi pi-book', to: '/glossary' },
        ],
      },
    ],
    [t]
  );

  return <AppSubMenu model={model} />;
};

export default AppMenu;
