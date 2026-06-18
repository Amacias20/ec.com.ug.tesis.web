import { ProgressSpinner } from 'primereact/progressspinner';
import { useNetworkState } from 'hooks/useNetworkState';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import React from 'react';

interface CustomHeaderProps {
    title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => (
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
            <i className={'pi pi-wifi'} style={{ fontSize: '4rem', backgroundColor: '#183d5b', color: 'white', borderRadius: '50%', padding: '0.7rem', boxShadow: '0 0 0 10px white' }}></i> {/* Añadir sombra para fundirse mejor */}
        </div>
        <h4 style={{ marginTop: '1rem', fontWeight: 'bold', textAlign: 'center' }}>{title}</h4>
    </div>
);

const ConnectionDialog: React.FC = () => {
    const isOnline = useNetworkState();
    const [visible, setVisible] = React.useState(false);
    const isDisconnected = !isOnline;

    React.useEffect(() => {
        setVisible(isDisconnected);
    }, [isDisconnected]);

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button label="Permanecer desconectado" icon="pi pi-unlock" onClick={() => setVisible(false)} />
        </div>
    );

    return (
        <Dialog
            className='no-select'
            header={<CustomHeader title="Conexión a internet perdida" />}
            visible={visible}
            onHide={() => setVisible(false)}
            modal
            draggable={false}
            position="center"
            closable={false}
            showHeader={true}
            footer={footer}
            style={{ 
                width: '400px', 
                maxWidth: '90vw',
                textAlign: 'center' 
            }}
        >
            <div className='no-select' style={{ textAlign: 'center' }}>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                <p style={{ marginTop: '10px', textAlign: 'justify' }}>Parece que has perdido la conexión a internet. Verifica tu conexión.</p>
                <p style={{ marginTop: '10px', textAlign: 'justify' }}>Estamos tratando de recuperar la conexión</p>
            </div>
        </Dialog>
    );
};

export default ConnectionDialog;