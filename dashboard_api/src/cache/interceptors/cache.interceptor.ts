import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
  } from '@nestjs/common';
  import { Observable, of } from 'rxjs';
  import { tap } from 'rxjs/operators';
  import { CACHE_MANAGER } from '@nestjs/cache-manager';
  import { Cache } from 'cache-manager';
  import { Reflector } from '@nestjs/core';
  import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '../decorators/cacheable.decorator';
  
  @Injectable()
  export class CacheInterceptor implements NestInterceptor {
    constructor(
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
      private reflector: Reflector,
    ) {}
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const cacheKey = this.reflector.get<string>(CACHE_KEY_METADATA, context.getHandler());
      const ttl = this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler());
  
      if (!cacheKey) {
        return next.handle();
      }
  
      const request = context.switchToHttp().getRequest();
      const key = this.generateCacheKey(cacheKey, request);
  
      // Try to get from cache
      const cachedData = await this.cacheManager.get(key);
      if (cachedData) {
        return of(cachedData);
      }
  
      // If not in cache, execute and store
      return next.handle().pipe(
        tap(async (data) => {
          await this.cacheManager.set(key, data, ttl * 1000);
        }),
      );
    }
  
    private generateCacheKey(baseKey: string, request: any): string {
      const userId = request.user?.id || 'anonymous';
      const params = JSON.stringify(request.params || {});
      const query = JSON.stringify(request.query || {});
      return `${baseKey}:${userId}:${params}:${query}`;
    }
  }