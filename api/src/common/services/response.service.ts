import { Injectable } from '@nestjs/common';

export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseService {
  success<T>(data: T, message = 'successful'): ApiResponse<T> {
    return {
      error: false,
      message,
      data,
    };
  }

  failure<T = null>(message = 'failed', data: T): ApiResponse<T> {
    return {
      error: true,
      message,
      data,
    };
  }
}
