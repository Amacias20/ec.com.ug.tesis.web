import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import React from 'react';

interface DiffViewerComponentProps {
  oldJson: string;
  newJson: string;
}

const DiffViewerComponent: React.FC<DiffViewerComponentProps> = ({ oldJson, newJson }) => {
    // Parsear las cadenas JSON para eliminar escapes innecesarios y convertir de nuevo a objeto
    const oldDataObj = JSON.parse(oldJson);
    const newDataObj = JSON.parse(newJson);
  
    // Volver a convertir los objetos a cadenas JSON formateadas para una mejor visualización
    const formattedOldJson = JSON.stringify(oldDataObj, null, 2);
    const formattedNewJson = JSON.stringify(newDataObj, null, 2);
  
    return (
      <ReactDiffViewer
        oldValue={formattedOldJson}
        newValue={formattedNewJson}
        splitView={true}
        disableWordDiff={true}
        compareMethod={DiffMethod.WORDS}
        leftTitle="Versión Anterior"
        rightTitle="Versión Actual"
        styles={{ diffContainer: { maxWidth: '100%' } }} // Controla el ancho máximo del contenedor del diff
      />
    );
  };
  
  export default DiffViewerComponent;  
