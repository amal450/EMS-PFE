import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/database.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION) 
    private db: NodePgDatabase<typeof schema>
  ) {}

  // Afficher tous les users
  async findAll() {
    return await this.db.select().from(schema.users);
  }

  // Créer un user
async create(data: any) {
  // السطر هذا يفكك الـ data وينحي الـ id لو كان موجود (حتى لو كان null)
  const { id, ...userData } = data; 
  
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return await this.db.insert(schema.users).values({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'USER'
  }).returning();
}

  // --- EL FONCTION HÉDHI HIYA EL NA9SA ---
async update(id: number, data: any) {
  const { id: _, ...updateData } = data;
  
  // الباسورد تتعدى كيف ما هي
  return await this.db.update(schema.users)
    .set(updateData)
    .where(eq(schema.users.id, id))
    .returning();
}
  // Supprimer un user
  async remove(id: number) {
    return await this.db
      .delete(schema.users)
      .where(eq(schema.users.id, id));
  }
}