export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zipCode: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  recentUsers: number;
  birthdaysThisMonth: number;
  recentUsersList: Pick<
    User,
    "id" | "fullName" | "email" | "status" | "createdAt"
  >[];
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  birthDate?: string;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string;
  state?: string;
  zipCode?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

export type SortKey = "fullName" | "email" | "createdAt" | "status";
export type SortDirection = "asc" | "desc";

export interface Activity {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityInput {
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  status?: "PENDING" | "COMPLETED" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export interface UpdateActivityInput {
  title?: string;
  description?: string | null;
  date?: string;
  startTime?: string;
  endTime?: string | null;
  status?: "PENDING" | "COMPLETED" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  priority: "LOW" | "MEDIUM" | "HIGH";
  isRead: boolean;
  readAt?: string | null;
  adminId: string;
  activityId?: string | null;
  link?: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  description: string;
  actor: string;
  adminId?: string | null;
  createdAt: string;
}
