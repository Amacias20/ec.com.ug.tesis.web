import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import useSearch, { SearchParams, FetchDataFunction } from 'hooks/useSearch';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Calendar, CalendarViewChangeEvent } from 'primereact/calendar';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyFilterType } from 'primereact/keyfilter';
import { Capitalize } from 'utilities/StringUtils';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { addLocale } from 'primereact/api';
import moment from 'moment';

export interface FieldOption {
    label: string;
    code: string | number;
}

export interface Field {
    type: 'input' | 'dropdown' | 'calendar' | 'number' | 'multiselect' | 'inputmask' | 'checkbox';
    name: string;
    placeholder: string;
    options?: FieldOption[];
    value?: Date | null;
    onChange?: (e: CalendarViewChangeEvent) => void;
    showWeek?: boolean;
    min?: number;
    max?: number;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    showButtons?: boolean;
    width?: string;
    textAlign?: 'left' | 'right' | 'center';
    keyfilter?: string | undefined;
    selectionMode?: 'single' | 'range' | 'multiple';
    mask?: string;
    optionLabel?: string;
    optionValue?: string;
    chips?: boolean;
    showCustomCalendar?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface SearchPanelProps {
    initialSearchParams: SearchParams;
    fetchDataFunction: FetchDataFunction;
    onDataSourceChange?: (dataSource: []) => void;
    onSearchParamsChange?: (searchParams: SearchParams) => void;
    filterFields: Field[];
    customComponents?: React.ReactNode;
    isCollapsed: boolean;
    triggerFetchData?: number;
    triggerResetFilter?: number;
    disableSessionStorage?: boolean;
    autoSearch?: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ initialSearchParams, fetchDataFunction, onDataSourceChange, onSearchParamsChange, filterFields, customComponents, isCollapsed, triggerFetchData, disableSessionStorage = true, autoSearch = false }) => {
    const location = useLocation();
    const { t } = useTranslation('common');
    const storageKey = `search_params_${location.pathname}`;
    const storedParams = disableSessionStorage ? null : sessionStorage.getItem(storageKey);
    const initialParams = storedParams ? JSON.parse(storedParams) : initialSearchParams;
    const [searchParams, setSearchParams] = React.useState<SearchParams>(initialParams);
    const { handleSearch, data, executeSearch } = useSearch(searchParams, fetchDataFunction);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: unknown } }) => {
            const { name, value } = e.target;
            setSearchParams((prevParams: SearchParams) => {
                const updatedParams = { ...prevParams, [name]: value };
                if (!disableSessionStorage) {
                    sessionStorage.setItem(storageKey, JSON.stringify(updatedParams));
                }
                
                if (onSearchParamsChange) {
                    onSearchParamsChange(updatedParams);
                }
                
                return updatedParams;
            });
        },
        [storageKey, disableSessionStorage, onSearchParamsChange]
    );

    useEffect(() => {
        if (autoSearch) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerFetchData]);

    useEffect(() => {
        if (onDataSourceChange) {
            onDataSourceChange(data as []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        setSearchParams(initialParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!disableSessionStorage) {
            sessionStorage.setItem(storageKey, JSON.stringify(searchParams));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [showCustomCalendar, setShowCustomCalendar] = React.useState<Record<string, boolean>>({});
    const [dateSelections, setDateSelections] = React.useState<Record<string, string>>({});

    const dateOptions = [
        { label: t('custom'), value: 'custom' },
        { label: t('today'), value: 'today' },
        { label: t('yesterday'), value: 'yesterday' },
        { label: t('currentWeek'), value: 'currentWeek' },
        { label: t('currentMonth'), value: 'currentMonth' },
        { label: t('currentYear'), value: 'currentYear' }
    ];

    const parseDate = (dateString: string): Date | null => {
        if (!dateString) return null;
        const parsedDate = moment(dateString, 'YYYY-MM-DD', true);
        return parsedDate.isValid() ? parsedDate.toDate() : null;
    };

    const setDateValue = (startDateField: string, endDateField: string, option: string) => {
        let startDate: moment.Moment = moment().startOf('day');
        let endDate: moment.Moment = moment().endOf('day');

        switch (option) {
            case 'yesterday':
                startDate = moment().subtract(1, 'day').startOf('day');
                endDate = moment().subtract(1, 'day').endOf('day');
                break;
            case 'today':
                startDate = moment().startOf('day');
                endDate = moment().endOf('day');
                break;
            case 'currentWeek':
                startDate = moment().startOf('isoWeek');
                endDate = moment().endOf('isoWeek');
                break;
            case 'last15Days':
                startDate = moment().subtract(14, 'days').startOf('day');
                endDate = moment().endOf('day');
                break;
            case 'currentMonth':
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
                break;
            case 'currentYear':
                startDate = moment().startOf('year');
                endDate = moment().endOf('year');
                break;
        }

        handleChange({ target: { name: startDateField, value: startDate.format('YYYY-MM-DD') } });
        handleChange({ target: { name: endDateField, value: endDate.format('YYYY-MM-DD') } });
    };

    const handleDateOptionChange = (startDateField: string, endDateField: string, option: string) => {
        if (option === 'custom') {
            setShowCustomCalendar((prev) => ({ ...prev, [startDateField]: true }));
            setDateSelections((prev) => ({ ...prev, [startDateField]: option }));
        } else {
            setShowCustomCalendar((prev) => ({ ...prev, [startDateField]: false }));
            setDateSelections((prev) => ({ ...prev, [startDateField]: option }));
            setDateValue(startDateField, endDateField, option);
        }
    };

    const HandleReset = async () => {
        // Primero eliminamos los datos guardados en sessionStorage, solo si no está deshabilitado
        if (!disableSessionStorage) {
            sessionStorage.removeItem(storageKey);
        }

        // Resetea el estado
        const resetParams = { ...initialSearchParams }; // Parámetros iniciales
        setSearchParams(resetParams);

        // Ejecuta la búsqueda con los parámetros reseteados
        await executeSearch(resetParams);

        // Actualiza las selecciones de fecha para cada campo de calendario
        const newDateSelections: Record<string, string> = {};
        
        filterFields.forEach((field) => {
            if (field.type === 'calendar' && field.startDate && field.endDate) {
                const startDate = resetParams[field.startDate];
                const endDate = resetParams[field.endDate];
                
                // Determina qué opción de fecha corresponde a los valores iniciales
                if (startDate === moment().startOf('day').format('YYYY-MM-DD') && 
                    endDate === moment().endOf('day').format('YYYY-MM-DD')) {
                    newDateSelections[field.startDate] = 'today';
                    setShowCustomCalendar((prev) => ({ ...prev, [field.startDate as string]: false }));
                } else if (startDate === moment().startOf('month').format('YYYY-MM-DD') && 
                           endDate === moment().endOf('month').format('YYYY-MM-DD')) {
                    newDateSelections[field.startDate] = 'currentMonth';
                    setShowCustomCalendar((prev) => ({ ...prev, [field.startDate as string]: false }));
                } else {
                    // Para cualquier otro caso, establece la opción adecuada
                    newDateSelections[field.startDate] = 'today'; // Por defecto, usa 'today'
                    
                    // Actualiza los valores a "hoy"
                    handleChange({ target: { name: field.startDate, value: moment().startOf('day').format('YYYY-MM-DD') } });
                    handleChange({ target: { name: field.endDate, value: moment().endOf('day').format('YYYY-MM-DD') } });
                    setShowCustomCalendar((prev) => ({ ...prev, [field.startDate as string]: false }));
                }
            }
        });
        
        setDateSelections(newDateSelections);
    };

    // Estilo común para los labels
    const labelStyle = {
        fontSize: '12px',
        marginBottom: '0.25rem',
        display: 'block'
    };

    const [isMobileView, setIsMobileView] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 625);
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Verificar el tamaño inicial
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Inicializar dateSelections basado en los valores iniciales
    useEffect(() => {
        const newDateSelections: Record<string, string> = {};
        
        filterFields.forEach((field) => {
            if (field.type === 'calendar' && field.startDate && field.endDate) {
                // Verificar si hay fechas iniciales que coincidan con alguna opción predefinida
                const startDate = searchParams[field.startDate];
                const endDate = searchParams[field.endDate];
                
                if (startDate && endDate) {                    
                    if (startDate === moment().startOf('day').format('YYYY-MM-DD') && 
                        endDate === moment().endOf('day').format('YYYY-MM-DD')) {
                        newDateSelections[field.startDate] = 'today';
                    } else if (startDate === moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD') && 
                               endDate === moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD')) {
                        newDateSelections[field.startDate] = 'yesterday';
                    } else if (startDate === moment().startOf('isoWeek').format('YYYY-MM-DD') && 
                               endDate === moment().endOf('isoWeek').format('YYYY-MM-DD')) {
                        newDateSelections[field.startDate] = 'currentWeek';
                    } else if (startDate === moment().startOf('month').format('YYYY-MM-DD') && 
                               endDate === moment().endOf('month').format('YYYY-MM-DD')) {
                        newDateSelections[field.startDate] = 'currentMonth';
                    } else if (startDate === moment().startOf('year').format('YYYY-MM-DD') && 
                               endDate === moment().endOf('year').format('YYYY-MM-DD')) {
                        newDateSelections[field.startDate] = 'currentYear';
                    } else {
                        newDateSelections[field.startDate] = 'custom';
                        setShowCustomCalendar((prev) => ({ ...prev, [field.startDate as string]: true }));
                    }
                }
            }
        });
        
        setDateSelections(newDateSelections);
    }, [filterFields, searchParams]);

    useEffect(() => {
        addLocale('es', {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Limpiar'
        });
    }, []);

    return (
        <div className={`search-panel ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <div className="flex flex-content-center">
                <div className="flex-1">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-start', paddingTop: '10px' }}>
                        {filterFields.map((field, index) => (
                            <React.Fragment key={index}>
                                <div style={{ 
                                    width: isMobileView ? '100%' : 'auto'
                                }}>
                                    {field.type === 'input' && (
                                        <div>
                                            <label htmlFor={field.name} style={labelStyle}>
                                                {field.placeholder}
                                            </label>
                                            <InputText
                                                style={{ 
                                                    width: isMobileView ? '100%' : (field.width ?? '200px'), 
                                                    textAlign: field.textAlign ?? 'left',
                                                    height: '2.6rem'
                                                }}
                                                keyfilter={field.keyfilter as KeyFilterType}
                                                id={field.name}
                                                name={field.name}
                                                value={searchParams[field.name]}
                                                onChange={handleChange}
                                                autoComplete="off"
                                            />
                                        </div>
                                    )}
                                    {field.type === 'dropdown' && (
                                        <div>
                                            <label htmlFor={field.name} style={labelStyle}>
                                                {field.placeholder}
                                            </label>
                                            <Dropdown
                                                style={{ 
                                                    width: isMobileView ? '100%' : (field.width ?? '175px'),
                                                    height: '2.6rem'
                                                }}
                                                id={field.name}
                                                options={field.options}
                                                value={searchParams[field.name]}
                                                onChange={(e: DropdownChangeEvent) => handleChange({ target: { name: field.name, value: e.value } })}
                                                optionLabel="label"
                                                optionValue="code"
                                                showClear={true}
                                                filter={field.options && field.options.length > 5}
                                            />
                                        </div>
                                    )}
                                    {field.type === 'calendar' && (
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '10px',
                                            flexDirection: isMobileView ? 'column' : 'row',
                                            width: isMobileView ? '100%' : 'auto'
                                        }}>
                                            <div style={{ width: isMobileView ? '100%' : 'auto' }}>
                                                <label htmlFor={`${field.startDate}-dropdown`} style={labelStyle}>
                                                    {field.placeholder}
                                                </label>
                                                <Dropdown
                                                    id={`${field.startDate}-dropdown`}
                                                    options={dateOptions}
                                                    value={dateSelections[field.startDate as string] || undefined}
                                                    onChange={(e: DropdownChangeEvent) => {
                                                        handleDateOptionChange(field.startDate ?? '', field.endDate ?? '', e.value);
                                                    }}
                                                    style={{ 
                                                        width: isMobileView ? '100%' : (field.width ?? '175px'),
                                                        height: '2.6rem'
                                                    }}
                                                    scrollHeight="500px"
                                                    placeholder={t('selectOption')}
                                                />
                                            </div>
                                            {field.startDate && showCustomCalendar[field.startDate] && (
                                                <div>
                                                    <label htmlFor={field.startDate} style={labelStyle}>
                                                        {t('customDate')}
                                                    </label>
                                                    <Calendar
                                                        id={field.startDate}
                                                        value={
                                                            [parseDate(searchParams[field.startDate as keyof typeof searchParams]), 
                                                            parseDate(searchParams[field.endDate as keyof typeof searchParams])]
                                                            .filter(Boolean) as [Date, Date] | undefined
                                                        }
                                                        dateFormat="yy-mm-dd"
                                                        selectionMode="range"
                                                        showIcon
                                                        showWeek={field.showWeek}
                                                        locale="es"
                                                        // firstDayOfWeek={1}
                                                        showButtonBar={true}
                                                        style={{ 
                                                            width: isMobileView ? '100%' : (field.width ?? '230px'),
                                                            height: '2.6rem'
                                                        }}
                                                        touchUI={isMobileView}
                                                        numberOfMonths={2}
                                                        onChange={(e) => {
                                                            if (Array.isArray(e.value) && e.value.length === 2) {
                                                                const [startDate, endDate] = e.value;
                                                                // Formatear las fechas a YYYY-MM-DD
                                                                const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
                                                                const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
                                                                
                                                                // Actualizar los valores en searchParams
                                                                handleChange({ target: { name: field.startDate as string, value: formattedStartDate } });
                                                                handleChange({ target: { name: field.endDate as string, value: formattedEndDate } });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {field.type === 'number' && (
                                        <div>
                                            <label htmlFor={field.name} style={labelStyle}>
                                                {field.placeholder}
                                            </label>
                                            <InputNumber
                                                id={field.name}
                                                name={field.name}
                                                min={field.min ?? 0}
                                                max={field.max ?? 100}
                                                minFractionDigits={field.minFractionDigits ?? 0}
                                                maxFractionDigits={field.maxFractionDigits ?? 0}
                                                value={searchParams[field.name]}
                                                onValueChange={(e: InputNumberValueChangeEvent) => handleChange({ target: { name: field.name, value: e.value } })}
                                                locale="es-ES"
                                                showButtons={field.showButtons ?? false}
                                                inputStyle={{ width: field.width ?? '100px', maxWidth: '25rem', textAlign: field.textAlign ?? 'left' }}
                                            />
                                        </div>
                                    )}
                                    {field.type === 'multiselect' && (
                                        <div>
                                            <label htmlFor={field.name} style={labelStyle}>
                                                {field.placeholder}
                                            </label>
                                            <MultiSelect
                                                id={field.name}
                                                options={field.options}
                                                value={Array.isArray(searchParams[field.name]) ? searchParams[field.name] : (searchParams[field.name] ? [searchParams[field.name]] : [])}
                                                onChange={(e: MultiSelectChangeEvent) => handleChange({ target: { name: field.name, value: e.value } })}
                                                optionLabel={field.optionLabel}
                                                optionValue={field.optionValue}
                                                showClear={false}
                                                filter={field.options && field.options.length > 5}
                                                display={field.chips ? 'chip' : undefined}
                                                resetFilterOnHide={true}
                                                emptyFilterMessage={t('noResultsFound')}
                                                filterPlaceholder={t('search')}
                                                style={{ 
                                                    width: isMobileView ? '100%' : (field.width ?? '200px'), 
                                                    maxWidth: '35rem',
                                                    height: '2.6rem'
                                                }}
                                                selectAll={true}
                                            />
                                        </div>
                                    )}
                                    {field.type === 'inputmask' && (
                                        <div>
                                            <label htmlFor={field.name} style={labelStyle}>
                                                {field.placeholder}
                                            </label>
                                            <InputMask
                                                id={field.name}
                                                name={field.name}
                                                value={searchParams[field.name]}
                                                onChange={(e: InputMaskChangeEvent) => handleChange({ target: { name: field.name, value: e.value } })}
                                                mask={field.mask}
                                                autoComplete="off"
                                                autoCorrect="false"
                                                autoCapitalize="false"
                                                autoClear={false}
                                                unmask={true}
                                                style={{ width: isMobileView ? '100%' : (field.width ?? '175px'), textAlign: 'left' }}
                                            />
                                        </div>
                                    )}
                                    {field.type === 'checkbox' && (
                                        <div
                                            className="flex align-items-center"
                                            style={{
                                                cursor: 'pointer',
                                                marginTop: '2rem'
                                            }}
                                        >
                                            <Checkbox id={field.name} name={field.name} checked={!!searchParams[field.name]} onChange={(e: CheckboxChangeEvent) => handleChange({ target: { name: field.name, value: e.checked } })} />
                                            <label
                                                htmlFor={field.name}
                                                className="ml-2"
                                                style={{
                                                    cursor: 'pointer',
                                                    margin: 0,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {Capitalize(field.placeholder)}
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                        {customComponents}
                        <div className="flex align-items-start" style={{ 
                            gap: '0.4rem', 
                            marginTop: '1.25rem',
                            width: isMobileView ? '100%' : 'auto'
                        }}>
                            <Button
                                style={{ 
                                    height: '2.6rem', 
                                    width: isMobileView ? '100%' : 'none',
                                    backgroundColor: '#475569',
                                    borderColor: '#475569'
                                }}
                                label={t('search')}
                                icon="pi pi-search"
                                className="mr-2"
                                onClick={handleSearch}
                            />
                            <Button
                                style={{ 
                                    height: '2.6rem', 
                                    width: isMobileView ? '100%' : 'none',
                                    borderColor: '#475569',
                                    color: '#475569'
                                }}
                                label={t('clear')}
                                icon="pi pi-eraser"
                                outlined
                                onClick={async () => {
                                    await HandleReset();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPanel;