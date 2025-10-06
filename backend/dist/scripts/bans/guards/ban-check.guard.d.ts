import { CanActivate, ExecutionContext } from '@nestjs/common';
import { BansService } from '../bans.service';
export declare class BanCheckGuard implements CanActivate {
    private bansService;
    constructor(bansService: BansService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
