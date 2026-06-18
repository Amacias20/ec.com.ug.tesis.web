import { DataTable, DataTableRowClickEvent } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Tooltip } from 'primereact/tooltip';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Row } from 'primereact/row';

interface ColumnOptions {
    label: string;
    value: string | number;
    [key: string]: string | number;
}

interface ColumnDefinition {
    field: string;
    header: string;
    type?: string;
    body?: (rowData: DataRow, options: ColumnBodyOptions) => React.ReactNode;
    options?: ColumnOptions[];
    placeholder?: string;
    filter?: boolean;
    dropdownOptionLabel?: string;
    dropdownOptionValue?: string;
    showIcon?: boolean;
    showButtonBar?: boolean;
    selectionMode?: 'single' | 'multiple' | 'range';
    tooltip?: string;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    frozen?: boolean;
    alignFrozen?: 'left' | 'right';
    maxLenght?: number;
    filterPlaceholder?: string;
}

interface HeaderColumn {
    header: string;
    children?: HeaderColumn[];
    headerStyle?: React.CSSProperties;
    frozen?: boolean;
    alignFrozen?: 'left' | 'right';
}

interface FooterColumn {
    field?: string;
    footer: string;
    children?: FooterColumn[];
    footerStyle?: React.CSSProperties;
    colSpan?: number;
}

interface DataRow {
    id: number;
    [key: string]: string | number | boolean | Date | Date[] | null;
}

interface GridComponentProps {
    datasource: any[];
    columns: ColumnDefinition[];
    headerColumns?: HeaderColumn[];
    footerColumns?: FooterColumn[];
    showHeader?: boolean;
    showColumnSelector?: boolean;
    showFilters?: boolean;
    showCustomHeaderText?: boolean;
    customHeaderText?: string;
    showCustomHeaderIcon?: boolean;
    customHeaderIcon?: string;
    showPaginator?: boolean;
    sortable?: boolean;
    showGridlines?: boolean;
    isLoading?: boolean;
    onRowClick?: (event: DataTableRowClickEvent) => void;
    rowClick?: boolean;
    selectionType?: 'single' | 'multiple' | 'radiobutton' | 'checkbox';
    hasColumnGroup?: boolean;
    hasColumnGroupFooter?: boolean;
    scrollable?: boolean;
    stripedRows?: boolean;
    scrollDirection?: string;
    defaultRows?: number;
    rowGroupMode?: 'subheader' | 'rowspan';
    groupRowsBy?: string;
    rest?: Record<string, unknown>;
}

const GridComponent: React.FC<GridComponentProps> = ({
    datasource,
    columns,
    headerColumns,
    footerColumns,
    showHeader = true,
    showColumnSelector = true,
    showFilters = true,
    showCustomHeaderText,
    customHeaderText,
    showCustomHeaderIcon,
    customHeaderIcon,
    showPaginator = true,
    sortable = true,
    isLoading = false,
    onRowClick = () => {},
    hasColumnGroup = false,
    hasColumnGroupFooter = false,
    scrollable = false,
    stripedRows = false,
    defaultRows = 15,
    rowGroupMode,
    groupRowsBy
}) => {
    const [data, setData] = useState<DataRow[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<ColumnDefinition[]>(columns);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(defaultRows);
    const [isLoadingState, setIsLoadingState] = useState<boolean>(isLoading);
    const [filters, setFilters] = useState<any>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        if (isLoading) {
            const dataTmp = [];
            for (let i = 0; i < 5; i++) {
                const row: DataRow = { id: i };
                columns.forEach((c) => {
                    row[c.field] = '';
                });
                dataTmp.push(row);
            }
            setData(dataTmp);
        } else {
            setData(datasource.length > 0 ? datasource : []);
        }
        setIsLoadingState(isLoading);
    }, [datasource, isLoading, columns, rows]);

    useEffect(() => {
        initFilters();
    }, [columns]);

    const initFilters = () => {
        const initialFilters: any = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
        columns.forEach((col) => {
            if (col.field !== 'actions') {
                initialFilters[col.field] = {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
                };
            }
        });
        setFilters(initialFilters);
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onColumnToggle = (event: { value: ColumnDefinition[] }) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
        setVisibleColumns(orderedSelectedColumns);
    };

    const onPageChange = (event: { first: number; rows: number }) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const findLabelByValue = (value: string | number, options: ColumnOptions[], optionValueKey: string, optionLabelKey: string) => {
        const option = options.find((opt) => String(opt[optionValueKey]) === String(value));
        return option ? option[optionLabelKey] : value;
    };

    const formatDate = (date: Date | string) => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return date;
    };

    const header = (
        <div className="flex align-items-center justify-content-between gap-2" style={{ padding: '0px 0px' }}>
            <div className="flex align-items-center gap-2">
                {showColumnSelector && (
                    <MultiSelect 
                        value={visibleColumns} 
                        options={columns} 
                        optionLabel="header" 
                        onChange={onColumnToggle} 
                        className="w-full sm:w-25rem" 
                        display="chip" 
                        filter 
                        filterIcon="pi pi-search" 
                        filterPlaceholder="Buscar columnas disponibles" 
                    />
                )}
                {showCustomHeaderIcon && <i className={customHeaderIcon} style={{ fontSize: '2.2em', marginRight: '10px', color: '#1e4d74', lineHeight: '1' }}></i>}
                {showCustomHeaderText && (
                    <span className="p-fieldset-legend-text" style={{ margin: 'auto' }}>
                        {customHeaderText}
                    </span>
                )}
            </div>
        </div>
    );

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => (
        <div className="flex justify-content-between">
            <Button type="button" icon="pi pi-filter-slash" label="Limpiar" outlined onClick={clearFilter} />
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <span className="pi pi-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Buscar..."
                    style={{ paddingLeft: '2rem' }}
                />
            </div>
        </div>
    );

    const ColumnGroupHeader = hasColumnGroup && headerColumns ? (
        <ColumnGroup>
            <Row>
                {headerColumns.map((col, index) => {
                    if (col.children) {
                        return (
                            <Column 
                                key={index}
                                header={col.header} 
                                colSpan={col.children.length} 
                                headerStyle={col.headerStyle || {}}
                                frozen={col.frozen}
                                alignFrozen={col.alignFrozen}
                            />
                        );
                    }
                    return (
                        <Column 
                            key={index}
                            header={col.header} 
                            rowSpan={2}
                            headerStyle={col.headerStyle || {}}
                            frozen={col.frozen}
                            alignFrozen={col.alignFrozen}
                        />
                    );
                })}
            </Row>
            <Row>
                {headerColumns.flatMap((col) => 
                    col.children ? col.children.map((child, childIndex) => (
                        <Column 
                            key={`${col.header}-${childIndex}`}
                            header={child.header}
                            headerStyle={child.headerStyle || {}}
                            frozen={child.frozen}
                            alignFrozen={child.alignFrozen}
                        />
                    )) : null
                )}
            </Row>
        </ColumnGroup>
    ) : null;

    const ColumnGroupFooter = hasColumnGroupFooter && footerColumns ? (
        <ColumnGroup>
            <Row>
                {footerColumns.map((col, index) => {
                    if (col.children) {
                        if (col.footer === '') {
                            return col.children.map((child, childIndex) => (
                                <Column key={`${index}-${childIndex}`} footer={child.footer} footerStyle={child.footerStyle} rowSpan={2} />
                            ));
                        } else {
                            return <Column key={index} footer={col.footer} colSpan={col.colSpan} footerStyle={col.footerStyle} />;
                        }
                    }
                    return <Column key={index} footer={col.footer} footerStyle={col.footerStyle} colSpan={1} />;
                })}
            </Row>
            <Row>
                {footerColumns.map((col, index) => {
                    if (col.children && col.footer !== '') {
                        return col.children.map((child, childIndex) => (
                            <Column key={`${index}-${childIndex}`} footer={child.footer} footerStyle={child.footerStyle} />
                        ));
                    }
                    return null;
                })}
            </Row>
        </ColumnGroup>
    ) : null;

    const paginatorLeft = (
        <div className='no-select'>
            Mostrando registros de {first + 1} al {Math.min(first + rows, datasource.length)}
        </div>
    );

    const EmptyData = () => {
        return (
            <div className='no-select' style={{ textAlign: 'center' }}>
                <h6>No se ha encontrado datos</h6>
            </div>
        );
    };

    return (
        <div>
            {columns.map((col) => col.tooltip && <Tooltip key={col.field + '-tooltip'} target={`.tooltip-header-${col.field}`} content={col.tooltip} position="top" />)}
            <DataTable
                className={`datatable-responsive ${showCustomHeaderText ? 'p-header-blue' : ''} ${hasColumnGroup ? 'p-datatable p-datatable-thead-columngroup' : ''}`}
                dataKey="id"
                value={data}
                sortMode="multiple"
                showGridlines={true}
                header={showHeader ? renderHeader() : null}
                paginator={(data?.length ?? 0) >= 10 ? showPaginator : false}
                rows={rows}
                headerColumnGroup={ColumnGroupHeader}
                footerColumnGroup={ColumnGroupFooter}
                rowsPerPageOptions={[10, 15, 20, 25, 30, 50]}
                paginatorLeft={paginatorLeft}
                emptyMessage={<EmptyData />}
                stripedRows={stripedRows}
                removableSort
                scrollable={scrollable}
                filterDisplay={showFilters ? 'menu' : undefined}
                resizableColumns={true}
                stateStorage="session"
                columnResizeMode="fit"
                style={{ borderRadius: '50px', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                onPage={onPageChange}
                first={first}
                onRowClick={onRowClick}
                rowGroupMode={rowGroupMode}
                groupRowsBy={groupRowsBy}
                filters={filters}
                globalFilterFields={columns.map(col => col.field !== 'actions' && col.field).filter(Boolean) as string[]}
                onFilter={(e) => setFilters(e.filters)}
            >
                {visibleColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={<span className={col.tooltip ? `tooltip-header-${col.field}` : ''}>{col.header}</span>}
                        filter={col.filter !== false && col.field !== 'actions'}
                        filterMatchMode={FilterMatchMode.CONTAINS}
                        sortable={sortable}
                        headerStyle={col.headerStyle || { textAlign: 'center' }}
                        showFilterMenu={showFilters}
                        body={(rowData: DataRow, options: ColumnBodyOptions) => {
                            if (isLoadingState) {
                                return <Skeleton height="2rem" />;
                            } else if (col.type === 'dropdown') {
                                const value = rowData[col.field];
                                return findLabelByValue(value !== null && value !== undefined ? String(value) : '', col.options || [], col.dropdownOptionValue || '', col.dropdownOptionLabel || '');
                            } else if (col.type === 'calendar') {
                                const value = rowData[col.field];
                                return formatDate(value instanceof Date || typeof value === 'string' ? value : '');
                            } else if (col.body) {
                                return col.body(rowData, options);
                            } else {
                                return (<div className='text-nowrap'><label>{String(rowData[col.field])}</label></div>);
                            }
                        }}
                        frozen={col.frozen}
                        alignFrozen={col.alignFrozen}
                        bodyStyle={{...col.bodyStyle }}
                    />
                ))}
            </DataTable>
        </div>
    );
};

export default GridComponent;