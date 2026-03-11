import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/database.provider';
import * as schema from '../db/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class MeasurementsService {
  constructor(@Inject(DATABASE_CONNECTION) private db: any) {}

  async create(data: any) {
    return await this.db.insert(schema.measurements).values(data).returning();
  }

  async findLatest(assetId: number) {
    const res = await this.db.select()
      .from(schema.measurements)
      .where(eq(schema.measurements.assetId, assetId))
      .orderBy(desc(schema.measurements.timestamp))
      .limit(1);
    return res[0] || null;
  }
}