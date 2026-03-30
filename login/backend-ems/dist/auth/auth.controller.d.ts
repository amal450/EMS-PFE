import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(body: any): Promise<{
        access_token: string;
        user: {
            username: any;
            role: any;
        };
    }>;
}
