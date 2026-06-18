import { useTranslation } from 'react-i18next';
import { DISEASE_I18N_KEYS } from 'constants/diseases';

export function useDiseaseLabel() {
  const { t } = useTranslation('diseases');

  const getAbbr = (apiName: string) => {
    const key = DISEASE_I18N_KEYS[apiName];
    return key ? t(`${key}.abbr`) : apiName.slice(0, 3).toUpperCase();
  };

  const getName = (apiName: string) => {
    const key = DISEASE_I18N_KEYS[apiName];
    return key ? t(`${key}.name`) : apiName;
  };

  const getFull = (apiName: string) => `${getAbbr(apiName)} — ${getName(apiName)}`;

  return { getAbbr, getName, getFull };
}
