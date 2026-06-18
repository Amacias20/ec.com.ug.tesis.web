import { UpdateUser, GetUserById } from '../../services/security/endpoints/UserService';
import { ToastError, ToastSuccess } from '../../components/Messages/Toast';
import { GetRol } from '../../services/security/endpoints/RolService';
import { GetUser, ErrorHandler } from '../../constants/Global';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

const InformationData: React.FC = () => {
  const { t } = useTranslation('myProfile');
  const user = GetUser();
  const [editing, setEditing] = useState(false);
  const [userRoles, setUserRoles] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      identification: user.identification || '',
      firstNames: user.firstNames || '',
      lastNames: user.lastNames || '',
      nickname: user.nickname || '',
      phone: user.phone || '',
      email: user.email || '',
      enabledTwoFA: user.enabledTwoFA || false,
      notifyLogin: user.notifyLogin || false
    },
    validationSchema: Yup.object({
      identification: Yup.string().required(t('identificationRequired')),
      firstNames: Yup.string().required(t('firstNameRequired')),
      lastNames: Yup.string().required(t('lastNameRequired')),
      nickname: Yup.string().required(t('nicknameRequired')),
      phone: Yup.string().required(t('phoneRequired')),
      email: Yup.string().email(t('emailInvalid')).required(t('emailRequired'))
    }),
    onSubmit: async (values) => {
      try {
        const updateBody = {
          identification: values.identification,
          firstNames: values.firstNames,
          lastNames: values.lastNames,
          nickname: values.nickname,
          phone: values.phone,
          enabledTwoFA: values.enabledTwoFA,
          notifyLogin: values.notifyLogin
        };
        await UpdateUser(user.idUser, updateBody);

        const updatedUser = { ...user, ...updateBody };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        ToastSuccess(t('successUpdate'));
        setEditing(false);
      } catch (error) {
        ToastError(await ErrorHandler(error));
      }
    }
  });

  const fetchUserRoles = async () => {
    try {
      const response = await GetUserById(user.idUser, { includeApplicationRoles: true, IncludeApplications: true });
      if (response.data.userApplicationRoles?.length > 0) {
        const activeUserRoles = response.data.userApplicationRoles.filter(r => r.status === "ACTIVO");
        const appIds = [...new Set(activeUserRoles.map(item => item.applicationId))];
        const assignedRoleIds = activeUserRoles.map(item => item.roleId);

        if (appIds.length > 0) {
          try {
            const rolResponse = await GetRol({
              applicationId: appIds,
              status: 'ACTIVO',
              includeApplication: true
            });
            const allRoles = Array.isArray(rolResponse.data.data)
              ? rolResponse.data.data
              : Array.isArray(rolResponse.data)
                ? rolResponse.data
                : [];
            const userAssignedRoles = allRoles.filter(role => assignedRoleIds.includes(role.idRole));
            setUserRoles(userAssignedRoles);
          } catch (error) {
            ToastError(await ErrorHandler(error));
            setUserRoles([]);
          }
        }
      }
    } catch (error) {
      ToastError(await ErrorHandler(error));
    }
  };

  useEffect(() => { fetchUserRoles(); }, []);

  return (
    <div className="grid">
      <div className="col-12 mb-4">
        <h1 className="text-3xl font-bold text-primary diligentec-text-orange">{t('personalInfo')}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666666' }}>{t('personalInfoDescription')}</p>
      </div>

      {/* Card izquierda: datos personales */}
      <div className="col-12 lg:col-6 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle} className="justify-content-between flex-wrap">
            <div className="flex align-items-center">
              <div style={iconCircle()}>
                <i className="pi pi-user" style={{ color: '#f27935', fontSize: '1.2rem' }} />
              </div>
              <h2 className="m-0 ml-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t('personalInfo')}</h2>
            </div>
            <div className="flex align-items-center mt-2 md:mt-0">
              <Button
                icon={editing ? "pi pi-save" : "pi pi-pencil"}
                label={editing ? t('save') : t('edit')}
                className="p-button-rounded p-button-outlined"
                onClick={editing ? formik.handleSubmit : () => setEditing(true)}
              />
              {editing && (
                <Button
                  icon="pi pi-times"
                  label={t('cancel')}
                  style={{ marginLeft: '10px' }}
                  severity="danger"
                  className="p-button-rounded p-button-outlined"
                  onClick={() => setEditing(false)}
                />
              )}
            </div>
          </div>

          <div style={{ padding: 20 }}>
            {editing ? (
              <>
                {/* Campos editables */}
                {[
                  { id: 'identification', label: t('identification'), type: 'text', keyfilter: 'num', maxLength: 10 },
                  { id: 'nickname', label: t('nickname') },
                  { id: 'firstNames', label: t('firstName') },
                  { id: 'lastNames', label: t('lastName') },
                  { id: 'phone', label: t('phone'), keyfilter: 'num', maxLength: 10 }
                ].map((field, idx) => (
                  <div key={idx} className="field mb-3">
                    <div className="flex flex-column sm:flex-row">
                      <label htmlFor={field.id} className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{field.label}:</label>
                      <div className="w-full sm:w-8">
                        <InputText
                          id={field.id}
                          name={field.id}
                          value={(formik.values as any)[field.id]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={formik.errors[field.id] && formik.touched[field.id] ? 'p-invalid w-full' : 'w-full'}
                          {...(field.keyfilter ? { keyfilter: field.keyfilter } : {})}
                          {...(field.maxLength ? { maxLength: field.maxLength } : {})}
                        />
                        {formik.errors[field.id] && formik.touched[field.id] &&
                          <small className="p-error">{(formik.errors as any)[field.id]}</small>}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Email fijo */}
                <div className="field mb-3">
                  <div className="flex flex-column sm:flex-row">
                    <label htmlFor="email" className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{t('email')}:</label>
                    <div className="w-full sm:w-8">
                      <InputText id="email" name="email" value={formik.values.email} disabled className="w-full opacity-70" />
                      <small className="text-500">{t('emailCannotBeChanged')}</small>
                    </div>
                  </div>
                </div>
                {/* Switches */}
                {[
                  { id: 'enabledTwoFA', label: t('twoFactorAuth') },
                  { id: 'notifyLogin', label: t('loginNotification') }
                ].map((sw, idx) => (
                  <div key={idx} className="field mb-3">
                    <div className="flex flex-column sm:flex-row">
                      <label htmlFor={sw.id} className="block text-900 font-medium w-full sm:w-4 mb-2 sm:mb-0">{sw.label}:</label>
                      <div className="w-full sm:w-8 flex align-items-center">
                        <InputSwitch
                          id={sw.id}
                          name={sw.id}
                          checked={(formik.values as any)[sw.id]}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: t('identification'), value: user.identification },
                  { label: t('nickname'), value: user.nickname },
                  { label: t('firstName'), value: user.firstNames },
                  { label: t('lastName'), value: user.lastNames },
                  { label: t('phone'), value: user.phone },
                  { label: t('email'), value: user.email },
                  { label: t('twoFactorAuth'), value: user.enabledTwoFA ? t('enabled') : t('disabled') },
                  { label: t('loginNotification'), value: user.notifyLogin ? t('enabled') : t('disabled') }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center py-3" style={{ borderBottom: idx < 7 ? '1px solid #f1f3f5' : 'none' }}>
                    <span className="text-900 font-medium">{item.label}:</span>
                    <span className="text-700">{item.value || t('noRecord')}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card derecha: roles */}
      <div className="col-12 lg:col-6 mb-4">
        <div className="card h-full" style={enhancedCardStyle}>
          <div style={headerStyle}>
            <div style={iconCircle()}>
              <i className="pi pi-user" style={{ color: '#f27935', fontSize: '1.2rem' }} />
            </div>
            <h2 className="m-0 ml-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t('roleInfo')}</h2>
          </div>

          <div style={{ padding: 20 }}>
            {userRoles.length > 0 ? (
              (() => {
                const rolesByApp = userRoles.reduce((acc, role) => {
                  const appName = role.applicationName || t('application');
                  if (!acc[appName]) acc[appName] = [];
                  acc[appName].push(role.name);
                  return acc;
                }, {} as Record<string, string[]>);

                return Object.entries(rolesByApp).map(([appName, roles], index) => (
                  <div key={index} className="mb-4">
                    <div className="flex align-items-center mb-2">
                      <i className="pi pi-shield mr-2 text-primary" style={{ fontSize: '1.2rem' }}></i>
                      <span className="text-900 font-semibold text-lg">{appName}:</span>
                    </div>
                    <ul className="list-none pl-4 m-0">
                      {roles.map((roleName, roleIndex) => (
                        <li key={roleIndex} className="flex align-items-center py-2">
                          <i className="pi pi-check-circle mr-2" style={{ color: '#4caf50' }}></i>
                          <span className="text-700">{roleName}</span>
                        </li>
                      ))}
                    </ul>
                    {index < Object.entries(rolesByApp).length - 1 && <div className="my-3 border-bottom-1 border-300"></div>}
                  </div>
                ));
              })()
            ) : (
              <div className="flex justify-content-center align-items-center p-5">
                <div className="text-center">
                  <i className="pi pi-shield text-4xl mb-3" style={{ color: '#e0e0e0' }}></i>
                  <p className="text-600 font-medium">{t('noRolesAssigned')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationData;