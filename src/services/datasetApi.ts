import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface DatasetInfo {
  id: number;
  filename: string;
  upload_date: string;
  size_bytes: number;
  total_rows?: number;
}

export async function uploadDataset(file: File): Promise<{ message: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await client.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getDatasetHistory(): Promise<DatasetInfo[]> {
  const { data } = await client.get<DatasetInfo[]>('/datasets/history');
  return data;
}

export async function deleteDataset(id: number): Promise<{ message: string }> {
  const { data } = await client.delete(`/datasets/${id}`);
  return data;
}
