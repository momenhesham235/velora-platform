import type { AxiosRequestConfig } from 'axios';
import { axiosClient } from './axios.client';
import { unwrapResponse } from '../handlers';
import type { ApiResponse, InternalRequestMeta } from '../types';

/**
 * Typed HTTP wrapper.
 *
 * Feature APIs call `http.get<User>('/users/me')` and receive `User` —
 * the `{ success, message, data }` envelope is unwrapped here once, not in
 * every feature module.
 *
 * Errors propagate as ApiError (see handlers/api-error.ts), so feature code
 * only needs one catch shape.
 */

export type HttpConfig = AxiosRequestConfig & InternalRequestMeta;

export const http = {
  get<T>(url: string, config?: HttpConfig): Promise<T> {
    return axiosClient
      .get<ApiResponse<T>>(url, config)
      .then((res) => unwrapResponse<T>(res));
  },

  post<T, D = unknown>(url: string, data?: D, config?: HttpConfig): Promise<T> {
    return axiosClient
      .post<ApiResponse<T>>(url, data, config)
      .then((res) => unwrapResponse<T>(res));
  },

  put<T, D = unknown>(url: string, data?: D, config?: HttpConfig): Promise<T> {
    return axiosClient
      .put<ApiResponse<T>>(url, data, config)
      .then((res) => unwrapResponse<T>(res));
  },

  patch<T, D = unknown>(url: string, data?: D, config?: HttpConfig): Promise<T> {
    return axiosClient
      .patch<ApiResponse<T>>(url, data, config)
      .then((res) => unwrapResponse<T>(res));
  },

  delete<T>(url: string, config?: HttpConfig): Promise<T> {
    return axiosClient
      .delete<ApiResponse<T>>(url, config)
      .then((res) => unwrapResponse<T>(res));
  },
};
