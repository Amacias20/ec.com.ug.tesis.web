import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface PatientInput {
  first_name: string;
  last_name: string;
  age: number;
  gender: 'Male' | 'Female';
  esr?: number | null;
  crp?: number | null;
  rf?: number | null;
  anti_ccp?: number | null;
  hla_b27?: 'Positive' | 'Negative' | null;
  ana?: 'Positive' | 'Negative' | null;
  anti_ro?: 'Positive' | 'Negative' | null;
  anti_la?: 'Positive' | 'Negative' | null;
  anti_dsdna?: 'Positive' | 'Negative' | null;
  anti_sm?: 'Positive' | 'Negative' | null;
  c3?: number | null;
  c4?: number | null;
}

export interface DiagnosisPrediction {
  disease: string;
  probability: number;
  is_positive: boolean;
  threshold_used: number;
}

export interface PredictionResponse {
  predictions: DiagnosisPrediction[];
  overlap_syndrome_detected: boolean;
  missing_features: string[];
  model_used: string;
}

export interface GlobalMetrics {
  hamming_loss: number;
  exact_match_ratio: number;
  micro_f1: number;
  macro_f1: number;
  micro_auc_roc: number;
}

export interface LabelMetrics {
  precision: number;
  recall: number;
  f1: number;
  auc_roc: number;
  support: number;
}

export interface ModelMetrics {
  global: GlobalMetrics;
  per_label: Record<string, LabelMetrics>;
}

export interface ModelInfoResponse {
  model_name: string;
  input_dim: number;
  n_labels: number;
  label_names: string[];
  feature_names: string[];
  thresholds: number[];
  metrics?: ModelMetrics;
}

export interface ExplainabilityResponse {
  shap_values: Record<string, Record<string, number>>;
  lime_explanation: Record<string, [string, number][]>;
  attention_weights?: Record<string, number>;
  top_positive_features: Record<string, string[]>;
  top_negative_features: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Patient history types (PostgreSQL)
// ---------------------------------------------------------------------------
export interface PatientRecord {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: number;
  primary_diagnosis: string | null;
  primary_probability: number | null;
  overlap_syndrome_detected: boolean;
  model_used: string | null;
  created_at: string;
}

export interface PredictionRecordOut {
  id: string;
  disease_name: string;
  probability: number;
  is_positive: boolean;
  threshold_used: number;
  is_primary: boolean;
}

export interface PatientDetail extends PatientRecord {
  esr: number | null;
  crp: number | null;
  rf: number | null;
  anti_ccp: number | null;
  hla_b27: number | null;
  ana: number | null;
  anti_ro: number | null;
  anti_la: number | null;
  anti_dsdna: number | null;
  anti_sm: number | null;
  c3: number | null;
  c4: number | null;
  predictions: PredictionRecordOut[];
}

export interface PaginatedPatients {
  items: PatientRecord[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------
export async function predict(patient: PatientInput): Promise<PredictionResponse> {
  const { data } = await client.post<PredictionResponse>('/predict', patient);
  return data;
}

export async function predictWithExplanation(patient: PatientInput) {
  const { data } = await client.post('/predict-with-explanation', patient);
  return data as { prediction: PredictionResponse; explanation: ExplainabilityResponse };
}

export async function getModelInfo(): Promise<ModelInfoResponse> {
  const { data } = await client.get<ModelInfoResponse>('/model-info');
  return data;
}

export async function explain(patient: PatientInput): Promise<ExplainabilityResponse> {
  const { data } = await client.post<ExplainabilityResponse>('/explain', patient);
  return data;
}

export async function getFeatureImportance(): Promise<Record<string, Record<string, number>>> {
  const { data } = await client.get('/feature-importance');
  return data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await client.get('/health');
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Patient CRUD
// ---------------------------------------------------------------------------
export async function getPatients(page = 1, size = 20): Promise<PaginatedPatients> {
  const { data } = await client.get<PaginatedPatients>('/patients', { params: { page, size } });
  return data;
}

export async function getPatient(id: string): Promise<PatientDetail> {
  const { data } = await client.get<PatientDetail>(`/patients/${id}`);
  return data;
}

export async function deletePatient(id: string): Promise<void> {
  await client.delete(`/patients/${id}`);
}
