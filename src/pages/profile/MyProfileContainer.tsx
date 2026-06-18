import { UpdateUserBody } from 'services/security/interfaces/UserInterface';
import ProfileBackground from '/layout/images/pages/accessDenied-bg.jpg';
import { UpdateUser } from 'services/security/endpoints/UserService';
import { ToastSuccess, ToastError } from 'components/Messages/Toast';
import ProfileEmpty from '../../styles/images/ProfileEmpty.jpg';
import AvatarUploader from 'components/Misc/AvatarUploader';
import React, { useState, useEffect, JSX } from 'react';
import AppBreadCrumb from 'layout/AppBreadCrumb';
import InformationData from './InformationData';
import { ErrorHandler } from 'constants/Global';
import { useTranslation } from 'react-i18next';
import { MenuItem } from 'primereact/menuitem';
import { IMAGE_VISOR } from 'services/Paths';
import { TabMenu } from 'primereact/tabmenu';
import { GetUser } from 'constants/Global';
import SystemStyle from './SystemStyle';
import Security from './Security';

const MyProfile: React.FC = () => {
    const { t, i18n } = useTranslation('myProfile');
    const user = GetUser();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const image: string = user.imageDisplayId ? `${IMAGE_VISOR}/${user.imageDisplayId}` : ProfileEmpty;
    
    const [profileImage, setProfileImage] = useState<string>(image);
    const [fileBase64, setFileBase64] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [isUpdatingImage, setIsUpdatingImage] = useState<boolean>(false);

    useEffect(() => {
        const handleLanguageChange = () => {
            setCurrentLanguage(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [currentLanguage, i18n]);

    const TabItems: MenuItem[] = [
        { label: t('personalInfo'), icon: 'pi pi-user' },
        { label: t('security'), icon: 'pi pi-lock' },
        { label: t('systemStyle'), icon: 'pi pi-cog' }
    ];

    const getCurrentTabContent = (): JSX.Element => {
        switch (activeIndex) {
            case 0:
                return <InformationData />;
            case 1:
                return <Security />;
            case 2:
                return <SystemStyle />;
            default:
                return <div>{t('tabNotFound')}</div>;
        }
    };

    const saveProfileImage = async () => {
        if (!fileBase64 || !fileName) return;
        
        setIsUpdatingImage(true);
        try {
            const updateBody: UpdateUserBody = {
                firstNames: user.firstNames,
                lastNames: user.lastNames,
                email: user.email,
                phone: user.phone,
                nickname: user.nickname,
                enabledTwoFA: user.enabledTwoFA,
                NotifyLogin: user.notifyLogin,
                IsSystemUser: user.isSystemUser,
                file: fileBase64,
                fileName: fileName
            };
            
            await UpdateUser(user.idUser, updateBody);
                        
            ToastSuccess(t('profileImageUpdated'));
            setFileBase64('');
            setFileName('');
        } catch (error) {
            ToastError(await ErrorHandler(error));
        } finally {
            setIsUpdatingImage(false);
        }
    };

    useEffect(() => {
        if (fileBase64 && fileName) {
            saveProfileImage();
        }
    }, [fileBase64, fileName]);

    return (
        <div>
            <AppBreadCrumb></AppBreadCrumb>
            <div className="layout-content">
                <div className="w-full flex flex-column" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
                    <div className="flex-grow-1">
                        <div className="grid m-0">
                            <div className="col-12 p-0">
                                <div
                                    className="flex align-items-center flex-column md:flex-row justify-content-center"
                                    style={{
                                        width: '100%',
                                        padding: '2rem 1rem',
                                        backgroundImage: `url(${ProfileBackground})`,
                                        backgroundSize: 'cover',
                                        minHeight: '300px'
                                    }}
                                >
                                    <AvatarUploader
                                        profileImage={profileImage}
                                        setProfileImage={setProfileImage}
                                        setFileBase64={setFileBase64}
                                        setFileName={setFileName}
                                        disabled={isUpdatingImage}
                                    />
                                    <div className="text-center md:text-left" style={{ color: 'white', marginLeft: window.innerWidth > 768 ? '20px' : '0px', marginTop: window.innerWidth <= 768 ? '20px' : '0px' }}>
                                        <span className="block text-3xl md:text-6xl font-bold mb-2">
                                            {user.firstNames + ' ' + user.lastNames}
                                        </span>
                                    </div>
                                </div>
                                <TabMenu
                                    model={TabItems}
                                    activeIndex={activeIndex}
                                    onTabChange={(e) => setActiveIndex(e.index)}
                                    style={{
                                        fontSize: window.innerWidth > 768 ? '1em' : '0.9em',
                                        padding: '10px'
                                    }}
                                />
                                <div className="px-2 md:px-4">
                                    {getCurrentTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;