import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const icons: string[] = [
    'pi pi-address-book', 'pi pi-align-center', 'pi pi-align-justify', 'pi pi-align-left',
    'pi pi-align-right', 'pi pi-amazon', 'pi pi-android', 'pi pi-angle-double-down',
    'pi pi-angle-double-left', 'pi pi-angle-double-right', 'pi pi-angle-double-up',
    'pi pi-angle-down', 'pi pi-angle-left', 'pi pi-angle-right', 'pi pi-angle-up',
    'pi pi-apple', 'pi pi-arrow-circle-down', 'pi pi-arrow-circle-left', 'pi pi-arrow-circle-right',
    'pi pi-arrow-circle-up', 'pi pi-arrow-down', 'pi pi-arrow-down-left',
    'pi pi-arrow-down-left-and-arrow-up-right-to-center', 'pi pi-arrow-down-right',
    'pi pi-arrow-left', 'pi pi-arrow-right', 'pi pi-arrow-right-arrow-left', 'pi pi-arrow-up',
    'pi pi-arrow-up-left', 'pi pi-arrow-up-right', 'pi pi-arrow-up-right-and-arrow-down-left-from-center',
    'pi pi-arrows-alt', 'pi pi-arrows-h', 'pi pi-arrows-v', 'pi pi-asterisk', 'pi pi-at',
    'pi pi-backward', 'pi pi-ban', 'pi pi-barcode', 'pi pi-bars', 'pi pi-bell',
    'pi pi-bell-slash', 'pi pi-bitcoin', 'pi pi-bolt', 'pi pi-book', 'pi pi-bookmark',
    'pi pi-bookmark-fill', 'pi pi-box', 'pi pi-briefcase', 'pi pi-building', 'pi pi-building-columns',
    'pi pi-bullseye', 'pi pi-calculator', 'pi pi-calendar', 'pi pi-calendar-clock', 'pi pi-calendar-minus',
    'pi pi-calendar-plus', 'pi pi-calendar-times', 'pi pi-camera', 'pi pi-car', 'pi pi-caret-down',
    'pi pi-caret-left', 'pi pi-caret-right', 'pi pi-caret-up', 'pi pi-cart-arrow-down',
    'pi pi-cart-minus', 'pi pi-cart-plus', 'pi pi-chart-bar', 'pi pi-chart-line', 'pi pi-chart-pie',
    'pi pi-chart-scatter', 'pi pi-check', 'pi pi-check-circle', 'pi pi-check-square',
    'pi pi-chevron-circle-down', 'pi pi-chevron-circle-left', 'pi pi-chevron-circle-right',
    'pi pi-chevron-circle-up', 'pi pi-chevron-down', 'pi pi-chevron-left', 'pi pi-chevron-right',
    'pi pi-chevron-up', 'pi pi-circle', 'pi pi-circle-fill', 'pi pi-clipboard', 'pi pi-clock',
    'pi pi-clone', 'pi pi-cloud', 'pi pi-cloud-download', 'pi pi-cloud-upload', 'pi pi-code',
    'pi pi-cog', 'pi pi-comment', 'pi pi-comments', 'pi pi-compass', 'pi pi-copy', 'pi pi-credit-card',
    'pi pi-crown', 'pi pi-database', 'pi pi-delete-left', 'pi pi-desktop', 'pi pi-directions',
    'pi pi-directions-alt', 'pi pi-discord', 'pi pi-dollar', 'pi pi-download', 'pi pi-eject',
    'pi pi-ellipsis-h', 'pi pi-ellipsis-v', 'pi pi-envelope', 'pi pi-equals', 'pi pi-eraser',
    'pi pi-ethereum', 'pi pi-euro', 'pi pi-exclamation-circle', 'pi pi-exclamation-triangle',
    'pi pi-expand', 'pi pi-external-link', 'pi pi-eye', 'pi pi-eye-slash', 'pi pi-face-smile',
    'pi pi-facebook', 'pi pi-fast-backward', 'pi pi-fast-forward', 'pi pi-file', 'pi pi-file-arrow-up',
    'pi pi-file-check', 'pi pi-file-edit', 'pi pi-file-excel', 'pi pi-file-export', 'pi pi-file-import',
    'pi pi-file-pdf', 'pi pi-file-plus', 'pi pi-file-word', 'pi pi-filter', 'pi pi-filter-fill',
    'pi pi-filter-slash', 'pi pi-flag', 'pi pi-flag-fill', 'pi pi-folder', 'pi pi-folder-open',
    'pi pi-folder-plus', 'pi pi-forward', 'pi pi-gauge', 'pi pi-gift', 'pi pi-github', 'pi pi-globe',
    'pi pi-google', 'pi pi-graduation-cap', 'pi pi-hammer', 'pi pi-hashtag', 'pi pi-headphones',
    'pi pi-heart', 'pi pi-heart-fill', 'pi pi-history', 'pi pi-home', 'pi pi-hourglass', 'pi pi-id-card',
    'pi pi-image', 'pi pi-images', 'pi pi-inbox', 'pi pi-indian-rupee', 'pi pi-info', 'pi pi-info-circle',
    'pi pi-instagram', 'pi pi-key', 'pi pi-language', 'pi pi-lightbulb', 'pi pi-link', 'pi pi-linkedin',
    'pi pi-list', 'pi pi-list-check', 'pi pi-lock', 'pi pi-lock-open', 'pi pi-map', 'pi pi-map-marker',
    'pi pi-mars', 'pi pi-megaphone', 'pi pi-microchip', 'pi pi-microchip-ai', 'pi pi-microphone',
    'pi pi-microsoft', 'pi pi-minus', 'pi pi-minus-circle', 'pi pi-mobile', 'pi pi-money-bill',
    'pi pi-moon', 'pi pi-objects-column', 'pi pi-palette', 'pi pi-paperclip', 'pi pi-pause',
    'pi pi-pause-circle', 'pi pi-paypal', 'pi pi-pen-to-square', 'pi pi-pencil', 'pi pi-percentage',
    'pi pi-phone', 'pi pi-pinterest', 'pi pi-play', 'pi pi-play-circle', 'pi pi-plus', 'pi pi-plus-circle',
    'pi pi-pound', 'pi pi-power-off', 'pi pi-prime', 'pi pi-print', 'pi pi-qrcode', 'pi pi-question',
    'pi pi-question-circle', 'pi pi-receipt', 'pi pi-reddit', 'pi pi-refresh', 'pi pi-replay',
    'pi pi-reply', 'pi pi-save', 'pi pi-search', 'pi pi-search-minus', 'pi pi-search-plus', 'pi pi-send',
    'pi pi-server', 'pi pi-share-alt', 'pi pi-shield', 'pi pi-shop', 'pi pi-shopping-bag',
    'pi pi-shopping-cart', 'pi pi-sign-in', 'pi pi-sign-out', 'pi pi-sitemap', 'pi pi-slack',
    'pi pi-sliders-h', 'pi pi-sliders-v', 'pi pi-sort', 'pi pi-sort-alpha-down', 'pi pi-sort-alpha-down-alt',
    'pi pi-sort-alpha-up', 'pi pi-sort-alpha-up-alt', 'pi pi-sort-alt', 'pi pi-sort-alt-slash',
    'pi pi-sort-amount-down', 'pi pi-sort-amount-down-alt', 'pi pi-sort-amount-up',
    'pi pi-sort-amount-up-alt', 'pi pi-sort-down', 'pi pi-sort-down-fill', 'pi pi-sort-numeric-down',
    'pi pi-sort-numeric-down-alt', 'pi pi-sort-numeric-up', 'pi pi-sort-numeric-up-alt', 'pi pi-sort-up',
    'pi pi-sort-up-fill', 'pi pi-sparkles', 'pi pi-spinner', 'pi pi-spinner-dotted', 'pi pi-star',
    'pi pi-star-fill', 'pi pi-star-half', 'pi pi-star-half-fill', 'pi pi-step-backward',
    'pi pi-step-backward-alt', 'pi pi-step-forward', 'pi pi-step-forward-alt', 'pi pi-stop',
    'pi pi-stop-circle', 'pi pi-stopwatch', 'pi pi-sun', 'pi pi-sync', 'pi pi-table', 'pi pi-tablet',
    'pi pi-tag', 'pi pi-tags', 'pi pi-telegram', 'pi pi-th-large', 'pi pi-thumbs-down',
    'pi pi-thumbs-down-fill', 'pi pi-thumbs-up', 'pi pi-thumbs-up-fill', 'pi pi-thumbtack', 'pi pi-ticket',
    'pi pi-tiktok', 'pi pi-times', 'pi pi-times-circle', 'pi pi-trash', 'pi pi-trophy', 'pi pi-truck',
    'pi pi-turkish-lira', 'pi pi-twitch', 'pi pi-twitter', 'pi pi-undo', 'pi pi-unlock', 'pi pi-upload',
    'pi pi-user', 'pi pi-user-edit', 'pi pi-user-minus', 'pi pi-user-plus', 'pi pi-users', 'pi pi-venus',
    'pi pi-verified', 'pi pi-video', 'pi pi-vimeo', 'pi pi-volume-down', 'pi pi-volume-off',
    'pi pi-volume-up', 'pi pi-wallet', 'pi pi-warehouse', 'pi pi-wave-pulse', 'pi pi-whatsapp',
    'pi pi-wifi', 'pi pi-window-maximize', 'pi pi-window-minimize', 'pi pi-wrench', 'pi pi-youtube'
];

interface IconSelectorProps {
    icon: string;
    visible: boolean;
    onHide: () => void;
    onSelectIcon: (icon: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ icon, visible, onHide, onSelectIcon }) => {
    const [filter, setFilter] = useState<string>('');
    const [customIcon, setCustomIcon] = useState<string>('');
    const [selectedIcon, setSelectedIcon] = useState<string>('');

    const filteredIcons = icons.filter(icon => icon.includes(filter));

    const handleIconClick = (icon: string) => {
        setSelectedIcon(icon);
        setCustomIcon('');
    };

    const handleSubmit = () => {
        const finalIcon = customIcon.trim() || selectedIcon || icon;
        onSelectIcon(finalIcon);
    };

    const footer = (
        <div style={{ textAlign: 'center', marginTop: '0px' }}>
            <Button
                label="Guardar"
                type='submit'
                icon='pi pi-save'
                style={{ backgroundColor: '#183d5b', borderColor: '#183d5b' }}
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            />
            <Button
                label="Cancelar"
                icon="pi pi-times"
                severity="secondary"
                outlined
                onClick={onHide}
            />
        </div>
    );

    return (
        <Dialog
            draggable={false}
            modal
            visible={visible}
            style={{
                width: '50vw',
                maxWidth: '900px',
                overflow: 'visible',
                position: 'relative',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
            contentStyle={{ paddingBottom: '0px' }}
            header={
                <div className='no-select' style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Seleccionar icono del modulo</span>
                    <i className={icon} style={{ fontSize: '1.5rem', color: 'white', marginRight: '10px' }}></i>
                </div>
            }
            headerStyle={{ color: '#183d5b', paddingBottom: '5px', borderBottom: '1px solid #dadcde' }}
            footer={footer}
            onHide={onHide}
        >
            <div style={{ padding: '10px' }}>
                <div className="p-inputgroup">
                    <InputText placeholder="Buscar icono de prime" value={filter} onChange={(e) => setFilter(e.target.value)} />
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                </div>
                <div className="grid text-center" style={{ marginTop: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredIcons.map(icon => (
                        <div
                            key={icon}
                            className={`col-12 md:col-2 mb-5 ${selectedIcon === icon ? 'selected-icon' : ''}`}
                            style={{ cursor: 'pointer', border: selectedIcon === icon ? '2px solid #183d5b' : 'none', borderRadius: '4px' }}
                            onClick={() => handleIconClick(icon)}
                        >
                            <i className={`text-2xl mb-3 text-color-secondary ${icon}`}></i>
                            <div>{icon}</div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ marginRight: '10px', fontWeight: 'bold' }}>No encuentras el icono que necesitas? Escribe la clase:</span>
                    <InputText
                        placeholder="Clase del icono"
                        value={customIcon}
                        onChange={(e) => setCustomIcon(e.target.value)}
                        style={{ width: '200px' }}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default IconSelector;
