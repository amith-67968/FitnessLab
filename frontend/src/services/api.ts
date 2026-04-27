import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitnesslab_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fitnesslab_token");
      localStorage.removeItem("fitnesslab_email");
      localStorage.removeItem("fitnesslab_result");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export type Gender = "male" | "female";
export type Category = "skinny" | "fit" | "fat";

export interface AnalyzePayload {
  height: number;
  weight: number;
  gender: Gender;
}

export interface NutritionPlan {
  calories: number;
  protein: number;
  fibre: number;
  fats: number;
  carbs: number;
}

export interface NutritionImages {
  calories: string;
  protein: string;
  fibre: string;
  fats: string;
  carbs: string;
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  notes: string;
}

export interface WorkoutWeek {
  week: string;
  focus: string;
  details: string;
  exercises: WorkoutExercise[];
  images: string[];
}

export interface AnalyzeResponse {
  bmi: number;
  category: Category;
  nutrition: NutritionPlan;
  nutrition_images: NutritionImages;
}

export interface WorkoutResponse {
  title: string;
  description: string;
  weeks: WorkoutWeek[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  user: Record<string, unknown>;
}

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

export async function analyzeBody(payload: AnalyzePayload): Promise<AnalyzeResponse> {
  const response = await api.post<AnalyzeResponse>("/analyze", payload);
  return response.data;
}

export async function getWorkoutPlan(category: Category): Promise<WorkoutResponse> {
  const response = await api.get<WorkoutResponse>(`/workout/${category}`);
  return response.data;
}

export default api;
