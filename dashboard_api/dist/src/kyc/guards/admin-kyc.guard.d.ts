import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AdminKycGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
