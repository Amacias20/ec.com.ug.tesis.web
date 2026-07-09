import React, { useState, useMemo } from 'react';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { classNames } from 'primereact/utils';

const Glossary = () => {
  const { t } = useTranslation(['common']);

  const getSeverity = (disease: string) => {
    switch (disease) {
      case 'Inflamación General':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Artritis Reumatoide':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Lupus (SLE)':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Espondilitis Anquilosante':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Síndrome de Sjögren':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const markers = [
    { abbr: 'ESR', name: 'Velocidad de Sedimentación Globular (Erythrocyte Sedimentation Rate)', desc: 'Mide la rapidez con la que los glóbulos rojos se asientan en el fondo de un tubo de ensayo. Una velocidad rápida puede indicar inflamación en el cuerpo.', diseases: ['Inflamación General'] },
    { abbr: 'CRP', name: 'Proteína C Reactiva (C-Reactive Protein)', desc: 'Es una proteína producida por el hígado. Sus niveles aumentan cuando hay inflamación aguda o crónica en el cuerpo.', diseases: ['Inflamación General'] },
    { abbr: 'RF', name: 'Factor Reumatoide (Rheumatoid Factor)', desc: 'Anticuerpo que, en niveles altos, puede indicar una enfermedad autoinmune, muy asociado a la artritis reumatoide.', diseases: ['Artritis Reumatoide'] },
    { abbr: 'Anti-CCP', name: 'Péptido Citrulinado Anticíclico', desc: 'Anticuerpos que se encuentran con frecuencia en pacientes con artritis reumatoide. Es un marcador muy específico y temprano para esta enfermedad.', diseases: ['Artritis Reumatoide'] },
    { abbr: 'HLA-B27', name: 'Antígeno Leucocitario Humano B27', desc: 'Proteína que se encuentra en la superficie de los glóbulos blancos. Su presencia está fuertemente asociada con ciertas enfermedades autoinmunes como la espondilitis anquilosante.', diseases: ['Espondilitis Anquilosante'] },
    { abbr: 'ANA', name: 'Anticuerpos Antinucleares (Antinuclear Antibodies)', desc: 'Grupo de anticuerpos que atacan el núcleo de las células del propio cuerpo. Es una prueba principal para detectar enfermedades autoinmunes como el lupus (SLE).', diseases: ['Lupus (SLE)'] },
    { abbr: 'Anti-Ro (SSA)', name: 'Anticuerpos Anti-Ro', desc: 'Anticuerpos frecuentemente encontrados en pacientes con síndrome de Sjögren y lupus eritematoso sistémico. Pueden cruzar la placenta.', diseases: ['Síndrome de Sjögren', 'Lupus (SLE)'] },
    { abbr: 'Anti-La (SSB)', name: 'Anticuerpos Anti-La', desc: 'Suelen aparecer junto con los Anti-Ro en pacientes con síndrome de Sjögren y lupus eritematoso sistémico.', diseases: ['Síndrome de Sjögren', 'Lupus (SLE)'] },
    { abbr: 'Anti-dsDNA', name: 'Anticuerpos Anti-ADN de doble cadena', desc: 'Anticuerpos muy específicos del lupus eritematoso sistémico. Sus niveles suelen fluctuar según la actividad de la enfermedad.', diseases: ['Lupus (SLE)'] },
    { abbr: 'Anti-Sm', name: 'Anticuerpos Anti-Smith', desc: 'Anticuerpos muy específicos para el diagnóstico del lupus eritematoso sistémico, aunque no todas las personas con lupus lo tienen.', diseases: ['Lupus (SLE)'] },
    { abbr: 'C3', name: 'Componente 3 del Complemento', desc: 'Proteína del sistema del complemento (parte del sistema inmunológico). Niveles bajos pueden indicar que el sistema inmunológico está activo y consumiendo esta proteína (común en el lupus).', diseases: ['Lupus (SLE)'] },
    { abbr: 'C4', name: 'Componente 4 del Complemento', desc: 'Similar al C3, es una proteína del sistema del complemento. Sus niveles bajos también indican actividad inflamatoria o autoinmune.', diseases: ['Lupus (SLE)'] }
  ];

  const [selectedDisease, setSelectedDisease] = useState<string>('Todos');

  const allDiseases = useMemo(() => {
    const diseases = new Set<string>();
    markers.forEach(m => m.diseases.forEach(d => diseases.add(d)));
    return ['Todos', ...Array.from(diseases)];
  }, [markers]);

  const filteredMarkers = selectedDisease === 'Todos' 
    ? markers 
    : markers.filter(m => m.diseases.includes(selectedDisease));

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8 w-full flex flex-column gap-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="relative border-round-3xl overflow-hidden shadow-4" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '3rem 2rem 4rem 2rem' }}>
        <div className="absolute opacity-20" style={{ right: '-5%', top: '-20%', transform: 'rotate(15deg)' }}>
          <i className="pi pi-book" style={{ fontSize: '15rem' }}></i>
        </div>
        <div className="relative z-1 flex align-items-center gap-4">
          <div className="bg-white-alpha-20 backdrop-blur border-circle p-4 flex align-items-center justify-content-center shadow-2 border-1 border-white-alpha-30">
            <i className="pi pi-list text-5xl text-white"></i>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold m-0 mb-2">Glosario de Marcadores</h1>
            <p className="m-0 text-xl text-green-100 font-medium">Descripción y utilidad de cada marcador inmunológico / bioquímico.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-3 mt-3 justify-content-center" style={{ position: 'relative', zIndex: 2 }}>
        {allDiseases.map(disease => (
          <button
            key={disease}
            onClick={() => setSelectedDisease(disease)}
            className={classNames(
              'px-4 py-2 border-round-3xl font-semibold cursor-pointer transition-all transition-duration-200 border-none shadow-1',
              {
                'bg-indigo-600 text-white shadow-3 hover:bg-indigo-500': selectedDisease === disease,
                'bg-white text-700 hover:surface-100 hover:text-indigo-500': selectedDisease !== disease
              }
            )}
          >
            {disease}
          </button>
        ))}
      </div>

      <div className="grid gap-0 px-3 mt-2" style={{ position: 'relative', zIndex: 2 }}>
        {filteredMarkers.map((marker, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-4 xl:col-4 p-2 flex">
            <Card className="w-full flex flex-column h-full border-none shadow-4 border-round-2xl hover:-translate-y-1 transition-all transition-duration-300 border-1 surface-border">
              <div className="flex align-items-center gap-3 mb-3 border-bottom-1 surface-border pb-3">
                <div className="bg-indigo-100 text-indigo-700 font-bold p-2 border-round-md text-xl" style={{ minWidth: '4rem', textAlign: 'center' }}>
                  {marker.abbr}
                </div>
                <h3 className="m-0 text-lg font-bold text-800 line-height-3">{marker.name}</h3>
              </div>
              <div className="flex-grow-1 flex flex-column justify-content-between">
                <p className="text-600 line-height-3 m-0 mb-4 text-base">
                  {marker.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {marker.diseases.map(disease => (
                    <span 
                      key={disease} 
                      className={`px-3 py-1 border-round-2xl text-xs font-semibold border-1 ${getSeverity(disease)}`}
                    >
                      {disease}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glossary;
