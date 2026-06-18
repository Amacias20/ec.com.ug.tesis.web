import { toast, ToastOptions } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const ToastError = (errorMessageString: string, duration: number = 3000): void => {
    toast.dismiss();
    toast.error(
        <div className='no-select' style={{ 
            whiteSpace: 'pre-line',
            fontSize: '14px',
            wordBreak: 'break-word',
        }}>
            {errorMessageString}
        </div>,
        {
            position: 'top-center',
            autoClose: duration,
            theme: 'colored',
            className: 'custom-toast',
            hideProgressBar: true,
            style: {
                maxWidth: '90vw',
                width: '100%',
                margin: '0 auto',
                minWidth: '280px'
            }
        } as ToastOptions
    );
};

export const ToastSuccess = (successMessageString: string, duration: number = 3000): void => {
    toast.dismiss();
    toast.success(
        <div className='no-select' style={{ 
            whiteSpace: 'pre-line',
            fontSize: '14px',
            wordBreak: 'break-word',
        }}>
            {successMessageString}
        </div>, 
        { 
            position: 'top-center', 
            theme: 'colored',
            autoClose: duration,
            className: 'custom-toast',
            hideProgressBar: true,
            style: {
                maxWidth: '90vw',
                width: '100%',
                margin: '0 auto',
                minWidth: '280px'
            }
        } as ToastOptions
    );
};

export const ToastInfo = (infoMessageString: string, duration: number = 3000): void => {
    toast.dismiss();
    toast.info(
        <div className='no-select' style={{ 
            whiteSpace: 'pre-line',
            fontSize: '14px',
            wordBreak: 'break-word',
        }}>
            {infoMessageString}
        </div>, 
        { 
            position: 'top-center', 
            theme: 'colored',
            autoClose: duration,
            className: 'custom-toast',
            hideProgressBar: true,
            style: {
                maxWidth: '90vw',
                width: '100%',
                margin: '0 auto',
                minWidth: '280px'
            }
        } as ToastOptions
    );
};

export const ToastWarning = (warningMessageString: string, duration: number = 3000): void => {
    toast.dismiss();
    toast.warning(
        <div className='no-select' style={{ 
            whiteSpace: 'pre-line',
            fontSize: '14px',
            wordBreak: 'break-word',
        }}>
            {warningMessageString}
        </div>, 
        { 
            position: 'top-center', 
            theme: 'colored',
            autoClose: duration,
            className: 'custom-toast',
            hideProgressBar: true,
            style: {
                maxWidth: '90vw',
                width: '100%',
                margin: '0 auto',
                minWidth: '280px'
            }
        } as ToastOptions
    );
};