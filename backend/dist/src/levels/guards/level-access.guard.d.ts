import { type CanActivate, type ExecutionContext } from '@nestjs/common';
export declare class LevelAccessGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
