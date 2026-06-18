const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

// Ruta al directorio de construcción de React
const buildDirectory = 'build';

// Configuración de JavaScript Obfuscator
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  sourceMap: false,
  debugProtection: true,
  disableConsoleOutput:true
};

// Ofuscar archivos en el directorio de construcción
fs.readdirSync(buildDirectory).forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = `${buildDirectory}/${file}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const obfuscatedContent = JavaScriptObfuscator.obfuscate(fileContent, obfuscationOptions).getObfuscatedCode();
    fs.writeFileSync(filePath, obfuscatedContent);
  }
});