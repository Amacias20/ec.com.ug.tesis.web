import { getPatients, deletePatient, PatientRecord } from 'services/diagnosisApi';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDiseaseLabel } from 'hooks/useDiseaseLabel';
import { ProgressBar } from 'primereact/progressbar';
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import DiagnosisDetail from './DiagnosisDetail';
import { useTranslation } from 'react-i18next';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ReportViewer from './ReportViewer';
import NewDiagnosis from './NewDiagnosis';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import * as XLSX from 'xlsx';

const Diagnosis = () => {
  const { t } = useTranslation(['diagnosis', 'common']);
  const { getAbbr, getName } = useDiseaseLabel();
  const toast = useRef<Toast>(null);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingTable, setLoadingTable] = useState(false);
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 1 });
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const loadPatients = async () => {
    setLoadingTable(true);
    try {
      const data = await getPatients(lazyParams.page, lazyParams.rows);
      setPatients(data.items);
      setTotalRecords(data.total);
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not load patient history' });
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [lazyParams]);

  const onPage = (event: any) => {
    setLazyParams({
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: t('diagnosis:deleteConfirm'),
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptClassName: 'p-button-danger',
      acceptLabel: t('diagnosis:yes') || 'Sí',
      rejectLabel: t('diagnosis:no') || 'No',
      accept: () => handleDelete(id)
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePatient(id);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: t('diagnosis:deleteSuccess') });
      loadPatients();
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not delete record' });
    }
  };

  const exportToExcel = async () => {
    setLoadingTable(true);
    try {
      let allItems: PatientRecord[] = [];
      let currentPage = 1;
      let totalPages = 1;

      // Loop to fetch all records bypassing the 100-limit per page
      do {
        const data = await getPatients(currentPage, 100);
        allItems = [...allItems, ...data.items];
        totalPages = data.pages;
        currentPage++;
      } while (currentPage <= totalPages);

      const exportData = allItems.map((p) => ({
        Fecha: new Intl.DateTimeFormat('es-ES', {
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }).format(new Date(p.created_at)),
        Paciente: `${p.first_name} ${p.last_name}`,
        Edad: p.age,
        'Género': p.gender === 1 ? t('diagnosis:male') : t('diagnosis:female'),
        'Diagnóstico Principal': p.primary_diagnosis ? getName(p.primary_diagnosis) : 'No determinado',
        'Probabilidad': p.primary_probability !== null ? `${(p.primary_probability * 100).toFixed(1)}%` : '-',
        'Solapamiento': p.overlap_syndrome_detected ? t('diagnosis:yes') : t('diagnosis:no')
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
      XLSX.writeFile(workbook, 'Historial_Pacientes.xlsx');

      toast.current?.show({ severity: 'success', summary: 'Exportación Exitosa', detail: 'El archivo Excel ha sido descargado.' });
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo exportar a Excel' });
    } finally {
      setLoadingTable(false);
    }
  };

  // --- Table Templates ---
  const dateBody = (rowData: PatientRecord) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(rowData.created_at));
  };
  const nameBody = (rowData: PatientRecord) => <span className="font-semibold text-800">{rowData.first_name} {rowData.last_name}</span>;
  const genderBody = (rowData: PatientRecord) => (rowData.gender === 1 ? t('diagnosis:male') : t('diagnosis:female'));
  const primaryDiagBody = (rowData: PatientRecord) => {
    if (!rowData.primary_diagnosis) return '-';
    return (
      <span>
        <strong>{getAbbr(rowData.primary_diagnosis)}</strong> — {getName(rowData.primary_diagnosis)}
      </span>
    );
  };
  const probBody = (rowData: PatientRecord) => {
    if (rowData.primary_probability === null) return '-';
    return (
      <div className="flex align-items-center gap-2">
        <ProgressBar value={Math.round(rowData.primary_probability * 100)} showValue={false} style={{ height: '8px', width: '60px' }} color="var(--primary-color)" />
        <span className="text-sm font-bold">{(rowData.primary_probability * 100).toFixed(1)}%</span>
      </div>
    );
  };
  const overlapBody = (rowData: PatientRecord) => (
    <Tag value={rowData.overlap_syndrome_detected ? t('diagnosis:yes') : t('diagnosis:no')} severity={rowData.overlap_syndrome_detected ? 'warning' : 'success'} />
  );
  const actionBody = (rowData: PatientRecord) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" rounded outlined severity="info" aria-label="View" onClick={() => { setSelectedPatientId(rowData.id); setDetailVisible(true); }} tooltip={t('diagnosis:viewDetail')} />
      <Button icon="pi pi-file-pdf" rounded outlined severity="warning" aria-label="Report" onClick={() => { setSelectedPatientId(rowData.id); setReportVisible(true); }} tooltip={t('diagnosis:reportViewer')} />
      <Button icon="pi pi-trash" rounded outlined severity="danger" aria-label="Delete" onClick={() => confirmDelete(rowData.id)} />
    </div>
  );

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex flex-column gap-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Toast ref={toast} />
      <ConfirmDialog style={{ width: '450px' }} className="shadow-4" draggable={false} resizable={false} blockScroll={true} />

      {/* Premium Hero Section */}
      <div className="relative border-round-3xl overflow-hidden shadow-4" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '3rem 2rem' }}>
        <div className="absolute opacity-20" style={{ right: '-2%', top: '-20%', transform: 'rotate(15deg)' }}>
          <i className="pi pi-users" style={{ fontSize: '15rem' }}></i>
        </div>
        <div className="relative z-1 flex align-items-center justify-content-between flex-wrap gap-4">
          <div className="flex align-items-center gap-4">
            <div className="bg-white-alpha-20 backdrop-blur border-circle p-4 flex align-items-center justify-content-center shadow-2 border-1 border-white-alpha-30">
              <i className="pi pi-folder-open text-5xl text-white"></i>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold m-0 mb-2">{t('diagnosis:patientHistory')}</h1>
              <p className="m-0 text-xl text-emerald-50 font-medium">{t('diagnosis:historySubtitle')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              label={t('diagnosis:exportExcel')}
              icon="pi pi-file-excel"
              className="p-button-rounded p-button-outlined bg-white font-bold shadow-3"
              style={{ color: '#10b981', borderColor: 'transparent', padding: '0.75rem 1.5rem' }}
              onClick={exportToExcel}
            />
            <Button
              label={t('diagnosis:newEvaluation')}
              icon="pi pi-plus"
              className="p-button-rounded bg-white border-none font-bold shadow-3"
              style={{ color: '#059669', padding: '0.75rem 1.5rem' }}
              onClick={() => setModalVisible(true)}
            />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 border-round-2xl shadow-2 border-1 surface-border">
        <DataTable
          value={patients}
          lazy
          paginator
          first={lazyParams.first}
          rows={lazyParams.rows}
          totalRecords={totalRecords}
          onPage={onPage}
          loading={loadingTable}
          emptyMessage={
            <div className="text-center p-5">
              <i className="pi pi-inbox text-400 text-5xl mb-3"></i>
              <h3 className="m-0 text-700">{t('diagnosis:noRecords')}</h3>
              <p className="text-500 mt-2">{t('diagnosis:noRecordsHint')}</p>
            </div>
          }
          className="p-datatable-lg border-none"
          rowHover
          stripedRows
        >
          <Column header={t('diagnosis:colDate')} body={dateBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column header={t('diagnosis:colName')} body={nameBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column field="age" header={t('diagnosis:colAge')} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column header={t('diagnosis:colGender')} body={genderBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column header={t('diagnosis:colPrimaryDiagnosis')} body={primaryDiagBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column header={t('diagnosis:colPrimaryProbability')} body={probBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column header={t('diagnosis:colOverlap')} body={overlapBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
          <Column header={t('diagnosis:colActions')} body={actionBody} headerClassName="bg-surface-50 text-700 border-bottom-1 surface-border" />
        </DataTable>
      </div>
      <NewDiagnosis
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        onSuccess={loadPatients}
      />
      <DiagnosisDetail
        visible={detailVisible}
        patientId={selectedPatientId}
        onHide={() => { setDetailVisible(false); setSelectedPatientId(null); }}
      />
      <ReportViewer
        visible={reportVisible}
        patientId={selectedPatientId}
        onHide={() => { setReportVisible(false); setSelectedPatientId(null); }}
      />
    </div>
  );
};

export default Diagnosis;