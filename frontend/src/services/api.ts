import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s timeout for AI processing
});

export interface AnalyzePayload {
  height: number;
  weight: number;
  calories: number;
  protein: number;
  fibre: number;
}

export async function analyzeBody(payload: AnalyzePayload) {
  const response = await api.post("/analyze", payload);
  return response.data;
}

export default api;
