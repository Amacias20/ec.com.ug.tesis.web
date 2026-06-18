import React, { useState, useEffect } from "react";
import 'styles/Loader.css';

interface LoaderComponentProps {
  show: boolean;
  showBackground?: boolean;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ show, showBackground = true }) => {
  const [showLoader, setShowLoader] = useState<boolean>(show);

  useEffect(() => {
    setShowLoader(show);
  }, [show]);

  useEffect(() => {
    const handleLoader = (event: CustomEvent<boolean>) => {
      setShowLoader(event.detail);
    };

    window.addEventListener('loading', handleLoader as EventListener);

    return () => {
      window.removeEventListener('loading', handleLoader as EventListener);
    };
  }, []);

  return (
    showLoader && (
      <div
        className='no-select'
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          left: "0",
          top: "0",
          zIndex: "100000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: showBackground ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        }}
      >
        <div className="loader-wrapper">
          <svg className="loader-logo" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1080 1080">
            <defs>
              <style>
                {`.cls-1 {
                  fill: #fff;
                  stroke-width: 22.36px;
                }

                .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7, .cls-8, .cls-9, .cls-10 {
                  stroke-miterlimit: 10;
                }

                .cls-1, .cls-2, .cls-3, .cls-6, .cls-7, .cls-9, .cls-10 {
                  stroke: #154270;
                }

                .cls-2, .cls-3, .cls-10 {
                  fill: #154270;
                }

                .cls-2, .cls-4 {
                  stroke-width: 9.57px;
                }

                .cls-3 {
                  stroke-width: 9.66px;
                }

                .cls-4 {
                  fill: #f26d24;
                }

                .cls-4, .cls-5, .cls-8 {
                  stroke: #f26d24;
                }

                .cls-5, .cls-6, .cls-7, .cls-8, .cls-9 {
                  fill: none;
                }

                .cls-5, .cls-7 {
                  stroke-width: 23.09px;
                }

                .cls-6 {
                  stroke-width: 23.28px;
                }

                .cls-8, .cls-9 {
                  stroke-linecap: round;
                  stroke-width: 42.54px;
                }

                .cls-10 {
                  stroke-width: 26.15px;
                }`}
              </style>
            </defs>
            <g>
              <g id="Layer_1">
                <g>
                  <path className="cls-8" d="M89.53,732.2v-395.62c0-36.32,19.37-69.94,50.84-88.15L492.78,45.06c31.47-18.2,70.21-18.2,101.69,0l342.72,197.81"/>
                  <line className="cls-1" x1="695.41" y1="438.92" x2="375.15" y2="639.96"/>
                  <line className="cls-5" x1="723.95" y1="122.41" x2="229.42" y2="407.94"/>
                  <polyline className="cls-5" points="431.49 466.78 545.56 408.24 545.56 232.7"/>
                  <path className="cls-4" d="M184.94,484.96c28.37,0,51.36-23,51.36-51.36s-23-51.36-51.36-51.36-51.36,23-51.36,51.36,23,51.36,51.36,51.36Z"/>
                  <path className="cls-4" d="M400.12,547.11c28.37,0,51.36-23,51.36-51.36s-23-51.36-51.36-51.36-51.36,23-51.36,51.36,23,51.36,51.36,51.36Z"/>
                  <path className="cls-10" d="M735.81,362.53c-27.56,1.02-49.08,24.19-48.06,51.75,1.02,27.56,24.19,49.08,51.75,48.06,27.56-1.02,49.08-24.19,48.06-51.75-1.02-27.56-24.19-49.08-51.75-48.06Z"/>
                  <path className="cls-10" d="M339.41,610.3c-27.56,1.02-49.08,24.19-48.06,51.75,1.02,27.56,24.19,49.08,51.75,48.06,27.56-1.02,49.08-24.19,48.06-51.75-1.02-27.56-24.19-49.08-51.75-48.06Z"/>
                  <path className="cls-9" d="M990.47,347.69v395.71c0,36.41-19.37,69.94-50.84,88.15l-352.4,203.46c-31.47,18.11-70.21,18.11-101.69,0l-342.72-197.81"/>
                  <line className="cls-6" x1="381.22" y1="969.74" x2="884.89" y2="690.6"/>
                  <path className="cls-3" d="M888.84,627.08c-28.25,4.5-47.51,31.04-43.01,59.29,4.5,28.25,31.04,47.51,59.29,43.01,28.25-4.5,47.51-31.04,43.01-59.29-4.5-28.25-31.04-47.51-59.29-43.01Z"/>
                  <polyline className="cls-7" points="652.68 629.28 545.56 691 545.56 877.22"/>
                  <path className="cls-2" d="M666.23,547.11c-28.37,0-51.36,23-51.36,51.36,0,28.37,23,51.36,51.36,51.36,28.37,0,51.36-23,51.36-51.36,0-28.37-23-51.36-51.36-51.36Z"/>
                </g>
              </g>
            </g>
          </svg>
          <svg className="loader-texto">
            <text x="50%" y="50%" dy=".35em" textAnchor="middle">Diligent<a className="loader-r">®</a>
            </text>
          </svg>
          <div className="loader-span">
            <div className="loader-typing_loader"></div>
          </div>
        </div>
      </div>
    )
  );
};

export default LoaderComponent;