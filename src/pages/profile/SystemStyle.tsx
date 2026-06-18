import { PostUserProfile } from 'services/security/endpoints/UserProfileService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import React, { useContext, useEffect } from 'react';
import { PrimeReactContext } from 'primereact/api';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { GetUser } from 'constants/Global';

const SystemStyle: React.FC = () => {
  const { t } = useTranslation('systemStyle');
  const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
  const { setRipple, changeTheme } = useContext(PrimeReactContext);
  const scales = [12, 13, 14, 15, 16];
  const user = GetUser();

  // ---- helpers de estilo (mismo diseño que antes) ----
  const enhancedCardStyle: React.CSSProperties = {
    borderRadius: '16px',
    padding: 0,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: '1px solid #eef0f3'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'linear-gradient(180deg,#fff7f0 0%, #ffffff 100%)',
    borderBottom: '1px solid #f1f3f5'
  };

  const iconCircle = (size = 44): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0e6'
  });

  // ---- lógica ----
  const saveConfig = async (config: any) => {
    localStorage.setItem('layoutConfig', JSON.stringify(config));
    document.dispatchEvent(new Event('localStorageChange'));

    if (user && user.idUser) {
      try {
        const currentLang = localStorage.getItem('i18nextLng') || 'es';
        const payload = {
          userId: user.idUser,
          darkMode: config.colorScheme === 'dark',
          menuMode: config.menuMode,
          layoutScale: config.scale,
          menuTheme: config.menuTheme,
          topbarTheme: config.colorScheme,
          componentTheme: config.inputStyle,
          lang: currentLang
        };
        await PostUserProfile(payload);
      } catch (error) {
        console.error('Error al guardar la configuración en el servidor:', error);
      }
    }
  };

  const changeColorScheme = (colorScheme: 'light' | 'dark') => {
    changeTheme(layoutConfig.colorScheme, colorScheme, 'theme-link', () => {
      const newConfig = {
        ...layoutConfig,
        colorScheme,
        menuTheme: colorScheme === 'dark' ? 'dark' : 'light'
      };
      setLayoutConfig(newConfig);
      saveConfig(newConfig);
    });
  };

  const changeMenuMode = (e: any) => {
    const newConfig = { ...layoutConfig, menuMode: e.value };
    setLayoutConfig(newConfig);
    saveConfig(newConfig);
  };

  const changeInputStyle = (e: any) => {
    const newConfig = { ...layoutConfig, inputStyle: e.value };
    setLayoutConfig(newConfig);
    saveConfig(newConfig);
  };

  const changeRipple = (e: any) => {
    setRipple(e.value);
    const newConfig = { ...layoutConfig, ripple: e.value };
    setLayoutConfig(newConfig);
    saveConfig(newConfig);
  };

  const decrementScale = () => {
    const newConfig = { ...layoutConfig, scale: layoutConfig.scale - 1 };
    setLayoutConfig(newConfig);
    saveConfig(newConfig);
  };

  const incrementScale = () => {
    const newConfig = { ...layoutConfig, scale: layoutConfig.scale + 1 };
    setLayoutConfig(newConfig);
    saveConfig(newConfig);
  };

  useEffect(() => {
    document.documentElement.style.fontSize = layoutConfig.scale + 'px';
  }, [layoutConfig.scale]);

  return (
    <div className="grid">
      <div className="col-12 mb-4">
        <h1 className="text-3xl font-bold text-primary diligentec-text-orange">{t('systemStyle')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666666' }}>{t('systemStyleDescription')}</p>
      </div>

      {/* Color scheme */}
      <div className="col-12 sm:col-6 lg:col-3 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-palette" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <h2 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('colorScheme')}</h2>
          </div>

          <div style={{ padding: 20 }}>
            <div className="flex">
              <div className="flex align-items-center mr-4">
                <RadioButton
                  id="light"
                  name="darkMenu"
                  value="light"
                  checked={layoutConfig.colorScheme === 'light'}
                  onChange={(e) => changeColorScheme(e.value)}
                />
                <label htmlFor="light" className="ml-2 font-medium">{t('light')}</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  id="dark"
                  name="darkMenu"
                  value="dark"
                  checked={layoutConfig.colorScheme === 'dark'}
                  onChange={(e) => changeColorScheme(e.value)}
                />
                <label htmlFor="dark" className="ml-2 font-medium">{t('dark')}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input style */}
      <div className="col-12 sm:col-6 lg:col-3 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-pencil" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <h2 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('inputStyle')}</h2>
          </div>

          <div style={{ padding: 20 }}>
            <div className="flex">
              <div className="flex align-items-center mr-4">
                <RadioButton
                  name="inputStyle"
                  value="outlined"
                  checked={layoutConfig.inputStyle === 'outlined'}
                  onChange={(e) => changeInputStyle(e)}
                  inputId="outlined_input"
                />
                <label htmlFor="outlined_input" className="ml-2 font-medium">{t('outlined')}</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  name="inputStyle"
                  value="filled"
                  checked={layoutConfig.inputStyle === 'filled'}
                  onChange={(e) => changeInputStyle(e)}
                  inputId="filled_input"
                />
                <label htmlFor="filled_input" className="ml-2 font-medium">{t('filled')}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ripple */}
      <div className="col-12 sm:col-6 lg:col-3 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-sliders-h" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <h2 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('rippleEffect')}</h2>
          </div>

        <div style={{ padding: 20 }}>
            <div className="flex align-items-center">
              <InputSwitch checked={layoutConfig.ripple} onChange={changeRipple} />
              <span className="ml-3 font-medium">
                {layoutConfig.ripple ? t('enabled') : t('disabled')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="col-12 sm:col-6 lg:col-3 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-text-height" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <h2 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('themeScale')}</h2>
          </div>

          <div style={{ padding: 20 }}>
            <div className="flex align-items-center">
              <Button
                icon="pi pi-minus"
                type="button"
                onClick={decrementScale}
                className="w-2rem h-2rem mr-2"
                rounded
                text
                disabled={layoutConfig.scale === scales[0]}
              />
              <div className="flex gap-2 align-items-center">
                {scales.map((s, i) => (
                  <i
                    key={i}
                    className={`pi ${s === layoutConfig.scale
                      ? 'pi-circle-fill text-primary diligentec-text-orange'
                      : 'pi-circle text-500'}`}
                    style={{ fontSize: '1.2rem' }}
                  />
                ))}
              </div>
              <Button
                icon="pi pi-plus"
                type="button"
                onClick={incrementScale}
                className="w-2rem h-2rem ml-2"
                rounded
                text
                disabled={layoutConfig.scale === scales[scales.length - 1]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu mode (card grande) */}
      <div className="col-12">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-bars" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <h2 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('menuMode')}</h2>
          </div>

          <div style={{ padding: 20 }}>
            <div className="grid">
              <div className="col-6 sm:col-4 lg:col-3 mb-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'static'}
                    checked={layoutConfig.menuMode === 'static'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode1"
                  />
                  <label htmlFor="mode1" className="ml-2 font-medium">{t('static')}</label>
                </div>
              </div>
              <div className="col-6 sm:col-4 lg:col-3 mb-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'overlay'}
                    checked={layoutConfig.menuMode === 'overlay'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode2"
                  />
                  <label htmlFor="mode2" className="ml-2 font-medium">{t('overlay')}</label>
                </div>
              </div>
              <div className="col-6 sm:col-4 lg:col-3 mb-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'slim'}
                    checked={layoutConfig.menuMode === 'slim'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode3"
                  />
                  <label htmlFor="mode3" className="ml-2 font-medium">{t('slim')}</label>
                </div>
              </div>
              <div className="col-6 sm:col-4 lg:col-3 mb-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'slim-plus'}
                    checked={layoutConfig.menuMode === 'slim-plus'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode4"
                  />
                  <label htmlFor="mode4" className="ml-2 font-medium">{t('slimPlus')}</label>
                </div>
              </div>
              <div className="col-6 sm:col-4 lg:col-3 mb-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'drawer'}
                    checked={layoutConfig.menuMode === 'drawer'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode7"
                  />
                  <label htmlFor="mode7" className="ml-2 font-medium">{t('drawer')}</label>
                </div>
              </div>
              <div className="col-6 sm:col-4 lg:col-3 mb-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'reveal'}
                    checked={layoutConfig.menuMode === 'reveal'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode6"
                  />
                  <label htmlFor="mode6" className="ml-2 font-medium">{t('reveal')}</label>
                </div>
              </div>
              <div className="col-6 sm:col-4 lg:col-3">
                <div className="flex align-items-center">
                  <RadioButton
                    name="menuMode"
                    value={'horizontal'}
                    checked={layoutConfig.menuMode === 'horizontal'}
                    onChange={(e) => changeMenuMode(e)}
                    inputId="mode5"
                  />
                  <label htmlFor="mode5" className="ml-2 font-medium">{t('horizontal')}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStyle;