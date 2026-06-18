import { predict, predictWithExplanation, PatientInput, PredictionResponse, ExplainabilityResponse } from 'services/diagnosisApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useMemo, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

const initialForm: PatientInput = {
  age: 45,
  gender: 'Female',
  esr: null,
  crp: null,
  rf: null,
  anti_ccp: null,
  hla_b27: null,
  ana: null,
  anti_ro: null,
  anti_la: null,
  anti_dsdna: null,
  anti_sm: null,
  c3: null,
  c4: null,
};

const Diagnosis = () => {
  const { t } = useTranslation(['diagnosis', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();
  const [form, setForm] = useState<PatientInput>(initialForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [explanation, setExplanation] = useState<ExplainabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genderOptions = useMemo(
    () => [
      { label: t('common:male'), value: 'Male' },
      { label: t('common:female'), value: 'Female' },
    ],
    [t]
  );

  const binaryOptions = useMemo(
    () => [
      { label: t('common:positive'), value: 'Positive' },
      { label: t('common:negative'), value: 'Negative' },
    ],
    [t]
  );

  const update = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (): PatientInput => {
    const payload: PatientInput = { age: form.age, gender: form.gender };
    const optionalKeys: (keyof PatientInput)[] = [
      'esr', 'crp', 'rf', 'anti_ccp', 'hla_b27', 'ana', 'anti_ro', 'anti_la', 'anti_dsdna', 'anti_sm', 'c3', 'c4',
    ];
    optionalKeys.forEach((key) => {
      const val = form[key];
      if (val !== null && val !== undefined && (val as any) !== '') {
        (payload as any)[key] = val;
      }
    });
    return payload;
  };

  const handlePredict = async (withExplanation = false) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setExplanation(null);
    try {
      const payload = buildPayload();
      if (withExplanation) {
        const data = await predictWithExplanation(payload);
        setResult(data.prediction);
        setExplanation(data.explanation);
      } else {
        setResult(await predict(payload));
      }
    } catch (e: unknown) {
      setError(axiosMessage(e, t('common:apiError')));
    } finally {
      setLoading(false);
    }
  };

  const probabilityBody = (row: { probability: number }) => (
    <div className="flex align-items-center gap-3">
      <ProgressBar value={Math.round(row.probability * 100)} showValue={false} style={{ height: '10px', flex: 1, borderRadius: '10px' }} className="border-round-xl overflow-hidden shadow-1" color={row.probability > 0.5 ? 'var(--red-500)' : 'var(--teal-500)'} />
      <span className="text-sm font-bold w-3rem text-right text-700">{(row.probability * 100).toFixed(1)}%</span>
    </div>
  );

  const statusBody = (row: { is_positive: boolean }) => (
    <Tag
      value={row.is_positive ? t('common:positive') : t('common:negative')}
      severity={row.is_positive ? 'danger' : 'success'}
      className="text-xs px-3 py-2 font-bold border-round-2xl shadow-1 uppercase tracking-wide"
    />
  );

  const diseaseBody = (row: { disease: string }) => (
    <span>
      <strong>{getAbbr(row.disease)}</strong> — {getName(row.disease)}
    </span>
  );

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex flex-column gap-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Premium Hero Section */}
      <div className="relative border-round-3xl overflow-hidden shadow-4" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '3rem 2rem' }}>
        <div className="absolute opacity-20" style={{ right: '-2%', top: '-20%', transform: 'rotate(15deg)' }}>
          <i className="pi pi-heart-fill" style={{ fontSize: '15rem' }}></i>
        </div>
        <div className="relative z-1 flex align-items-center gap-4">
          <div className="bg-white-alpha-20 backdrop-blur border-circle p-4 flex align-items-center justify-content-center shadow-2 border-1 border-white-alpha-30">
            <i className="pi pi-stethoscope text-5xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold m-0 mb-2">{t('diagnosis:title')}</h1>
            <p className="m-0 text-xl text-emerald-50 font-medium">{t('diagnosis:subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="col-12 lg:col-5 flex flex-column">
          <Card className="shadow-2 border-none border-round-2xl flex-1 border-1 surface-border">
            <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
              <h2 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                <div className="bg-emerald-100 text-emerald-600 p-2 border-round-md"><i className="pi pi-user"></i></div>
                {t('diagnosis:patientData')}
              </h2>
            </div>
            
            <div className="grid p-fluid formgrid">
              <div className="col-12 md:col-6 mb-3">
                <label className="block mb-2 font-bold text-700 text-sm">{t('diagnosis:age')}</label>
                <InputNumber value={form.age} onValueChange={(e) => update('age', e.value ?? 0)} min={0} max={120} inputClassName="p-3 border-round-lg" />
              </div>
              <div className="col-12 md:col-6 mb-3">
                <label className="block mb-2 font-bold text-700 text-sm">{t('diagnosis:gender')}</label>
                <Dropdown value={form.gender} options={genderOptions} onChange={(e) => update('gender', e.value)} className="border-round-lg" panelClassName="border-round-lg shadow-4" />
              </div>

              <div className="col-12 mt-2 mb-3">
                 <div className="border-bottom-1 surface-border"></div>
                 <span className="text-500 font-bold text-xs text-uppercase tracking-wide mt-3 block">Biomarcadores</span>
              </div>

              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">ESR</label>
                <InputNumber value={form.esr} onValueChange={(e) => update('esr', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">CRP</label>
                <InputNumber value={form.crp} onValueChange={(e) => update('crp', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">RF</label>
                <InputNumber value={form.rf} onValueChange={(e) => update('rf', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">Anti-CCP</label>
                <InputNumber value={form.anti_ccp} onValueChange={(e) => update('anti_ccp', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">HLA-B27</label>
                <Dropdown value={form.hla_b27} options={binaryOptions} onChange={(e) => update('hla_b27', e.value)} showClear placeholder="-" className="border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">ANA</label>
                <Dropdown value={form.ana} options={binaryOptions} onChange={(e) => update('ana', e.value)} showClear placeholder="-" className="border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">Anti-Ro</label>
                <Dropdown value={form.anti_ro} options={binaryOptions} onChange={(e) => update('anti_ro', e.value)} showClear placeholder="-" className="border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">Anti-La</label>
                <Dropdown value={form.anti_la} options={binaryOptions} onChange={(e) => update('anti_la', e.value)} showClear placeholder="-" className="border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">Anti-dsDNA</label>
                <Dropdown value={form.anti_dsdna} options={binaryOptions} onChange={(e) => update('anti_dsdna', e.value)} showClear placeholder="-" className="border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">Anti-Sm</label>
                <Dropdown value={form.anti_sm} options={binaryOptions} onChange={(e) => update('anti_sm', e.value)} showClear placeholder="-" className="border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">C3</label>
                <InputNumber value={form.c3} onValueChange={(e) => update('c3', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" />
              </div>
              <div className="col-6 mb-3">
                <label className="block mb-2 font-medium text-700 text-sm">C4</label>
                <InputNumber value={form.c4} onValueChange={(e) => update('c4', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" />
              </div>
            </div>
            
            <div className="flex flex-column sm:flex-row flex-wrap gap-3 mt-4 border-top-1 surface-border pt-4">
              <Button label={t('diagnosis:predict')} icon="pi pi-play" className="flex-1 p-3 text-lg border-round-xl p-button-success shadow-3 hover:shadow-4 transition-all" onClick={() => handlePredict(false)} loading={loading} />
              <Button label={t('diagnosis:predictWithExplanation')} icon="pi pi-search" className="flex-1 p-3 text-lg border-round-xl p-button-outlined p-button-help font-bold bg-white hover:bg-purple-50 transition-colors" onClick={() => handlePredict(true)} loading={loading} />
              <Button icon="pi pi-refresh" className="p-3 border-round-xl p-button-secondary p-button-outlined bg-white hover:bg-surface-100 transition-colors" tooltip={t('common:clear')} tooltipOptions={{ position: 'top' }} onClick={() => { setForm(initialForm); setResult(null); setExplanation(null); setError(null); }} />
            </div>
          </Card>
        </div>

        <div className="col-12 lg:col-7 flex flex-column">
          {loading && (
            <div className="flex flex-column flex-1 justify-content-center align-items-center p-6 bg-white border-round-2xl shadow-2 border-none">
              <ProgressSpinner className="mb-4" style={{ width: '60px', height: '60px' }} strokeWidth="4" animationDuration=".5s" />
              <h3 className="text-700 font-medium m-0 text-xl">{t('common:loading') || 'Analizando paciente...'}</h3>
              <p className="text-500 mt-2 text-center">El modelo está procesando los biomarcadores ingresados</p>
            </div>
          )}
          {error && <Message severity="error" className="mb-3 w-full shadow-1 border-round-xl" text={error} />}
          {result && !loading && (
            <Card className="shadow-2 border-none border-round-2xl flex-1 border-1 surface-border overflow-hidden">
              <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
                  <h2 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                    <div className="bg-blue-100 text-blue-600 p-2 border-round-md"><i className="pi pi-file-medical"></i></div>
                    {t('diagnosis:results')}
                  </h2>
              </div>
              
              {result.overlap_syndrome_detected && (
                <div className="bg-orange-50 border-left-3 border-orange-500 text-orange-700 p-3 mb-4 border-round-right-lg shadow-1 flex align-items-center gap-2">
                   <i className="pi pi-exclamation-triangle text-xl"></i>
                   <span className="font-semibold">{t('diagnosis:overlapSyndrome')}</span>
                </div>
              )}
              {result.missing_features?.length > 0 && (
                <div className="bg-cyan-50 border-left-3 border-cyan-500 text-cyan-700 p-3 mb-4 border-round-right-lg flex align-items-center gap-2">
                   <i className="pi pi-info-circle text-xl"></i>
                   <span className="font-medium">{t('diagnosis:missingFeatures', { features: result.missing_features.join(', ') })}</span>
                </div>
              )}
              
              <div className="flex align-items-center gap-2 mb-4 text-600 p-3 bg-surface-50 border-round-xl border-1 surface-border">
                <i className="pi pi-microchip text-lg text-primary"></i>
                <span className="text-sm font-semibold">{t('diagnosis:modelUsed', { name: result.model_used })}</span>
              </div>

              <DataTable value={result.predictions} stripedRows size="large" responsiveLayout="scroll" className="p-datatable-lg border-none shadow-none">
                <Column header={t('diagnosis:colDisease')} body={diseaseBody} headerClassName="text-600 font-bold bg-transparent border-bottom-1 surface-border" bodyClassName="text-800" />
                <Column header={t('diagnosis:colProbability')} body={probabilityBody} style={{ minWidth: '220px' }} headerClassName="text-600 font-bold bg-transparent border-bottom-1 surface-border" />
                <Column header={t('diagnosis:colDiagnosis')} body={statusBody} headerClassName="text-600 font-bold bg-transparent border-bottom-1 surface-border" />
                <Column field="threshold_used" header={t('diagnosis:colThreshold')} body={(r) => <span className="text-500 font-bold bg-surface-100 px-2 py-1 border-round">{r.threshold_used.toFixed(3)}</span>} headerClassName="text-600 font-bold bg-transparent border-bottom-1 surface-border" />
              </DataTable>

              {explanation && (
                <div className="mt-5 border-1 surface-border border-round-2xl overflow-hidden shadow-1">
                  <TabView className="premium-tabs">
                    <TabPanel header={t('diagnosis:tabShap')} leftIcon="pi pi-chart-bar mr-2 text-primary">
                      <div className="grid p-3 bg-surface-50">
                        {Object.entries(explanation.top_positive_features || {}).map(([disease, features]) => (
                          <div key={disease} className="col-12 md:col-6 mb-3">
                            <div className="bg-white p-4 border-round-xl shadow-1 h-full border-top-3 border-primary hover:shadow-2 transition-shadow">
                              <strong className="text-800 text-lg block mb-3">{getAbbr(disease)}</strong>
                              <ul className="m-0 pl-3 text-600 line-height-3">
                                {features.slice(0, 5).map((f) => (
                                  <li key={f} className="mb-1">{f}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabPanel>
                    <TabPanel header={t('diagnosis:tabLime')} leftIcon="pi pi-percentage mr-2 text-primary">
                      <div className="grid p-3 bg-surface-50">
                        {Object.entries(explanation.lime_explanation || {}).map(([disease, pairs]) => (
                          <div key={disease} className="col-12 md:col-6 mb-3">
                            <div className="bg-white p-4 border-round-xl shadow-1 h-full border-top-3 border-primary hover:shadow-2 transition-shadow">
                              <strong className="text-800 text-lg block mb-3">{getAbbr(disease)}</strong>
                              <ul className="m-0 pl-3 text-600 line-height-3">
                                {(pairs as [string, number][]).slice(0, 5).map(([feat, weight]) => (
                                  <li key={feat} className="mb-1 flex justify-content-between pr-3 border-bottom-1 surface-border py-1">
                                    <span className="font-semibold text-700">{feat}</span> 
                                    <span className="text-primary font-bold">{weight.toFixed(4)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabPanel>
                  </TabView>
                </div>
              )}
            </Card>
          )}
          {!result && !loading && !error && (
            <Card className="shadow-2 border-none border-round-2xl flex-1 flex align-items-center justify-content-center border-1 surface-border" style={{ minHeight: '400px' }}>
              <div className="text-center p-5">
                <div className="bg-surface-50 border-circle p-4 inline-flex mb-4">
                  <i className="pi pi-inbox text-400" style={{ fontSize: '4rem' }}></i>
                </div>
                <h3 className="text-700 text-2xl m-0 font-bold mb-2">Sin Resultados</h3>
                <p className="text-500 text-lg m-0">{t('diagnosis:emptyResults')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

function axiosMessage(e: unknown, fallback: string): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const res = (e as { response?: { data?: { detail?: string | { msg: string }[] } } }).response;
    const detail = res?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map((d) => d.msg).join('; ');
  }
  return fallback;
}

export default Diagnosis;
