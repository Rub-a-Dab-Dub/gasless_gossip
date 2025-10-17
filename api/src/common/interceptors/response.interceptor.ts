import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../services/response.service';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: any) => {
        // If the controller already returns a properly formatted response
        if (
          data &&
          typeof data === 'object' &&
          'error' in data &&
          'message' in data &&
          'data' in data
        ) {
          return data;
        }

        // Detect paginated responses
        const isPaginated =
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data &&
          Array.isArray(data.data) &&
          typeof data.meta === 'object';

        if (isPaginated) {
          return {
            error: false,
            message: 'successful',
            data: {
              items: data.data,
              meta: data.meta,
            },
          };
        }

        // Default success format
        return {
          error: false,
          message: 'successful',
          data,
        };
      }),
    );
  }
}
