import { Accordion, AccordionTab } from 'primereact/accordion';
import { getFeatureImportance } from 'services/diagnosisApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import HighchartsReact from 'highcharts-react-official';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { useTranslation } from 'react-i18next';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import Highcharts from 'highcharts';

const Explainability = () => {
  const { t, i18n } = useTranslation(['explainability', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();
  const [data, setData] = useState<Record<string, Record<string, number>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getFeatureImportance()
      .then(setData)
      .catch(() => setError(t('explainability:loadError')))
      .finally(() => setLoading(false));
  }, [t, i18n.language]);

  if (loading) {
    return (
      <div className="flex justify-content-center p-6">
        <ProgressSpinner />
      </div>
    );
  }

  if (error || !data) {
    return <Message severity="warn" className="m-4" text={error || t('common:noData')} />;
  }

  const buildChartOptions = (disease: string, features: Record<string, number>): Highcharts.Options => {
    const sorted = Object.entries(features)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 12);
    const abbr = getAbbr(disease);
    return {
      chart: { type: 'bar', height: 320 },
      title: { text: t('explainability:chartTitle', { abbr }) },
      xAxis: { categories: sorted.map(([f]) => f), title: { text: null } },
      yAxis: { title: { text: t('explainability:chartYAxis') } },
      series: [{ type: 'bar', name: 'SHAP', data: sorted.map(([, v]) => v) }],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-1">{t('explainability:title')}</h1>
      <p className="text-color-secondary mb-4">{t('explainability:subtitle')}</p>

      <Accordion multiple activeIndex={[0]}>
        {Object.entries(data).map(([disease, features]) => (
          <AccordionTab key={disease} header={`${getAbbr(disease)} — ${getName(disease)}`}>
            <Card className="border-none shadow-none">
              <HighchartsReact highcharts={Highcharts} options={buildChartOptions(disease, features)} />
            </Card>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default Explainability;
