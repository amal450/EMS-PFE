import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
  private db;
  constructor(private jwtService: JwtService) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async login(email: string, pass: string) {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user || user.password !== pass) { 
      // Note : On compare en clair ici pour ton premier test
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { username: user.username, role: user.role }
    };
  }
}