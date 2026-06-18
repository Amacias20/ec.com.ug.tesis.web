import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { ErrorHandler } from 'constants/Global';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

interface DeactivateDialogProps {
    data: Record<string, unknown>;
    fetchData: () => void;
    showDialog: boolean;
    hideDialog: () => void;
    deactivateService: (id: string | number) => Promise<void>;
    icon?: string;
    idField: string;
    rejectStyle?: boolean;
}

const DeactivateDialog: React.FC<DeactivateDialogProps> = ({ 
    data, 
    fetchData, 
    showDialog, 
    hideDialog, 
    deactivateService, 
    icon = 'fas fa-trash', 
    idField,
    rejectStyle = false
}) => {
    const actionText = rejectStyle ? 'Rechazar' : 'Eliminar';
    const actionIcon = rejectStyle ? 'fas fa-times' : icon;

    const deactivateItem = async () => {
        try {
            await deactivateService(data[idField]);
            hideDialog();
            fetchData();
            ToastSuccess('Proceso exitoso');
        } catch (error) {
            ToastError(await ErrorHandler(error));
        }
    };

    const dialogFooter = (
        <div style={{ textAlign: 'center', display: 'flex', gap: '1rem' }}>
            <Button label="Aceptar" icon="pi pi-check" onClick={deactivateItem} />
            <Button label="Cancelar" icon="pi pi-times" severity='secondary' outlined onClick={hideDialog} />
        </div>
    );

    const customHeader = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.1rem' }}>
            <div
                style={{
                    marginTop: '-3.5rem',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <i className={actionIcon} style={{ 
                    fontSize: '4rem', 
                    backgroundColor: '#183d5b', 
                    color: 'white', 
                    borderRadius: '50%', 
                    padding: '0.7rem', 
                    boxShadow: '0 0 0 10px white',
                    width: rejectStyle ? '5rem' : 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}></i>
                <h4 style={{ marginTop: '1rem', fontWeight: 'bold', textAlign: 'center' }}>{actionText}</h4>
            </div>
        </div>
    );

    return (
        <Dialog
            draggable={false}
            modal={true}
            visible={showDialog}
            closable={false}
            header={customHeader}
            footer={dialogFooter}
            onHide={hideDialog}
            style={{ width: '90vw', maxWidth: '400px' }}
        >
            <div className="confirmation-content" style={{ textAlign: 'center', padding: '0.5rem' }}>
                <span style={{ display: 'block', fontSize: '16px' }}>¿Está seguro/a que desea {actionText.toLowerCase()} este elemento?</span>
            </div>
        </Dialog>
    );
};

export default DeactivateDialog;