/**
 * Global Types
 *
 * IMPORTANT: User type MUST match backend response
 *
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "manager";
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Helper to get full name from user
 */
export const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
