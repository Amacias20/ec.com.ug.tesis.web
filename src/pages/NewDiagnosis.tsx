import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  predict, 
  predictWithExplanation, 
  PatientInput, 
  PredictionResponse, 
  ExplainabilityResponse 
} from 'services/diagnosisApi';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const initialForm: PatientInput = {
  first_name: '',
  last_name: '',
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

interface NewDiagnosisProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const NewDiagnosis = ({ visible, onHide, onSuccess }: NewDiagnosisProps) => {
  const { t } = useTranslation(['diagnosis', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState<PatientInput>(initialForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [explanation, setExplanation] = useState<ExplainabilityResponse | null>(null);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (visible) {
      setForm(initialForm);
      setResult(null);
      setExplanation(null);
      setError(null);
    }
  }, [visible]);

  const genderOptions = useMemo(
    () => [
      { label: t('diagnosis:male'), value: 'Male' },
      { label: t('diagnosis:female'), value: 'Female' },
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

  const handleClose = () => {
    onHide();
    if (result) {
      onSuccess();
    }
  };

  const update = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (): PatientInput => {
    const payload: PatientInput = { 
      first_name: form.first_name, 
      last_name: form.last_name, 
      age: form.age, 
      gender: form.gender 
    };
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
    setLoadingPredict(true);
    setError(null);
    setResult(null);
    setExplanation(null);
    
    // Quick validation
    if (!form.first_name || !form.last_name) {
      setError("Please fill First Name and Last Name");
      setLoadingPredict(false);
      return;
    }

    try {
      const payload = buildPayload();
      if (withExplanation) {
        const data = await predictWithExplanation(payload);
        setResult(data.prediction);
        setExplanation(data.explanation);
      } else {
        setResult(await predict(payload));
      }
      toast.current?.show({ severity: 'success', summary: 'Success', detail: t('diagnosis:savedSuccess') });
    } catch (e: any) {
      setError(e?.response?.data?.detail || t('common:apiError'));
    } finally {
      setLoadingPredict(false);
    }
  };

  // --- Modal Prediction Results Templates ---
  const probabilityBodyModal = (row: { probability: number }) => (
    <div className="flex align-items-center gap-3">
      <ProgressBar value={Math.round(row.probability * 100)} showValue={false} style={{ height: '10px', flex: 1, borderRadius: '10px' }} className="border-round-xl overflow-hidden shadow-1" color={row.probability > 0.5 ? 'var(--red-500)' : 'var(--teal-500)'} />
      <span className="text-sm font-bold w-3rem text-right text-700">{(row.probability * 100).toFixed(1)}%</span>
    </div>
  );

  const statusBodyModal = (row: { is_positive: boolean }) => (
    <Tag
      value={row.is_positive ? t('common:positive') : t('common:negative')}
      severity={row.is_positive ? 'danger' : 'success'}
      className="text-xs px-3 py-2 font-bold border-round-2xl shadow-1 uppercase tracking-wide"
    />
  );

  const diseaseBodyModal = (row: { disease: string }) => (
    <span>
      <strong>{getAbbr(row.disease)}</strong> — {getName(row.disease)}
    </span>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 border-top-1 surface-border pt-4">
      <Button label={t('diagnosis:close')} icon="pi pi-times" onClick={handleClose} className="p-button-text text-600" />
      {result && <Button label={t('diagnosis:saveAndClose')} icon="pi pi-check" onClick={handleClose} autoFocus />}
    </div>
  );

  const dialogHeader = (
    <div className="flex align-items-center gap-3 pt-2 pl-2">
      <div className="flex align-items-center justify-content-center border-round-xl shadow-1" style={{ width: '3.2rem', height: '3.2rem', background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-400) 100%)' }}>
        <i className="pi pi-plus text-white text-xl"></i>
      </div>
      <div className="flex flex-column">
        <span className="text-2xl font-bold text-800 line-height-2">{t('diagnosis:newEvaluation')}</span>
        <span className="text-500 text-sm font-medium">Completar formulario clínico</span>
      </div>
    </div>
  );

  return (
    <Dialog visible={visible} style={{ width: '90vw', maxWidth: '1000px' }} header={dialogHeader} modal draggable={false} resizable={false} blockScroll={true} onHide={handleClose} footer={dialogFooter} className="p-fluid">
      <Toast ref={toast} />
      {!result ? (
        /* --- FORM VIEW --- */
        <div className="pt-3">
           <div className="flex align-items-center mb-4 bg-blue-50 p-3 border-round-xl text-blue-700">
              <i className="pi pi-info-circle mr-2 text-xl"></i>
              <span>Complete the clinical biomarkers below. The system will automatically save the evaluation after prediction.</span>
           </div>

           <div className="grid formgrid">
            <div className="col-12 md:col-6 mb-3">
              <label className="block mb-2 font-bold text-700 text-sm">{t('diagnosis:firstName')}</label>
              <InputText value={form.first_name} onChange={(e) => update('first_name', e.target.value)} className="w-full p-3 border-round-lg" />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className="block mb-2 font-bold text-700 text-sm">{t('diagnosis:lastName')}</label>
              <InputText value={form.last_name} onChange={(e) => update('last_name', e.target.value)} className="w-full p-3 border-round-lg" />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className="block mb-2 font-bold text-700 text-sm">{t('diagnosis:age')}</label>
              <InputNumber value={form.age} onValueChange={(e) => update('age', e.value ?? 0)} min={0} max={120} inputClassName="p-3 border-round-lg w-full" className="w-full" />
            </div>
            <div className="col-12 md:col-6 mb-3">
              <label className="block mb-2 font-bold text-700 text-sm">{t('diagnosis:gender')}</label>
              <Dropdown value={form.gender} options={genderOptions} onChange={(e) => update('gender', e.value)} className="w-full border-round-lg" panelClassName="border-round-lg shadow-4" />
            </div>

            <div className="col-12 mt-2 mb-3">
               <div className="border-bottom-1 surface-border"></div>
               <span className="text-500 font-bold text-xs text-uppercase tracking-wide mt-3 block">Biomarcadores</span>
            </div>

            {/* Biomarkers 2 columns */}
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">ESR</label><InputNumber value={form.esr} onValueChange={(e) => update('esr', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">CRP</label><InputNumber value={form.crp} onValueChange={(e) => update('crp', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">RF</label><InputNumber value={form.rf} onValueChange={(e) => update('rf', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">Anti-CCP</label><InputNumber value={form.anti_ccp} onValueChange={(e) => update('anti_ccp', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">HLA-B27</label><Dropdown value={form.hla_b27} options={binaryOptions} onChange={(e) => update('hla_b27', e.value)} showClear placeholder="-" className="border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">ANA</label><Dropdown value={form.ana} options={binaryOptions} onChange={(e) => update('ana', e.value)} showClear placeholder="-" className="border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">Anti-Ro</label><Dropdown value={form.anti_ro} options={binaryOptions} onChange={(e) => update('anti_ro', e.value)} showClear placeholder="-" className="border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">Anti-La</label><Dropdown value={form.anti_la} options={binaryOptions} onChange={(e) => update('anti_la', e.value)} showClear placeholder="-" className="border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">Anti-dsDNA</label><Dropdown value={form.anti_dsdna} options={binaryOptions} onChange={(e) => update('anti_dsdna', e.value)} showClear placeholder="-" className="border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">Anti-Sm</label><Dropdown value={form.anti_sm} options={binaryOptions} onChange={(e) => update('anti_sm', e.value)} showClear placeholder="-" className="border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">C3</label><InputNumber value={form.c3} onValueChange={(e) => update('c3', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" /></div>
            <div className="col-12 md:col-6 mb-3"><label className="block mb-2 font-medium text-700 text-sm">C4</label><InputNumber value={form.c4} onValueChange={(e) => update('c4', e.value)} placeholder="-" inputClassName="p-3 border-round-lg" /></div>
          </div>

          {error && <Message severity="error" className="mb-3 w-full shadow-1 border-round-xl mt-3" text={error} />}

          <div className="flex flex-column sm:flex-row flex-wrap gap-3 mt-4 pt-3">
            <Button label={t('diagnosis:predict')} icon="pi pi-play" className="flex-1 p-3 text-lg border-round-xl p-button-success shadow-3 hover:shadow-4 transition-all" onClick={() => handlePredict(false)} loading={loadingPredict} />
            <Button label={t('diagnosis:predictWithExplanation')} icon="pi pi-search" className="flex-1 p-3 text-lg border-round-xl p-button-outlined p-button-help font-bold bg-white hover:bg-purple-50 transition-colors" onClick={() => handlePredict(true)} loading={loadingPredict} />
          </div>
        </div>
      ) : (
        /* --- RESULTS VIEW --- */
        <div className="pt-3">
           <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3">
                <h2 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                  <div className="bg-emerald-100 text-emerald-600 p-2 border-round-md"><i className="pi pi-check-circle"></i></div>
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
            
            <div className="flex align-items-center gap-2 mb-4 text-600 p-3 bg-surface-50 border-round-xl border-1 surface-border w-fit">
              <i className="pi pi-microchip text-lg text-primary"></i>
              <span className="text-sm font-semibold">{t('diagnosis:modelUsed', { name: result.model_used })}</span>
            </div>

            <DataTable value={result.predictions} stripedRows size="large" responsiveLayout="scroll" className="p-datatable-lg border-1 surface-border border-round-xl overflow-hidden mb-4">
              <Column header={t('diagnosis:colDisease')} body={diseaseBodyModal} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" bodyClassName="text-800" />
              <Column header={t('diagnosis:colProbability')} body={probabilityBodyModal} style={{ minWidth: '220px' }} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" />
              <Column header={t('diagnosis:colDiagnosis')} body={statusBodyModal} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" />
              <Column field="threshold_used" header={t('diagnosis:colThreshold')} body={(r) => <span className="text-500 font-bold bg-surface-100 px-2 py-1 border-round">{r.threshold_used.toFixed(3)}</span>} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" />
            </DataTable>

            {explanation && (
              <div className="border-1 surface-border border-round-2xl overflow-hidden shadow-1 mt-4">
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
        </div>
      )}
    </Dialog>
  );
};

export default NewDiagnosis;
