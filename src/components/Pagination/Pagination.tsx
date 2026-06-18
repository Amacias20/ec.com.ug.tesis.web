import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import React from 'react';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

interface PageSizeOption {
    label: string;
    value: number;
}

const PaginationComponent: React.FC<PaginationProps> = ({ totalPages, currentPage, pageSize, onPageChange, onPageSizeChange }) => {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    const buttonStyle: React.CSSProperties = {
        margin: '0 2px',
    };

    const highlightedButtonStyle: React.CSSProperties = {
        backgroundColor: '#183d5b', 
        color: '#ffffff', 
        margin: '0 2px',
    };

    const disabledButtonStyle: React.CSSProperties = {
        pointerEvents: 'none',
        opacity: 0.5,
    };

    const pageSizeOptions: PageSizeOption[] = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '15', value: 15 },
        { label: '20', value: 20 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
    ];

    return (
        <div style={{ 
            padding: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '5px'
        }}>
            <div style={{ textAlign: 'left' }}>
                <span>Página {currentPage} de {totalPages}.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Dropdown value={pageSize} options={pageSizeOptions} onChange={(e: DropdownChangeEvent) => onPageSizeChange(e.value)} style={{ marginRight: '10px' }} />
                <Button
                    text
                    icon="pi pi-angle-double-left"
                    style={currentPage === 1 ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
                    className={classNames('p-paginator-first')}
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                />
                <Button
                    text
                    icon="pi pi-angle-left"
                    style={currentPage === 1 ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
                    className={classNames('p-paginator-prev')}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                        key={index + 1}
                        type="button"
                        text
                        style={index + 1 === currentPage ? highlightedButtonStyle : buttonStyle}
                        className={classNames('p-paginator-page')}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button
                    text
                    icon="pi pi-angle-right"
                    style={currentPage === totalPages ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
                    className={classNames('p-paginator-next')}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                <Button
                    text
                    icon="pi pi-angle-double-right"
                    style={currentPage === totalPages ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
                    className={classNames('p-paginator-last')}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                />
            </div>
        </div>
    );
};

export default PaginationComponent;