import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string | null;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: any;
        accessToken: string;
    } | null>;
}
