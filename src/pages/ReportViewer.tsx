import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { getPatient, PatientDetail } from 'services/diagnosisApi';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';

interface ReportViewerProps {
  visible: boolean;
  patientId: string | null;
  onHide: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ visible, patientId, onHide }) => {
  const { t } = useTranslation(['diagnosis', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();
  const [detail, setDetail] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
    try {
      const data = await getPatient(patientId!);
      setDetail(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const header = (
    <div className="flex align-items-center justify-content-between w-full print-hide">
      <div className="flex align-items-center gap-2">
        <i className="pi pi-file-pdf text-red-500 text-2xl"></i>
        <span className="text-xl font-bold">Visor de Reporte</span>
      </div>
      <Button label="Imprimir PDF" icon="pi pi-print" className="p-button-primary mr-5" onClick={handlePrint} />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: '900px', maxWidth: '100vw' }}
      header={header}
      modal
      onHide={onHide}
      className="report-dialog p-0"
      contentClassName="p-0 bg-gray-100"
    >
      {loading || !detail ? (
        <div className="flex justify-content-center align-items-center p-5 min-h-screen print-hide">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="flex justify-content-center p-4 print-p-0 print-bg-white print-hide-scroll">
          <div
            ref={reportRef}
            className="bg-white shadow-4 border-round p-6 print-shadow-none print-p-0 print-m-0 w-full"
            style={{
              minHeight: '297mm', // A4 height
              maxWidth: '210mm',  // A4 width
              margin: '0 auto',
              color: '#000',
            }}
          >
            <div className="flex justify-content-between align-items-end border-bottom-2 border-300 pb-4 mb-4">
              <div>
                <h1 className="m-0 text-3xl font-bold text-teal-700 print-text-black">Reporte de Evaluación</h1>
                <p className="m-0 text-500 mt-1 print-text-black">Generado por el sistema de IA</p>
              </div>
              <div className="text-right text-sm text-600 print-text-black">
                <p className="m-0"><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <p className="m-0"><strong>ID Paciente:</strong> {detail.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
            <div className="surface-100 p-3 border-round mb-4 flex flex-wrap gap-4 print-bg-white print-border">
              <div className="flex-1">
                <p className="m-0 text-500 text-sm print-text-black">Paciente</p>
                <p className="m-0 font-bold text-lg">{detail.first_name} {detail.last_name}</p>
              </div>
              <div className="flex-1">
                <p className="m-0 text-500 text-sm print-text-black">Edad</p>
                <p className="m-0 font-bold text-lg">{detail.age} años</p>
              </div>
              <div className="flex-1">
                <p className="m-0 text-500 text-sm print-text-black">Género</p>
                <p className="m-0 font-bold text-lg">{detail.gender === 1 ? 'Masculino' : 'Femenino'}</p>
              </div>
            </div>
            <h3 className="text-teal-700 border-bottom-1 border-200 pb-2 print-text-black">Biomarcadores Clínicos</h3>
            <div className="grid mb-4">
              {[
                { label: 'ESR', value: detail.esr },
                { label: 'CRP', value: detail.crp },
                { label: 'RF', value: detail.rf },
                { label: 'Anti-CCP', value: detail.anti_ccp },
                { label: 'C3', value: detail.c3 },
                { label: 'C4', value: detail.c4 },
                { label: 'HLA-B27', value: detail.hla_b27 === 1 ? 'Positivo' : (detail.hla_b27 === 0 ? 'Negativo' : '-') },
                { label: 'ANA', value: detail.ana === 1 ? 'Positivo' : (detail.ana === 0 ? 'Negativo' : '-') },
                { label: 'Anti-Ro', value: detail.anti_ro === 1 ? 'Positivo' : (detail.anti_ro === 0 ? 'Negativo' : '-') },
                { label: 'Anti-La', value: detail.anti_la === 1 ? 'Positivo' : (detail.anti_la === 0 ? 'Negativo' : '-') },
                { label: 'Anti-dsDNA', value: detail.anti_dsdna === 1 ? 'Positivo' : (detail.anti_dsdna === 0 ? 'Negativo' : '-') },
                { label: 'Anti-Sm', value: detail.anti_sm === 1 ? 'Positivo' : (detail.anti_sm === 0 ? 'Negativo' : '-') }
              ].map((item, idx) => (
                <div key={idx} className="col-4 p-2">
                  <div className="border-1 surface-border border-round p-2 h-full flex flex-column justify-content-center print-border-black">
                    <span className="text-500 text-xs uppercase print-text-black">{item.label}</span>
                    <span className="font-bold text-700 print-text-black">{item.value !== null && item.value !== undefined ? item.value : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="text-teal-700 border-bottom-1 border-200 pb-2 mt-5 print-text-black">Resultados de IA</h3>
            <div className="surface-50 p-3 border-round mb-4 border-1 surface-border print-bg-white print-border-black">
              <div className="flex justify-content-between align-items-center mb-3">
                <span className="font-semibold">Diagnóstico Principal:</span>
                <span className="text-xl font-bold text-teal-600 print-text-black">{detail.primary_diagnosis ? getName(detail.primary_diagnosis) : 'No determinado'}</span>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="font-semibold">Solapamiento Detectado:</span>
                <span className="font-bold">{detail.overlap_syndrome_detected ? 'SÍ' : 'NO'}</span>
              </div>
            </div>

            <table className="w-full text-left border-collapse" style={{ fontSize: '14px' }}>
              <thead>
                <tr className="border-bottom-2 surface-border print-border-black">
                  <th className="py-2">Enfermedad</th>
                  <th className="py-2 text-right">Probabilidad</th>
                  <th className="py-2 text-center">Umbral</th>
                  <th className="py-2 text-center">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {detail.predictions.map((pred, i) => (
                  <tr key={i} className="border-bottom-1 surface-border print-border-black">
                    <td className="py-3 print-text-black">
                      <strong>{getAbbr(pred.disease_name)}</strong> — {getName(pred.disease_name)}
                    </td>
                    <td className="py-3 text-right font-bold print-text-black">
                      {(pred.probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-center text-500 print-text-black">
                      {(pred.threshold_used * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-center print-text-black">
                      {pred.is_positive ? 'POSITIVO' : 'NEGATIVO'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 mb-4">
              <h4 className="text-teal-700 m-0 mb-3 print-text-black">Gráfica de Probabilidades</h4>
              <div className="surface-50 p-4 border-round border-1 surface-border print-bg-white print-border-black">
                <div className="flex flex-column gap-3">
                  {detail.predictions.map((pred, idx) => (
                    <div key={idx} className="flex align-items-center">
                      <div className="w-4 md:w-3 font-semibold text-sm text-700 print-text-black">
                        {getAbbr(pred.disease_name)}
                      </div>
                      <div className="w-8 md:w-9 flex align-items-center gap-3">
                        <div className="flex-grow-1 surface-300 border-round h-1rem overflow-hidden print-border-black border-1 border-transparent" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                          <div 
                            className={`h-full border-round ${pred.is_positive ? 'bg-teal-500' : 'bg-500'}`} 
                            style={{ 
                              width: `${(pred.probability * 100).toFixed(1)}%`,
                              WebkitPrintColorAdjust: 'exact',
                              printColorAdjust: 'exact'
                            }}
                          />
                        </div>
                        <div className="text-sm font-bold text-right print-text-black" style={{ minWidth: '3.5rem' }}>
                          {(pred.probability * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-top-1 border-200 text-center text-sm text-500 print-text-black">
              Este documento es generado por un sistema de apoyo diagnóstico basado en Inteligencia Artificial y no sustituye el criterio médico profesional.
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ReportViewer;