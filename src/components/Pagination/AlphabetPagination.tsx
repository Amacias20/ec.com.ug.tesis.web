import { TabMenu } from 'primereact/tabmenu';
import useKeyPress from 'hooks/useKeyPress';
import { Button } from 'primereact/button';
import React from 'react';

interface AlphabetPaginationProps {
    onLetterChange: (letter: string) => void;
    selectedIndex: number;
    items?: string[];
}

export const AlphabetPagination: React.FC<AlphabetPaginationProps> = ({
    onLetterChange,
    selectedIndex,
    items = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

}) => {
    const isCtrlLeft = useKeyPress(['ctrl', 'ArrowLeft'], { combination: true });
    const isCtrlRight = useKeyPress(['ctrl', 'ArrowRight'], { combination: true });

    React.useEffect(() => {
        if (isCtrlLeft && selectedIndex > 0) {
            onLetterChange(items[selectedIndex - 1]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCtrlLeft]);

    React.useEffect(() => {
        if (isCtrlRight && selectedIndex < items.length - 1) {
            onLetterChange(items[selectedIndex + 1]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCtrlRight]);

    return (
        <div className="flex align-items-center justify-content-center" style={{ width: '100%' }}>
            <Button 
                className="p-button p-button-text p-button-rounded" 
                tooltip='Inicio'
                tooltipOptions={{ showDelay: 2000 }}
                onClick={() => onLetterChange(items[0])}
                disabled={selectedIndex === 0}
            >
                <i className="pi pi-angle-double-left"></i>
            </Button>
            <Button 
                className="p-button p-button-text p-button-rounded" 
                tooltip='Anterior, Ctrl + Izquierda'
                tooltipOptions={{ showDelay: 2000 }}
                onClick={() => selectedIndex > 0 && onLetterChange(items[selectedIndex - 1])}
                disabled={selectedIndex === 0}
            >
                <i className="pi pi-chevron-left"></i>
            </Button>
            <TabMenu 
                model={items.map(item => ({ label: item }))}
                activeIndex={selectedIndex}
                onTabChange={(e) => onLetterChange(items[e.index])}
                className="justify-content-center"
                style={{ flex: 1 }}
            />
            <Button 
                className="p-button p-button-text p-button-rounded"
                tooltip="Siguiente, Ctrl + derecha"
                tooltipOptions={{ showDelay: 2000 }}
                onClick={() => selectedIndex < items.length - 1 && onLetterChange(items[selectedIndex + 1])}
                disabled={selectedIndex === items.length - 1}
            >
                <i className="pi pi-chevron-right"></i>
            </Button>
            <Button 
                className="p-button p-button-text p-button-rounded"
                tooltip="Fin"
                tooltipOptions={{ showDelay: 2000 }}
                onClick={() => onLetterChange(items[items.length - 1])}
                disabled={selectedIndex === items.length - 1}
            >
                <i className="pi pi-angle-double-right"></i>
            </Button>
        </div>
    );
}; 