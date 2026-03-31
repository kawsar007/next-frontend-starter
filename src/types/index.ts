// ═══════════════════════════════════════════════════════════
// Global TypeScript Types — mirrors NestJS backend contracts
// ═══════════════════════════════════════════════════════════

// ── API Envelope ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ── User Types ────────────────────────────────────────────────
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// ── Auth Types ────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserWithTokens {
  user: Pick<User, 'id' | 'email' | 'username' | 'role'>;
  tokens: AuthTokens;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// ── User CRUD Payloads ────────────────────────────────────────
export interface CreateUserPayload {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface UpdateUserPayload {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  status?: UserStatus;
}

// ── UI State Types ────────────────────────────────────────────
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | 'view' | null;
  data?: unknown;
}
