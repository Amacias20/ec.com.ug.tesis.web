import { getPatient, PatientDetail } from 'services/diagnosisApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

interface DiagnosisDetailProps {
  visible: boolean;
  patientId: string | null;
  onHide: () => void;
}

const DiagnosisDetail = ({ visible, patientId, onHide }: DiagnosisDetailProps) => {
  const { t } = useTranslation(['diagnosis', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();

  const [detail, setDetail] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && patientId) {
      loadDetail();
    } else {
      setDetail(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, patientId]);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatient(patientId!);
      setDetail(data);
      setLoading(false); // Stop main loading so user can see data while explanation loads
      
      // Fetch explanation in the background
      try {
        const input = {
          first_name: data.first_name,
          last_name: data.last_name,
          age: data.age,
          gender: data.gender === 1 ? 'Male' : 'Female' as const,
          esr: data.esr,
          crp: data.crp,
          rf: data.rf,
          anti_ccp: data.anti_ccp,
          hla_b27: data.hla_b27 === 1 ? 'Positive' : data.hla_b27 === 0 ? 'Negative' : null as any,
          ana: data.ana === 1 ? 'Positive' : data.ana === 0 ? 'Negative' : null as any,
          anti_ro: data.anti_ro === 1 ? 'Positive' : data.anti_ro === 0 ? 'Negative' : null as any,
          anti_la: data.anti_la === 1 ? 'Positive' : data.anti_la === 0 ? 'Negative' : null as any,
          anti_dsdna: data.anti_dsdna === 1 ? 'Positive' : data.anti_dsdna === 0 ? 'Negative' : null as any,
          anti_sm: data.anti_sm === 1 ? 'Positive' : data.anti_sm === 0 ? 'Negative' : null as any,
          c3: data.c3,
          c4: data.c4
        };
        const { explain } = await import('services/diagnosisApi');
        const explainData = await explain(input);
        setDetail(prev => prev ? { ...prev, natural_language_explanation: explainData.natural_language_explanation } : prev);
      } catch (e) {
        console.error("Failed to fetch explanation", e);
      }
    } catch (e) {
      setError(t('common:apiError'));
      setLoading(false);
    }
  };

  // --- Modal Templates ---
  const probabilityBodyModal = (row: { probability: number; is_positive: boolean }) => (
    <div className="flex align-items-center gap-3">
      <ProgressBar value={Math.round(row.probability * 100)} showValue={false} style={{ height: '10px', flex: 1, borderRadius: '10px' }} className="border-round-xl overflow-hidden shadow-1" color={row.is_positive ? 'var(--red-500)' : 'var(--teal-500)'} />
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

  const diseaseBodyModal = (row: { disease_name: string }) => (
    <span>
      <strong>{getAbbr(row.disease_name)}</strong> — {getName(row.disease_name)}
    </span>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2 border-top-1 surface-border pt-4">
      <Button label={t('diagnosis:close')} icon="pi pi-times" onClick={onHide} className="p-button-text text-600 font-bold" />
    </div>
  );

  const dialogHeader = (
    <div className="flex align-items-center gap-3 pt-2 pl-2">
      <div className="flex align-items-center justify-content-center border-round-xl shadow-1" style={{ width: '3.2rem', height: '3.2rem', background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-400) 100%)' }}>
        <i className="pi pi-file text-white text-xl"></i>
      </div>
      <div className="flex flex-column">
        <span className="text-2xl font-bold text-800 line-height-2">{t('diagnosis:evaluationDetail')}</span>
        <span className="text-500 text-sm font-medium">Resultados y datos clínicos registrados</span>
      </div>
    </div>
  );

  return (
    <Dialog 
      visible={visible} 
      style={{ width: '90vw', maxWidth: '1000px' }} 
      header={dialogHeader} 
      modal 
      draggable={false}
      resizable={false}
      blockScroll={true}
      onHide={onHide} 
      footer={dialogFooter} 
      className="p-fluid"
    >
      {loading ? (
        <div className="flex flex-column align-items-center justify-content-center p-5">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
          <p className="text-600 mt-3 font-semibold">Cargando detalles...</p>
        </div>
      ) : error ? (
        <div className="text-center p-5 text-red-500">
          <i className="pi pi-exclamation-circle text-5xl mb-3"></i>
          <h3 className="m-0">{error}</h3>
        </div>
      ) : detail ? (
        <div className="pt-3">
          
          <Card className="shadow-2 border-none border-round-2xl border-1 surface-border mb-4">
            <h3 className="m-0 text-xl font-bold text-800 mb-4 border-bottom-1 surface-border pb-3 flex align-items-center gap-2">
              <i className="pi pi-bolt text-indigo-500"></i>
              {t('diagnosis:aiClinicalAnalysis')}
            </h3>
            <div className="grid">
              <div className="col-12 md:col-6 lg:col-3 mb-2">
                <span className="text-500 text-sm block mb-1">{t('diagnosis:colName')}</span>
                <span className="font-bold text-800">{detail.first_name} {detail.last_name}</span>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-2">
                <span className="text-500 text-sm block mb-1">{t('diagnosis:colAge')}</span>
                <span className="font-bold text-800">{detail.age}</span>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-2">
                <span className="text-500 text-sm block mb-1">{t('diagnosis:colGender')}</span>
                <span className="font-bold text-800">{detail.gender === 1 ? t('diagnosis:male') : t('diagnosis:female')}</span>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-2">
                <span className="text-500 text-sm block mb-1">{t('diagnosis:colDate')}</span>
                <span className="font-bold text-800">
                  {new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(detail.created_at))}
                </span>
              </div>
            </div>
          </Card>

          {/* Biomarkers Card */}
          <div className="bg-white p-4 border-round-xl border-1 surface-border mb-4 shadow-1">
            <h3 className="m-0 mb-3 text-700 border-bottom-1 surface-border pb-2 flex align-items-center gap-2">
              <i className="pi pi-list"></i> {t('diagnosis:clinicalData')}
            </h3>
            <div className="grid">
              {[
                { label: 'ESR', val: detail.esr }, { label: 'CRP', val: detail.crp },
                { label: 'RF', val: detail.rf }, { label: 'Anti-CCP', val: detail.anti_ccp },
                { label: 'C3', val: detail.c3 }, { label: 'C4', val: detail.c4 }
              ].map(item => (
                <div key={item.label} className="col-6 md:col-4 lg:col-2 mb-2">
                  <span className="text-500 text-xs font-semibold uppercase block mb-1">{item.label}</span>
                  <span className="font-bold text-800">{item.val ?? '-'}</span>
                </div>
              ))}
              {[
                { label: 'HLA-B27', val: detail.hla_b27 }, { label: 'ANA', val: detail.ana },
                { label: 'Anti-Ro', val: detail.anti_ro }, { label: 'Anti-La', val: detail.anti_la },
                { label: 'Anti-dsDNA', val: detail.anti_dsdna }, { label: 'Anti-Sm', val: detail.anti_sm }
              ].map(item => (
                <div key={item.label} className="col-6 md:col-4 lg:col-2 mb-2">
                  <span className="text-500 text-xs font-semibold uppercase block mb-1">{item.label}</span>
                  <span className="font-bold text-800">{item.val === 1 ? t('common:positive') : item.val === 0 ? t('common:negative') : '-'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 surface-border pb-3 mt-5">
              <h2 className="m-0 text-2xl font-bold text-800 flex align-items-center gap-2">
                <div className="bg-emerald-100 text-emerald-600 p-2 border-round-md"><i className="pi pi-check-circle"></i></div>
                {t('diagnosis:results')}
              </h2>
          </div>
          
          {detail.overlap_syndrome_detected && (
            <div className="bg-orange-50 border-left-3 border-orange-500 text-orange-700 p-3 mb-4 border-round-right-lg shadow-1 flex align-items-center gap-2">
               <i className="pi pi-exclamation-triangle text-xl"></i>
               <span className="font-semibold">{t('diagnosis:overlapSyndrome')}</span>
            </div>
          )}

          {detail.natural_language_explanation && Object.keys(detail.natural_language_explanation).length > 0 && (
              <div className="border-1 surface-border border-round-2xl overflow-hidden shadow-1 mt-4">
                <div className="bg-indigo-50 p-4 border-bottom-1 surface-border flex align-items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-600 border-circle w-3rem h-3rem flex align-items-center justify-content-center shadow-1">
                    <i className="pi pi-sparkles text-xl"></i>
                  </div>
                  <h4 className="m-0 text-indigo-900 font-bold text-lg">{t('diagnosis:aiClinicalExplanation')}</h4>
                </div>
                <div className="bg-white p-4">
                  {Object.entries(detail.natural_language_explanation!).map(([disease, text]) => (
                    <div key={disease} className="mb-4 last:mb-0">
                      <div className="flex align-items-center gap-2 mb-2">
                         <i className="pi pi-verified text-indigo-500 text-xl"></i>
                         <strong className="text-indigo-900 text-lg">{getName(disease)}</strong>
                      </div>
                      <p className="m-0 text-700 line-height-3 text-base">{text}</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

          <DataTable value={[...detail.predictions].sort((a, b) => a.is_positive === b.is_positive ? b.probability - a.probability : a.is_positive ? -1 : 1)} stripedRows size="large" responsiveLayout="scroll" className="p-datatable-lg border-1 surface-border border-round-xl overflow-hidden mb-4 shadow-1">
            <Column header={t('diagnosis:colDisease')} body={diseaseBodyModal} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" bodyClassName="text-800" />
            <Column header={t('diagnosis:colProbability')} body={probabilityBodyModal} style={{ minWidth: '220px' }} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" />
            <Column header={t('diagnosis:colDiagnosis')} body={statusBodyModal} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" />
            <Column field="threshold_used" header={t('diagnosis:colThreshold')} body={(r) => <span className="text-500 font-bold bg-surface-100 px-2 py-1 border-round">{r.threshold_used.toFixed(3)}</span>} headerClassName="text-600 font-bold bg-surface-50 border-bottom-1 surface-border" />
          </DataTable>

        </div>
      ) : null}
    </Dialog>
  );
};

export default DiagnosisDetail;
