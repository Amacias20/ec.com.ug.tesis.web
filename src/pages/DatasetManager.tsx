import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { getDatasetHistory, deleteDataset, DatasetInfo } from '../services/datasetApi';
import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import moment from 'moment';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const DatasetManager: React.FC = () => {
    const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await getDatasetHistory();
            setDatasets(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not load dataset history.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const onUpload = (e: FileUploadUploadEvent) => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Dataset Uploaded Successfully' });
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
        loadHistory();
    };

    const onError = (e: any) => {
        let msg = 'Error uploading dataset.';
        if (e.xhr && e.xhr.response) {
            try {
                const res = JSON.parse(e.xhr.response);
                msg = res.detail || msg;
            } catch (err) { }
        }
        toast.current?.show({ severity: 'error', summary: 'Error', detail: msg });
    }

    const formatDate = (value: string) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteDataset(id);
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Dataset has been removed.' });
            loadHistory();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete dataset.' });
        }
    };

    const actionBodyTemplate = (rowData: DatasetInfo) => {
        return (
            <Button icon="pi pi-trash" rounded outlined severity="danger" aria-label="Cancel" onClick={() => handleDelete(rowData.id)} />
        );
    };

    return (
        <div className="grid">
            <Toast ref={toast} />

            <div className="col-12">
                <Card title="Upload Dataset" className="mb-4">
                    <p className="m-0 mb-3">Upload a new dataset for the Autoimmune model. Allowed formats: .csv, .xlsx, .xls</p>
                    <FileUpload
                        ref={fileUploadRef}
                        name="file"
                        url={`${API_BASE}/datasets/upload`}
                        accept=".csv,.xlsx,.xls"
                        maxFileSize={50000000}
                        onUpload={onUpload}
                        onError={onError}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                    />
                </Card>
            </div>

            <div className="col-12">
                <Card title="Dataset History">
                    <DataTable value={datasets} loading={loading} paginator rows={10}
                        emptyMessage="No datasets found."
                        stripedRows responsiveLayout="scroll">
                        <Column field="filename" header="File Name" sortable></Column>
                        <Column field="total_rows" header="Total Rows" sortable></Column>
                        <Column field="upload_date" header="Upload Date" sortable 
                                body={(rowData: DatasetInfo) => formatDate(rowData.upload_date)}></Column>
                        <Column field="size_bytes" header="Size" sortable
                            body={(rowData: DatasetInfo) => formatSize(rowData.size_bytes)}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default DatasetManager;