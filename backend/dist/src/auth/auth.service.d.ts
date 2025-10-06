import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private users;
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string | null;
        };
        accessToken: string;
    }>;
    validateUser(username: string, password: string): Promise<any>;
    login(username: string, password: string): Promise<{
        user: any;
        accessToken: string;
    } | null>;
}
