# Frontend — Diagnóstico Multi-Enfermedad Autoinmune

Aplicación React (Vite + PrimeReact) para el backend de clasificación multi-etiqueta.

## Pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — estado de la API y resumen del modelo |
| `/diagnosis` | Formulario de biomarcadores y resultados de predicción |
| `/model-info` | Información del modelo y umbrales |
| `/explainability` | Importancia global de features (SHAP) |

## Requisitos

- Node.js 18+
- Backend en ejecución (`uvicorn main:app --reload --port 8000`)

## Configuración

`.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Ejecutar

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build

```bash
npm run build
npm run preview
```
