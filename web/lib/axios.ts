import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { deleteFromCookie, getFromCookie } from "./cookies";
import { ApiResponse } from "@/types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getFromCookie("token");

    if (token) {
      if (!config.headers) config.headers = new axios.AxiosHeaders();
      if (!(config.headers instanceof axios.AxiosHeaders)) {
        config.headers = new axios.AxiosHeaders(config.headers);
      }
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status || 200;
    const response = error.response || null;
    if (status >= 200 && status <= 400) {
      return response;
    } else if (status === 401) {
      deleteFromCookie("token");
      return response;
    } else if (status > 401 && status < 500) {
      return response;
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
