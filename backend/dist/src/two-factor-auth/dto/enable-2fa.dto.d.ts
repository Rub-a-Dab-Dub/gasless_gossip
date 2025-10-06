import { TwoFactorMethod } from '../entities/two-factor.entity';
export declare class Enable2FADto {
    userId: string;
    method: TwoFactorMethod;
    secret?: string;
}
