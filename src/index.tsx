import 'locale/i18n';
import setupLocalization from 'locale/PrimeReactLocale';
import { PrimeReactProvider } from 'primereact/api';
import { ToastContainer } from 'react-toastify';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import 'handsontable/dist/handsontable.full.min.css';
import './styles/layout/layout.scss';
import 'flagpack/dist/flagpack.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/custom.css';

const updatePrimeLocale = setupLocalization();
const currentLang = updatePrimeLocale();

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider value={{ locale: currentLang, unstyled: false }}>
    <ToastContainer />
    <App />
  </PrimeReactProvider>
);
