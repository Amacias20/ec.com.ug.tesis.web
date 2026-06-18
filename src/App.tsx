import React, { Suspense, useState, useEffect } from 'react';
import { LayoutProvider } from './layout/context/layoutcontext';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import setupLocalization from 'locale/PrimeReactLocale';
import LoaderComponent from 'components/Loader/Loader';
import NotFound from 'pages/common/NotFoundScreen';
import { routes } from 'routes/Routes';
import Layout from './layout/layout';
import i18n from 'locale/i18n';

const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState<boolean>(false);

  useEffect(() => {
    setupLocalization();
    const onLanguageChanged = () => setupLocalization();
    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, []);

  useEffect(() => {
    const handleLoader = (event: CustomEvent<boolean>) => setShowLoader(event.detail);
    window.addEventListener('loading', handleLoader as EventListener);
    return () => window.removeEventListener('loading', handleLoader as EventListener);
  }, []);

  return (
    <LayoutProvider>
      <BrowserRouter>
        <Suspense fallback={<LoaderComponent show={true} showBackground={true} />}>
          <LoaderComponent show={showLoader} />
          <Routes>
            <Route
              path="/*"
              element={
                <Layout>
                  <Suspense fallback={<LoaderComponent show={true} showBackground={true} />}>
                    <Routes>
                      {routes.map((route, i) => (
                        <Route key={i} path={route.path} element={<route.component />} />
                      ))}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LayoutProvider>
  );
};

export default App;
