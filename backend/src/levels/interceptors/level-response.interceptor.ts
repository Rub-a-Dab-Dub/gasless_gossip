import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { LevelResponseDto } from '../dto/level-response.dto';

@Injectable()
export class LevelResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Add additional computed fields or format response
        if (data && typeof data === 'object' && 'level' in data) {
          const levelData = data as LevelResponseDto;

          return {
            ...levelData,
            // Add computed fields
            isMaxLevel: levelData.level >= 20,
            nextLevelExists: levelData.level < 20,
            // Format progress as a more readable string
            progressText: `${levelData.currentXp}/${levelData.xpThreshold} XP (${levelData.progressPercentage}%)`,
          };
        }

        return data;
      }),
    );
  }
}
