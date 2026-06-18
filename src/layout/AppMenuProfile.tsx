import React, { useContext, useRef, useState, useEffect } from 'react';
import EmptyProfile from 'styles/images/ProfileEmpty.jpg';
import { LayoutContext } from './context/layoutcontext';
import { GetUser, Logout } from 'constants/Global';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { IMAGE_VISOR } from 'services/Paths';
import { Avatar } from 'primereact/avatar';

const AppMenuProfile = () => {
    const { layoutState, layoutConfig, isSlim, isHorizontal, onMenuProfileToggle } = useContext(LayoutContext);
    const navigate = useNavigate();
    const ulRef = useRef<HTMLUListElement | null>(null);
    const { t } = useTranslation(['common']);
    const user = GetUser();
    const [image, setImage] = useState<string>(EmptyProfile);

    const hiddenClassName = classNames({ hidden: layoutConfig.menuMode === 'drawer' && !layoutState.sidebarActive });

    useEffect(() => {
        if (user && user.idUser) {
            setImage(user.imageDisplayId ? `${IMAGE_VISOR}/${user.imageDisplayId}` : EmptyProfile);
        }
    }, [user]);

    const toggleMenu = () => {
        if (layoutState.menuProfileActive) {
            setTimeout(() => {
                (ulRef.current as HTMLUListElement).style.maxHeight = '0';
            }, 1);
            (ulRef.current as HTMLUListElement).style.opacity = '0';
            if (isHorizontal()) {
                (ulRef.current as HTMLUListElement).style.transform = 'scaleY(0.8)';
            }
        } else {
            setTimeout(() => {
                (ulRef.current as HTMLUListElement).style.maxHeight = (ulRef.current as HTMLUListElement).scrollHeight.toString() + 'px';
            }, 1);
            (ulRef.current as HTMLUListElement).style.opacity = '1';
            if (isHorizontal()) {
                (ulRef.current as HTMLUListElement).style.transform = 'scaleY(1)';
            }
        }
        onMenuProfileToggle();
    };

    const tooltipValue = (tooltipText: string) => {
        return isSlim() ? tooltipText : null;
    };

    const handleLogout = () => {
        Logout();
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    return (
        <React.Fragment>
            <div className="layout-menu-profile">
                <Tooltip target={'.avatar-button'} content={tooltipValue(t('common:myProfile')) as string} />
                <button className="avatar-button p-link" onClick={toggleMenu}>
                    <Avatar image={image} shape="circle" style={{ width: '32px', height: '32px' }} />
                    <span>
                        <strong>{user?.nickname || 'Usuario'}</strong>
                    </span>
                    <i
                        className={classNames('layout-menu-profile-toggler pi pi-fw', {
                            'pi-angle-down': layoutConfig.menuProfilePosition === 'start' || isHorizontal(),
                            'pi-angle-up': layoutConfig.menuProfilePosition === 'end' && !isHorizontal()
                        })}
                    ></i>
                </button>

                <ul
                    ref={ulRef}
                    className={classNames('menu-transition', { overlay: isHorizontal() })}
                    style={{ overflow: 'hidden', maxHeight: 0, opacity: 0 }}
                >
                    {layoutState.menuProfileActive && (
                        <>
                            <li>
                                <button className="p-link" onClick={handleProfile}>
                                    <i className="pi pi-user pi-fw"></i>
                                    <span className={hiddenClassName}>{t('common:myProfile')}</span>
                                </button>
                            </li>
                            <li>
                                <button className="p-link" onClick={handleLogout}>
                                    <i className="pi pi-sign-out pi-fw"></i>
                                    <span className={hiddenClassName}>{t('common:logout')}</span>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </React.Fragment>
    );
};

export default AppMenuProfile;