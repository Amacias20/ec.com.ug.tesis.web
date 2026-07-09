import { getDashboardSummary, getDiseaseDistribution, getPredictionsTimeline, getDiseaseByGender, getBiomarkersFrequency, DashboardSummary } from 'services/dashboardApi';
import { DashboardCard } from 'components/Panel/DashboardCard';
import { DashboardTile } from 'components/Panel/DashboardTile';
import { ProgressSpinner } from 'primereact/progressspinner';
import HighchartsReact from 'highcharts-react-official';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { useTranslation } from 'react-i18next';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import moment from 'moment';

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { getAbbr } = useDiseaseLabel();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [distribution, setDistribution] = useState<Record<string, number> | null>(null);
  const [genderDistribution, setGenderDistribution] = useState<Record<string, { Femenino: number; Masculino: number }> | null>(null);
  const [timeline, setTimeline] = useState<{ date: string; count: number }[] | null>(null);
  const [biomarkers, setBiomarkers] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, distributionData, timelineData, genderData, biomarkersData] = await Promise.all([
          getDashboardSummary(),
          getDiseaseDistribution(),
          getPredictionsTimeline(),
          getDiseaseByGender(),
          getBiomarkersFrequency(),
        ]);
        setSummary(summaryData);
        setDistribution(distributionData);
        setTimeline(timelineData);
        setGenderDistribution(genderData);
        setBiomarkers(biomarkersData);
      } catch {
        setError(t('dashboard:loadError'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  if (loading) {
    return (
      <div className="flex flex-column justify-content-center align-items-center w-full" style={{ minHeight: '60vh' }}>
        <ProgressSpinner className="mb-4" style={{ width: '60px', height: '60px' }} strokeWidth="4" animationDuration=".5s" />
        <h3 className="text-700 font-medium m-0 text-xl">{t('common:loading')}</h3>
      </div>
    );
  }

  if (error || !summary || !distribution || !timeline || !genderDistribution || !biomarkers) {
    return <Message severity="warn" className="m-4" text={error || t('common:noData')} />;
  }

  const distributionOptions: Highcharts.Options = {
    chart: { type: 'column', height: 320 },
    title: { text: t('dashboard:chartDistributionTitle') },
    xAxis: { categories: Object.keys(distribution).map(getAbbr) },
    yAxis: { title: { text: t('dashboard:chartDistributionYAxis') } },
    series: [{ type: 'column', name: t('dashboard:chartDistributionSeries'), data: Object.values(distribution) }],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  const genderOptions: Highcharts.Options = {
    chart: { type: 'column', height: 320 },
    title: { text: t('dashboard:chartGenderTitle') },
    xAxis: { categories: Object.keys(genderDistribution).map(getAbbr) },
    yAxis: { title: { text: t('dashboard:chartGenderYAxis') } },
    plotOptions: {
      column: {
        stacking: 'normal',
      }
    },
    series: [
      { type: 'column', name: t('dashboard:genderFemale'), data: Object.values(genderDistribution).map(v => v.Femenino), color: '#d946ef' }, // Pink
      { type: 'column', name: t('dashboard:genderMale'), data: Object.values(genderDistribution).map(v => v.Masculino), color: '#0ea5e9' } // Blue
    ],
    credits: { enabled: false },
  };


  const timelineOptions: Highcharts.Options = {
    chart: { type: 'spline', height: 320 },
    title: { text: t('dashboard:chartTimelineTitle') },
    xAxis: { categories: timeline.map((point) => moment(point.date).format('DD MMM')) },
    yAxis: { title: { text: t('dashboard:chartTimelineYAxis') }, allowDecimals: false },
    series: [{ type: 'spline', name: t('dashboard:chartTimelineSeries'), data: timeline.map((point) => point.count) }],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  const overlapOptions: Highcharts.Options = {
    chart: { type: 'pie', height: 320 },
    title: { text: t('dashboard:chartOverlapTitle') },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: { enabled: true, format: '<b>{point.name}</b>: {point.y}' }
      }
    },
    series: [{
      type: 'pie',
      name: t('dashboard:chartOverlapSeries'),
      data: [
        { name: t('dashboard:overlapYes'), y: summary.overlap_syndrome_count, color: '#f97316' },
        { name: t('dashboard:overlapNo'), y: summary.total_predictions - summary.overlap_syndrome_count, color: '#14b8a6' }
      ]
    }],
    credits: { enabled: false }
  };

  const biomarkersOptions: Highcharts.Options = {
    chart: { type: 'bar', height: 320 },
    title: { text: t('dashboard:chartBiomarkersTitle') },
    xAxis: { categories: Object.keys(biomarkers) },
    yAxis: { title: { text: t('dashboard:chartBiomarkersYAxis') }, allowDecimals: false },
    series: [{ type: 'bar', name: t('dashboard:chartBiomarkersSeries'), data: Object.values(biomarkers), color: '#8b5cf6' }],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex flex-column gap-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="relative border-round-3xl overflow-hidden shadow-4" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)', color: 'white', padding: '3rem 2rem' }}>
        <div className="absolute opacity-20" style={{ right: '-2%', top: '-20%', transform: 'rotate(15deg)' }}>
          <i className="pi pi-chart-line" style={{ fontSize: '15rem' }}></i>
        </div>
        <div className="relative z-1 flex align-items-center gap-4">
          <div className="bg-white-alpha-20 backdrop-blur border-circle p-4 flex align-items-center justify-content-center shadow-2 border-1 border-white-alpha-30">
            <i className="pi pi-chart-bar text-5xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold m-0 mb-2">{t('dashboard:title')}</h1>
            <p className="m-0 text-xl text-teal-50 font-medium">{t('dashboard:subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <DashboardTile
          title={t('dashboard:tileTotalPredictions')}
          value={summary.total_predictions}
          icon="pi-database"
          backgroundColor="#ecfeff"
          color="#0e7490"
        />
        <DashboardTile
          title={t('dashboard:tileOverlapCount')}
          value={summary.overlap_syndrome_count}
          icon="pi-exclamation-triangle"
          backgroundColor="#fff7ed"
          color="#c2410c"
        />
        <DashboardTile
          title={t('dashboard:tileModelUsed')}
          value={summary.model_used}
          icon="pi-microchip"
          backgroundColor="#eef2ff"
          color="#4338ca"
        />
        <DashboardTile
          title={t('dashboard:tileThreshold')}
          value={summary.threshold_used}
          icon="pi-sliders-h"
          backgroundColor="#f0fdf4"
          color="#15803d"
        />
      </div>

      <div className="grid">
        <div className="col-12 lg:col-4">
          <DashboardCard>
            <HighchartsReact highcharts={Highcharts} options={overlapOptions} />
          </DashboardCard>
        </div>
        <div className="col-12 lg:col-4">
          <DashboardCard>
            <HighchartsReact highcharts={Highcharts} options={biomarkersOptions} />
          </DashboardCard>
        </div>
        <div className="col-12 lg:col-4">
          <DashboardCard>
            <HighchartsReact highcharts={Highcharts} options={distributionOptions} />
          </DashboardCard>
        </div>
        <div className="col-12 lg:col-6">
          <DashboardCard>
            <HighchartsReact highcharts={Highcharts} options={genderOptions} />
          </DashboardCard>
        </div>
        <div className="col-12 lg:col-6">
          <DashboardCard>
            <HighchartsReact highcharts={Highcharts} options={timelineOptions} />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
