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
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex flex-column gap-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="relative border-round-3xl overflow-hidden shadow-4" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)', color: 'white', padding: '3rem 2rem' }}>
        <div className="absolute opacity-20" style={{ right: '-2%', top: '-20%', transform: 'rotate(15deg)' }}>
          <i className="pi pi-bolt" style={{ fontSize: '15rem' }}></i>
        </div>
        <div className="relative z-1 flex align-items-center gap-4">
          <div className="bg-white-alpha-20 backdrop-blur border-circle p-4 flex align-items-center justify-content-center shadow-2 border-1 border-white-alpha-30">
            <i className="pi pi-eye text-5xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold m-0 mb-2">{t('explainability:title')}</h1>
            <p className="m-0 text-xl text-blue-50 font-medium">{t('explainability:subtitle')}</p>
          </div>
        </div>
      </div>
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