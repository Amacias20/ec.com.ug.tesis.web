import { IRoute } from './types';
import { lazy } from 'react';

const Home = lazy(() => import('pages/Home'));
const Diagnosis = lazy(() => import('pages/Diagnosis'));
const ModelInfo = lazy(() => import('pages/ModelInfo'));
const Explainability = lazy(() => import('pages/Explainability'));
const DatasetManager = lazy(() => import('pages/DatasetManager'));
const Dashboard = lazy(() => import('pages/Dashboard'));

export const routes: IRoute[] = [
  { path: '/', key: 'Home', pathLabel: 'menu:home', component: Home },
  { path: '/dashboard', key: 'Dashboard', pathLabel: 'menu:dashboard', component: Dashboard },
  { path: '/diagnosis', key: 'Diagnosis', pathLabel: 'menu:diagnosis', component: Diagnosis },
  { path: '/model-info', key: 'ModelInfo', pathLabel: 'menu:modelInfo', component: ModelInfo },
  { path: '/explainability', key: 'Explainability', pathLabel: 'menu:explainability', component: Explainability },
  { path: '/datasets', key: 'DatasetManager', pathLabel: 'menu:datasets', component: DatasetManager },
];
