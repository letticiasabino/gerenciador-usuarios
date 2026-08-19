import axios from "axios";
import {
  User,
  UserStats,
  PaginatedResponse,
  CreateUserInput,
  UpdateUserInput,
  Admin,
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
  UpdateProfileInput,
  AuditLog,
} from "../types";

export const TOKEN_KEY = "gerenciamento_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    ) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    const message = error.response?.data?.message || "Erro interno do servidor";
    return Promise.reject(new Error(message));
  },
);

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; admin: Admin }> {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async me(): Promise<Admin> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async updateProfile(data: UpdateProfileInput): Promise<Admin> {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
};

export const userService = {
  async create(data: CreateUserInput): Promise<User> {
    const response = await api.post("/users", data);
    return response.data;
  },

  async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    order?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get("/users", { params });
    return response.data;
  },

  async findById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async updateStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<User> {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getStats(): Promise<UserStats> {
    const response = await api.get("/users/stats");
    return response.data;
  },
};

export const activityService = {
  async findAll(params?: {
    date?: string;
    month?: string;
    status?: string;
  }): Promise<Activity[]> {
    const response = await api.get("/activities", { params });
    return response.data;
  },

  async findById(id: string): Promise<Activity> {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  async create(data: CreateActivityInput): Promise<Activity> {
    const response = await api.post("/activities", data);
    return response.data;
  },

  async update(id: string, data: UpdateActivityInput): Promise<Activity> {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
  },

  async updateStatus(
    id: string,
    status: "PENDING" | "COMPLETED" | "CANCELLED",
  ): Promise<Activity> {
    const response = await api.patch(`/activities/${id}/status`, { status });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/activities/${id}`);
  },
};

export const logService = {
  async findAll(params?: {
    action?: string;
    entity?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AuditLog>> {
    const response = await api.get("/logs", { params });
    return response.data;
  },
};

export default api;
