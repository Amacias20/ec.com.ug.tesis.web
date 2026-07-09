import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface DashboardSummary {
  total_predictions: number;
  overlap_syndrome_count: number;
  last_prediction_at: string | null;
  threshold_used: number;
  model_used: string;
}

export interface TimelinePoint {
  date: string;
  count: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await client.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function getDiseaseDistribution(): Promise<Record<string, number>> {
  const { data } = await client.get<Record<string, number>>('/dashboard/disease-distribution');
  return data;
}

export async function getDiseaseByGender(): Promise<Record<string, { Femenino: number; Masculino: number }>> {
  const { data } = await client.get<Record<string, { Femenino: number; Masculino: number }>>('/dashboard/disease-by-gender');
  return data;
}

export async function getPredictionsTimeline(): Promise<TimelinePoint[]> {
  const { data } = await client.get<TimelinePoint[]>('/dashboard/timeline');
  return data;
}

export async function getBiomarkersFrequency(): Promise<Record<string, number>> {
  const { data } = await client.get<Record<string, number>>('/dashboard/biomarkers-frequency');
  return data;
}
