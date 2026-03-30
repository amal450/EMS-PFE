import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    private db;
    constructor(jwtService: JwtService);
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: {
            username: any;
            role: any;
        };
    }>;
}
