import { ChangePassword } from 'services/security/endpoints/UserService';
import { ToastError, ToastSuccess } from 'components/Messages/Toast';
import { ErrorHandler, GetUser, Logout } from 'constants/Global';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';

interface IValidations {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  noConsecutive: boolean;
}

interface IPasswordData {
  currentPassword: string;
  NewPassword: string;
}

const Security: React.FC = () => {
  const { t } = useTranslation('changePassword');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>('');
  const [originalPassword, setOriginalPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState<IValidations>({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    noConsecutive: false
  });

  const ValidatePassword = (password: string): void => {
    const validations: IValidations = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      noConsecutive: !/(0123|1234|2345|3456|4567|5678|6789|7890)/.test(password)
    };
    setValidations(validations);
  };

  const HandleUpdatePassword = async (): Promise<void> => {
    const user = GetUser();
    if (!user) {
      ToastError(t('userNotFound'));
      return;
    }
    const userId = user.idUser;

    if (newPassword !== confirmNewPassword) {
      ToastError(t('passwordMismatch'));
      return;
    }

    if (!Object.values(validations).every(Boolean)) {
      ToastError(t('checkRequirements'));
      return;
    }

    const data: IPasswordData = {
      currentPassword: originalPassword,
      NewPassword: newPassword
    };

    try {
      await ChangePassword(userId, data);
      Logout();
      navigate('/login');
      ToastSuccess(t('passwordUpdated'));
    } catch (error) {
      ToastError(await ErrorHandler(error));
    }
  };

  useEffect(() => {
    ValidatePassword(newPassword);
  }, [newPassword]);

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

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    marginTop: '2.5rem',
    marginBottom: '2.5rem'
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#6c757d'
  };

  return (
    <div className="grid">
      <div className="col-12 mb-4">
        <h1 className="text-3xl font-bold text-primary diligentec-text-orange">{t('title')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666666' }}>{t('description')}</p>
      </div>

      {/* CARD IZQUIERDO */}
      <div className="col-12 md:col-6 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-lock" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <div>
              <h2 className="m-0" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t('title')}</h2>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Contraseña actual */}
            <div style={inputWrapperStyle}>
              <span className="p-float-label w-full block">
                <InputText
                  id="oldPassword"
                  type={showOriginalPassword ? 'text' : 'password'}
                  required
                  value={originalPassword}
                  onChange={(e) => setOriginalPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
                <label htmlFor="oldPassword">{t('currentPassword')}</label>
                <i
                  className={showOriginalPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                  onClick={() => setShowOriginalPassword(!showOriginalPassword)}
                  style={iconStyle}
                />
              </span>
            </div>

            {/* Nueva contraseña */}
            <div style={inputWrapperStyle}>
              <span className="p-float-label w-full block">
                <InputText
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
                <label htmlFor="newPassword">{t('newPassword')}</label>
                <i
                  className={showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={iconStyle}
                />
              </span>
            </div>

            {/* Confirmar contraseña */}
            <div style={inputWrapperStyle}>
              <span className="p-float-label w-full block">
                <InputText
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  style={{ width: '100%' }}
                />
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <i
                  className={showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={iconStyle}
                />
              </span>
            </div>

            <div style={{ borderTop: '1px solid #f1f3f5', marginTop: '4px' }} />

            <div className="flex flex-column md:flex-row gap-2 md:justify-content-end mt-2">
              <Button
                label={t('clear')}
                icon="pi pi-times"
                severity="danger"
                outlined
                className="w-full md:w-auto"
                onClick={() => {
                  setOriginalPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
              />
              <Button
                label={t('save')}
                icon="pi pi-save"
                className="w-full md:w-auto"
                style={{ backgroundColor: '#154270', borderColor: '#154270' }}
                onClick={HandleUpdatePassword}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD DERECHO */}
      <div className="col-12 md:col-6 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-info-circle" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <div>
              <h2 className="m-0" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {t('requirementsTitle')}
              </h2>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            <ul className="list-none p-0 m-0">
              {[
                { text: t('minLength'), valid: validations.minLength },
                { text: t('uppercase'), valid: validations.uppercase },
                { text: t('lowercase'), valid: validations.lowercase },
                { text: t('number'), valid: validations.number },
                { text: t('noConsecutive'), valid: validations.noConsecutive }
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex align-items-center justify-content-between py-3"
                  style={{ borderBottom: index < 4 ? '1px solid #f1f3f5' : 'none' }}
                >
                  <span className="text-900">{item.text}</span>
                  {item.valid
                    ? <i className="pi pi-check text-green-500" />
                    : <i className="pi pi-times text-red-500" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;