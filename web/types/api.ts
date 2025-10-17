export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  data: T;
  status?: string | number;
  statusCode?: string | number;
}
