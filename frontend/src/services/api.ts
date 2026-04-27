import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s timeout for AI processing
});

/* ── Request interceptor: attach Bearer token ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitnesslab_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Response interceptor: handle 401 ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth state
      localStorage.removeItem("fitnesslab_token");
      localStorage.removeItem("fitnesslab_email");
      localStorage.removeItem("fitnesslab_result");
      // Only redirect if we're in the browser
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

/* ── Types ── */

export interface AnalyzePayload {
  height: number;
  weight: number;
  calories: number;
  protein: number;
  fibre: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  user: Record<string, unknown>;
}

/* ── Auth API ── */

export async function signupUser(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", { email, password });
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

/* ── Analyze API ── */

export async function analyzeBody(payload: AnalyzePayload) {
  const response = await api.post("/analyze", payload);
  return response.data;
}

export default api;
