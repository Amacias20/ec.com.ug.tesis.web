import { getModelInfo, healthCheck, ModelInfoResponse } from 'services/diagnosisApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

const Home = () => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const { getFull } = useDiseaseLabel();
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const online = await healthCheck();
        setApiOnline(online);
        if (online) setModelInfo(await getModelInfo());
      } catch {
        setApiOnline(false);
        setError(t('backendOffline'));
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
        <h3 className="text-700 font-medium m-0 text-xl">{t('common:loading') || 'Conectando con el servidor...'}</h3>
        <p className="text-500 mt-2">Verificando estado del modelo</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-6 bg-primary border-round-2xl p-5 shadow-4 flex flex-column md:flex-row align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold m-0 text-white mb-2">{t('title')}</h1>
          <p className="text-blue-100 mt-0 mb-0 text-lg">{t('subtitle')}</p>
        </div>
        <div className="hidden md:block">
          <i className="pi pi-heart-fill text-white opacity-40" style={{ fontSize: '6rem' }}></i>
        </div>
      </div>
      {apiOnline === false && <Message severity="warn" className="mb-5 w-full shadow-2 border-round-xl" text={error || t('backendUnavailable')} />}
      {apiOnline && <Message severity="success" className="mb-5 w-full shadow-2 border-round-xl" text={t('apiConnected')} />}
      <div className="grid grid-nogutter gap-4 mb-5">
        <div className="col-12 lg:col flex">
          <Card className="w-full border-round-xl shadow-2 hover:shadow-6 transition-all transition-duration-300 border-none">
            <div className="flex align-items-center justify-content-between mb-4">
              <h2 className="m-0 text-2xl font-semibold text-800">{t('cardEvaluationTitle')}</h2>
              <div className="flex align-items-center justify-content-center bg-blue-100 border-circle p-3 text-blue-600">
                <i className="pi pi-user-edit text-2xl"></i>
              </div>
            </div>
            <p className="text-600 line-height-3 text-lg mb-4">{t('cardEvaluationDesc')}</p>
            <Button label={t('goToDiagnosis')} icon="pi pi-arrow-right" iconPos="right" className="p-button-rounded p-button-primary w-full p-3 font-bold" onClick={() => navigate('/diagnosis')} />
          </Card>
        </div>
        <div className="col-12 lg:col flex">
          <Card className="w-full border-round-xl shadow-2 hover:shadow-6 transition-all transition-duration-300 border-none">
            <div className="flex align-items-center justify-content-between mb-4">
              <h2 className="m-0 text-2xl font-semibold text-800">{t('cardModelTitle')}</h2>
              <div className="flex align-items-center justify-content-center bg-purple-100 border-circle p-3 text-purple-600">
                <i className="pi pi-database text-2xl"></i>
              </div>
            </div>
            {modelInfo ? (
              <div className="flex flex-column gap-3 mb-4">
                <div className="flex justify-content-between border-bottom-1 surface-border pb-2">
                  <span className="text-600 font-medium">{t('architecture')}</span>
                  <span className="font-bold text-800">{modelInfo.model_name}</span>
                </div>
                <div className="flex justify-content-between border-bottom-1 surface-border pb-2">
                  <span className="text-600 font-medium">{t('inputs')}</span>
                  <span className="font-bold text-800">{modelInfo.input_dim} {t('features')}</span>
                </div>
                <div className="flex justify-content-between pb-2">
                  <span className="text-600 font-medium">{t('outputs')}</span>
                  <span className="font-bold text-800">{modelInfo.n_labels} {t('diseasesCount')}</span>
                </div>
                <Button label={t('viewDetails')} icon="pi pi-info-circle" className="p-button-rounded p-button-outlined p-button-secondary w-full p-3 font-bold mt-2" onClick={() => navigate('/model-info')} />
              </div>
            ) : (
              <p className="text-500 font-italic mt-4">{t('modelUnavailable')}</p>
            )}
          </Card>
        </div>
        <div className="col-12 lg:col flex">
          <Card className="w-full border-round-xl shadow-2 hover:shadow-6 transition-all transition-duration-300 border-none">
            <div className="flex align-items-center justify-content-between mb-4">
              <h2 className="m-0 text-2xl font-semibold text-800">{t('cardExplainTitle')}</h2>
              <div className="flex align-items-center justify-content-center bg-orange-100 border-circle p-3 text-orange-600">
                <i className="pi pi-chart-line text-2xl"></i>
              </div>
            </div>
            <p className="text-600 line-height-3 text-lg mb-4">{t('cardExplainDesc')}</p>
            <Button label={t('viewImportance')} icon="pi pi-chart-bar" className="p-button-rounded p-button-warning w-full p-3 font-bold" onClick={() => navigate('/explainability')} />
          </Card>
        </div>
      </div>
      {modelInfo && (
        <Card className="border-round-xl shadow-2 border-none">
          <h3 className="m-0 mb-4 text-xl font-semibold text-700 border-bottom-1 surface-border pb-3"><i className="pi pi-tags mr-2 text-primary"></i>{t('evaluatedDiseases')}</h3>
          <div className="flex flex-wrap gap-3">
            {modelInfo.label_names.map((label) => (
              <Tag key={label} value={getFull(label)} className="px-3 py-2 text-sm font-semibold shadow-1" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;