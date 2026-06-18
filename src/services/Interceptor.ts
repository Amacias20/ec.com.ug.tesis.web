import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { GetToken } from '../constants/Global';

const api: AxiosInstance = axios.create({
    timeout: 300000
});

let requestCount: number = 0;
let loaderTimeout: NodeJS.Timeout | undefined;

const showLoader = (): void => {
    requestCount++;
    if (requestCount === 1) {
        loaderTimeout = setTimeout(() => {
            const event = new CustomEvent('loading', { detail: true });
            window.dispatchEvent(event);
        }, 2000);
    }
};

const hideLoader = (): void => {
    requestCount--;
    if (requestCount === 0) {
        if (loaderTimeout) clearTimeout(loaderTimeout);
        const event = new CustomEvent('loading', { detail: false });
        window.dispatchEvent(event);
    }
};

const disableButtons = (): void => {
    const buttons = document.querySelectorAll('.p-button');
    buttons.forEach((button) => (button as HTMLElement).setAttribute('disabled', 'true'));
};

const enableButtons = (): void => {
    const buttons = document.querySelectorAll('.p-button');
    buttons.forEach((button) => (button as HTMLElement).removeAttribute('disabled'));
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        showLoader();
        disableButtons();
        const token = GetToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        hideLoader();
        enableButtons();
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        hideLoader();
        enableButtons();
        return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
        hideLoader();
        enableButtons();
        return Promise.reject(error);
    }
);

export default api;