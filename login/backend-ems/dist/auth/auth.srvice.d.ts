import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private jwtService;
    private configService;
    private db;
    constructor(jwtService: JwtService, configService: ConfigService);
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: {
            username: any;
            role: any;
        };
    }>;
}
