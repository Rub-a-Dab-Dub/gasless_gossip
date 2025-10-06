import type { ConfigService } from "@nestjs/config";
import type { Repository } from "typeorm";
import type { User } from "../../users/entities/user.entity";
export interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userRepository;
    constructor(configService: ConfigService, userRepository: Repository<User>);
    validate(payload: JwtPayload): Promise<{
        id: string;
        username: string;
        email: string;
    }>;
}
export {};
