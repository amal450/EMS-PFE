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
    const allAssets = await this.db.select().from(schema.assets);
    const getAllDescendantIds = (id: number): number[] => {
      const children = allAssets.filter(a => a.parentId === id);
      let ids = [id];
      for (const child of children) { ids = [...ids, ...getAllDescendantIds(child.id)]; }
      return ids;
    };

    const targetIds = getAllDescendantIds(assetId);
    const latestRecords = await Promise.all(
      targetIds.map(async (id) => {
        const res = await this.db.select().from(schema.measurements)
          .where(eq(schema.measurements.assetId, id))
          .orderBy(desc(schema.measurements.timestamp)).limit(1);
        return res[0];
      })
    );

    const validData = latestRecords.filter(r => r != null);
    if (validData.length === 0) {
      return {
      assetId: assetId,
      power: '0.00', i1: '0.0', i2: '0.0', i3: '0.0',
      v1: '000', v2: '000', v3: '000', u1: '000', u2: '000', u3: '000',
      frequency: '00.00', cosPhi: '0.00', timestamp: new Date()
      };
    }

    const agg = validData.reduce((acc, curr) => ({
      power: acc.power + (curr.power || 0),
      i1: acc.i1 + (curr.i1 || 0), i2: acc.i2 + (curr.i2 || 0), i3: acc.i3 + (curr.i3 || 0),
      v1: acc.v1 + (curr.v1 || 0), v2: acc.v2 + (curr.v2 || 0), v3: acc.v3 + (curr.v3 || 0),
      u1: acc.u1 + (curr.u1 || 0), u2: acc.u2 + (curr.u2 || 0), u3: acc.u3 + (curr.u3 || 0),
      freq: acc.freq + (curr.frequency || 0),
      cos: acc.cos + (curr.cosPhi || 0),
      count: acc.count + 1
    }), { power: 0, i1:0, i2:0, i3:0, v1:0, v2:0, v3:0, u1:0, u2:0, u3:0, freq:0, cos:0, count: 0 });

    return {
      power: agg.power.toFixed(2),
      i1: (agg.i1 / agg.count).toFixed(1), i2: (agg.i2 / agg.count).toFixed(1), i3: (agg.i3 / agg.count).toFixed(1),
      v1: (agg.v1 / agg.count).toFixed(1), v2: (agg.v2 / agg.count).toFixed(1), v3: (agg.v3 / agg.count).toFixed(1),
      u1: (agg.u1 / agg.count).toFixed(1), u2: (agg.u2 / agg.count).toFixed(1), u3: (agg.u3 / agg.count).toFixed(1),
      frequency: (agg.freq / agg.count).toFixed(2),
      cosPhi: (agg.cos / agg.count).toFixed(2), 
      timestamp: validData[0].timestamp
    };
  }
}