import { getModelInfo, ModelInfoResponse, getFeatureImportance } from 'services/diagnosisApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { updateThresholds } from 'services/diagnosisApi';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

const ModelInfo = () => {
  const { t } = useTranslation(['modelInfo', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();
  const [info, setInfo] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localThresholds, setLocalThresholds] = useState<Record<string, number>>({});
  const [featureImp, setFeatureImp] = useState<Record<string, Record<string, number>> | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    Promise.all([getModelInfo(), getFeatureImportance()])
      .then(([infoData, impData]) => {
        setInfo(infoData);
        setFeatureImp(impData);
        const initial: Record<string, number> = {};
        infoData.label_names.forEach((name, i) => {
          initial[name] = infoData.thresholds[i];
        });
        setLocalThresholds(initial);
      })
      .catch(() => setError(t('modelInfo:loadError')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return (
      <div className="flex flex-column justify-content-center align-items-center w-full" style={{ minHeight: '60vh' }}>
        <ProgressSpinner className="mb-4" style={{ width: '60px', height: '60px' }} strokeWidth="4" animationDuration=".5s" />
        <h3 className="text-700 font-medium m-0 text-xl">{t('common:loading')}</h3>
        <p className="text-500 mt-2">{t('modelInfo:pleaseWait')}</p>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="surface-card p-5 shadow-2 border-round-2xl text-center flex flex-column align-items-center" style={{ maxWidth: '500px' }}>
          <div className="bg-red-50 text-red-500 border-circle p-4 mb-4 flex align-items-center justify-content-center">
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
          </div>
          <h2 className="text-900 font-bold text-2xl mb-2">{t('modelInfo:loadError')}</h2>
          <p className="text-600 line-height-3 m-0 mb-4">
            {error || t('common:noData')}
          </p>
          <div className="flex gap-3">
            <button className="p-button p-component p-button-outlined p-button-secondary border-round-xl" onClick={() => window.location.reload()}>
              <span className="p-button-icon p-c p-button-icon-left pi pi-refresh"></span>
              <span className="p-button-label p-c">{t('modelInfo:retry')}</span>
            </button>
            <button className="p-button p-component p-button-primary border-round-xl" onClick={() => window.history.back()}>
              <span className="p-button-icon p-c p-button-icon-left pi pi-arrow-left"></span>
              <span className="p-button-label p-c">{t('modelInfo:back')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveThresholds = async () => {
    try {
      setSaving(true);
      await updateThresholds(localThresholds);
      toast.current?.show({ severity: 'success', summary: t('modelInfo:saveSuccess'), detail: t('modelInfo:saveSuccessDetail'), life: 3000 });
      setInfo(prev => {
        if (!prev) return prev;
        const newThresholds = prev.label_names.map(name => localThresholds[name]);
        return { ...prev, thresholds: newThresholds };
      });
    } catch (e) {
      toast.current?.show({ severity: 'error', summary: t('modelInfo:saveError'), detail: t('modelInfo:saveErrorDetail'), life: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleResetThresholds = () => {
    if (!info) return;
    const defaults: Record<string, number> = {};
    info.label_names.forEach((name) => {
      defaults[name] = 0.5;
    });
    setLocalThresholds(defaults);
    toast.current?.show({ severity: 'info', summary: t('modelInfo:resetSuccess'), detail: t('modelInfo:resetSuccessDetail'), life: 3000 });
  };

  const thresholdRows = info.label_names.map((name, i) => ({
    disease: getName(name),
    rawName: name,
    abbr: getAbbr(name),
    threshold: localThresholds[name] ?? info.thresholds[i],
  }));

  const metrics = info.metrics?.global;
  const perLabelMetrics = info.metrics?.per_label;

  const perLabelRows = perLabelMetrics ? Object.keys(perLabelMetrics).map(name => ({
    disease: getName(name),
    abbr: getAbbr(name),
    precision: perLabelMetrics[name].precision,
    recall: perLabelMetrics[name].recall,
    f1: perLabelMetrics[name].f1,
    support: perLabelMetrics[name].support
  })) : [];

  // Calculate average feature importance across all diseases if available
  let featureImpOptions: Highcharts.Options | null = null;
  if (featureImp && Object.keys(featureImp).length > 0) {
    const avgImp: Record<string, number> = {};
    const numDiseases = Object.keys(featureImp).length;
    
    Object.values(featureImp).forEach(diseaseImp => {
      Object.entries(diseaseImp).forEach(([feat, val]) => {
        if (!avgImp[feat]) avgImp[feat] = 0;
        avgImp[feat] += val;
      });
    });
    
    const sortedFeatures = Object.keys(avgImp)
      .map(k => ({ name: k, val: avgImp[k] / numDiseases }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 10); // top 10

    featureImpOptions = {
      chart: { type: 'bar', height: 350 },
      title: { text: t('modelInfo:top10Features') },
      xAxis: { categories: sortedFeatures.map(f => f.name) },
      yAxis: { title: { text: t('modelInfo:averageImportance') } },
      series: [{ type: 'bar', name: t('modelInfo:importance'), data: sortedFeatures.map(f => f.val), color: '#3b82f6' }],
      credits: { enabled: false },
      legend: { enabled: false }
    };
  }

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex flex-column gap-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="relative border-round-3xl overflow-hidden shadow-4" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '3rem 2rem 5rem 2rem' }}>
        <div className="absolute opacity-20" style={{ right: '-5%', top: '-20%', transform: 'rotate(15deg)' }}>
          <i className="pi pi-database" style={{ fontSize: '15rem' }}></i>
        </div>
        <div className="relative z-1 flex align-items-center gap-4">
          <div className="bg-white-alpha-20 backdrop-blur border-circle p-4 flex align-items-center justify-content-center shadow-2 border-1 border-white-alpha-30">
            <i className="pi pi-server text-5xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold m-0 mb-2">{t('modelInfo:title')}</h1>
            <p className="m-0 text-xl text-indigo-100 font-medium">{info.model_name} • {t('modelInfo:architecture')}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-nogutter gap-4 px-3" style={{ marginTop: '-4rem', position: 'relative', zIndex: 2 }}>
        <div className="col-12 md:col flex">
          <Card className="w-full border-none shadow-4 border-round-2xl hover:-translate-y-1 transition-all transition-duration-300">
            <div className="flex align-items-center justify-content-between mb-3">
              <span className="text-600 font-semibold text-sm text-uppercase tracking-wide">{t('modelInfo:architecture')}</span>
              <span className="bg-blue-100 text-blue-600 p-2 border-round-lg"><i className="pi pi-box"></i></span>
            </div>
            <div className="text-3xl font-bold text-900">{info.model_name}</div>
          </Card>
        </div>
        <div className="col-12 md:col flex">
          <Card className="w-full border-none shadow-4 border-round-2xl hover:-translate-y-1 transition-all transition-duration-300">
            <div className="flex align-items-center justify-content-between mb-3">
              <span className="text-600 font-semibold text-sm text-uppercase tracking-wide">{t('modelInfo:inputFeatures')}</span>
              <span className="bg-green-100 text-green-600 p-2 border-round-lg"><i className="pi pi-sign-in"></i></span>
            </div>
            <div className="text-3xl font-bold text-900">{info.input_dim}</div>
          </Card>
        </div>
        <div className="col-12 md:col flex">
          <Card className="w-full border-none shadow-4 border-round-2xl hover:-translate-y-1 transition-all transition-duration-300">
            <div className="flex align-items-center justify-content-between mb-3">
              <span className="text-600 font-semibold text-sm text-uppercase tracking-wide">{t('modelInfo:labels')}</span>
              <span className="bg-orange-100 text-orange-600 p-2 border-round-lg"><i className="pi pi-tags"></i></span>
            </div>
            <div className="text-3xl font-bold text-900">{info.n_labels}</div>
          </Card>
        </div>
        <div className="col-12 md:col flex">
          <Card className="w-full border-none shadow-4 border-round-2xl hover:-translate-y-1 transition-all transition-duration-300">
            <div className="flex align-items-center justify-content-between mb-3">
              <span className="text-600 font-semibold text-sm text-uppercase tracking-wide">{t('modelInfo:featureNames')}</span>
              <span className="bg-red-100 text-red-600 p-2 border-round-lg"><i className="pi pi-list"></i></span>
            </div>
            <div className="text-3xl font-bold text-900">{info.feature_names.length}</div>
          </Card>
        </div>
      </div>
      <div className="grid">
        <div className="col-12 xl:col-7">
          <Card className="shadow-2 border-none border-round-2xl h-full border-1 surface-border">
            <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
              <h3 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                <div className="bg-indigo-100 text-indigo-600 p-2 border-round-md"><i className="pi pi-sliders-h"></i></div>
                {t('modelInfo:thresholdsTitle')}
              </h3>
              <div className="flex gap-2">
                <Button 
                  label={t('modelInfo:resetDefault')} 
                  icon="pi pi-undo" 
                  severity="secondary"
                  outlined
                  onClick={handleResetThresholds} 
                  disabled={saving}
                />
                <Button 
                  label={saving ? t('modelInfo:saving') : t('modelInfo:saveChanges')} 
                  icon={saving ? "pi pi-spin pi-spinner" : "pi pi-save"} 
                  severity="success" 
                  onClick={handleSaveThresholds} 
                  disabled={saving}
                />
              </div>
            </div>
            <Toast ref={toast} />
            <DataTable value={thresholdRows} stripedRows size="large" responsiveLayout="scroll" className="p-datatable-lg border-none">
              <Column field="abbr" header={t('modelInfo:colCode')} headerClassName="text-500 font-semibold bg-transparent border-bottom-1 surface-border" bodyClassName="font-bold text-indigo-600 text-lg" />
              <Column field="disease" header={t('modelInfo:colDisease')} headerClassName="text-500 font-semibold bg-transparent border-bottom-1 surface-border" bodyClassName="text-700 font-medium" />
              <Column field="threshold" header={t('modelInfo:colThreshold')} headerClassName="text-500 font-semibold bg-transparent border-bottom-1 surface-border" body={(r) => (
                <div className="flex flex-column gap-2 w-full pr-4">
                  <div className="flex justify-content-between align-items-center w-full">
                    <span className="text-800 font-bold">{r.threshold.toFixed(4)}</span>
                  </div>
                  <Slider 
                    value={r.threshold * 100} 
                    onChange={(e) => setLocalThresholds(prev => ({ ...prev, [r.rawName]: (e.value as number) / 100 }))} 
                    className="w-full mt-2" 
                  />
                </div>
              )} />
            </DataTable>
          </Card>
        </div>
        <div className="col-12 xl:col-5 flex flex-column gap-4">
          {metrics && (
            <Card className="shadow-2 border-none border-round-2xl border-1 surface-border">
              <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
                <h3 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                  <div className="bg-teal-100 text-teal-600 p-2 border-round-md"><i className="pi pi-chart-pie"></i></div>
                  {t('modelInfo:testMetrics')}
                </h3>
              </div>
              <div className="grid">
                {Object.entries(metrics).map(([key, val]) => {
                  const numVal = typeof val === 'number' ? val : parseFloat(val);
                  const isPercentage = numVal <= 1.0;
                  const displayVal = typeof val === 'number' ? val.toFixed(4) : String(val);
                  return (
                    <div key={key} className="col-6">
                      <div className="p-3 surface-50 border-round-xl hover:surface-100 transition-colors border-1 surface-border h-full flex flex-column justify-content-center">
                        <div className="text-xs text-500 font-bold mb-2 text-uppercase tracking-wide">{key}</div>
                        <div className="text-2xl font-black text-900 mb-2">{displayVal}</div>
                        {isPercentage && (
                          <div className="w-full surface-300 border-round h-1rem mt-auto overflow-hidden">
                            <div className="bg-teal-500 h-full border-round" style={{ width: `${numVal * 100}%` }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
          <Card className="shadow-2 border-none border-round-2xl flex-1 border-1 surface-border">
            <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
              <h3 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                <div className="bg-pink-100 text-pink-600 p-2 border-round-md"><i className="pi pi-sitemap"></i></div>
                {t('modelInfo:modelFeatures')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 max-h-15rem overflow-y-auto pr-2 custom-scrollbar">
              {info.feature_names.map((f) => (
                <span key={f} className="px-3 py-2 bg-white text-700 border-round-3xl text-sm font-semibold shadow-1 border-1 surface-border hover:border-pink-300 hover:text-pink-600 transition-colors cursor-default">
                  {f}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="grid">
        <div className="col-12 lg:col-6">
          <Card className="shadow-2 border-none border-round-2xl h-full border-1 surface-border">
            <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
              <h3 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                <div className="bg-blue-100 text-blue-600 p-2 border-round-md"><i className="pi pi-chart-bar"></i></div>
                {t('modelInfo:globalFeatureImportance')}
              </h3>
            </div>
            {featureImpOptions ? (
              <HighchartsReact highcharts={Highcharts} options={featureImpOptions} />
            ) : (
              <div className="text-center p-5 text-500">{t('modelInfo:noImportanceData')}</div>
            )}
          </Card>
        </div>
        <div className="col-12 lg:col-6">
          <Card className="shadow-2 border-none border-round-2xl h-full border-1 surface-border">
            <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
              <h3 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                <div className="bg-purple-100 text-purple-600 p-2 border-round-md"><i className="pi pi-table"></i></div>
                {t('modelInfo:metricsPerDisease')}
              </h3>
            </div>
            {perLabelRows.length > 0 ? (
              <DataTable value={perLabelRows} stripedRows size="small" responsiveLayout="scroll" className="p-datatable-sm border-none">
                <Column field="abbr" header={t('modelInfo:colDisease')} headerClassName="text-500 font-semibold bg-transparent" bodyClassName="font-bold text-700" />
                <Column field="precision" header={t('modelInfo:precision')} headerClassName="text-500 font-semibold bg-transparent" body={(r) => (r.precision * 100).toFixed(1) + '%'} />
                <Column field="recall" header={t('modelInfo:recall')} headerClassName="text-500 font-semibold bg-transparent" body={(r) => (r.recall * 100).toFixed(1) + '%'} />
                <Column field="f1" header={t('modelInfo:f1Score')} headerClassName="text-500 font-semibold bg-transparent" body={(r) => (r.f1 * 100).toFixed(1) + '%'} />
              </DataTable>
            ) : (
              <div className="text-center p-5 text-500">{t('modelInfo:noDetailedMetrics')}</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;