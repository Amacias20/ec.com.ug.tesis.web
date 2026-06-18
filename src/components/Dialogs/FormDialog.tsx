import React, { useEffect, useState, ReactNode } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface FormDialogProps {
    visible: boolean;
    onHide: () => void;
    title: string;
    icon: string;
    children: ReactNode;
    onSubmit: () => void;
    onCancel: () => void;
    width?: string;
}

const FormDialog: React.FC<FormDialogProps> = ({
    visible,
    onHide,
    title,
    icon,
    children,
    onSubmit,
    onCancel,
    width = '30rem'
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleLoading = (event: CustomEvent<boolean>) => {
            setIsLoading(event.detail);
        };

        window.addEventListener('save-update-loading', handleLoading as EventListener);

        return () => {
            window.removeEventListener('save-update-loading', handleLoading as EventListener);
        };
    }, []);

    const footer = (
        <div style={{ textAlign: 'center', marginTop: '0px' }}>
            <Button
                label="Guardar"
                type='submit'
                icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
                onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            />
            <Button
                label="Cancelar"
                icon="pi pi-times"
                severity="secondary"
                outlined
                onClick={onCancel}
            />
        </div>
    );

    return (
        <Dialog
            draggable={false}
            modal
            visible={visible}
            style={{
                width: width,
                maxWidth: '900px',
                overflow: 'visible',
                position: 'relative',
                borderRadius: '10px',
            }}
            contentStyle={{ paddingBottom: '0px' }}
            header={
                <div className='no-select' style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{title}</span>
                    <i className={icon} style={{ fontSize: '1.5rem', marginRight: '10px' }}></i>
                </div>
            }
            headerStyle={{ paddingBottom: '5px', borderBottom: '1px solid #dadcde' }}
            footer={footer}
            onHide={onHide}
        >
            {children}
        </Dialog>
    );
};

export default FormDialog;