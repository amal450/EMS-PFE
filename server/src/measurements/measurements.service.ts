import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/database.provider';
import * as schema from '../db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

@Injectable()
export class MeasurementsService {
  constructor(@Inject(DATABASE_CONNECTION) private db: any) {}

  async create(data: any) {
    const { id, ...cleanData } = data;
    return await this.db.insert(schema.measurements).values(cleanData).returning();
  }

  // --- EL 9OWWA HOUNI: AGGREGATION LOGIC ---
  async findLatest(assetId: number) {
    // 1. Njibou el Assets el koll bech na3rfou el hierarchy
    const allAssets = await this.db.select().from(schema.assets);

    // 2. Fonction bech njibou el IDs mta3 el element w kol sgharou (recursive)
    const getAllDescendantIds = (id: number): number[] => {
      const children = allAssets.filter(a => a.parentId === id);
      let ids = [id];
      for (const child of children) {
        ids = [...ids, ...getAllDescendantIds(child.id)];
      }
      return ids;
    };

    const targetIds = getAllDescendantIds(assetId);

    // 3. Njibou el "Latest Measurement" l-kol Element f wast el IDs hédhom
    // Houni nasta3mlou inArray bech n-targetou el sghar el koll
    const latestRecords = await Promise.all(
      targetIds.map(async (id) => {
        const res = await this.db.select()
          .from(schema.measurements)
          .where(eq(schema.measurements.assetId, id))
          .orderBy(desc(schema.measurements.timestamp))
          .limit(1);
        return res[0];
      })
    );

    // 4. Filtrage: Na7i el elements elli ma 3andhomch datha (null)
    const validData = latestRecords.filter(r => r !== undefined && r !== null);

    if (validData.length === 0) return null;

    // 5. AGGREGATION: Nejraw el jam3 (SUM) mta3 el Power w Moyenne mta3 el Tension
    const aggregated = validData.reduce((acc, curr) => {
      return {
        power: acc.power + (curr.power || 0),
        voltage: acc.voltage + (curr.voltage || 0),
        intensity: acc.intensity + (curr.intensity || 0),
        count: acc.count + 1
      };
    }, { power: 0, voltage: 0, intensity: 0, count: 0 });

    // Traja3 el natija kima y-7ibha el Dashboard
    return {
      assetId: assetId,
      power: aggregated.power.toFixed(2),
      voltage: (aggregated.voltage / aggregated.count).toFixed(1), // Moyenne
      intensity: aggregated.intensity.toFixed(1),
      timestamp: validData[0].timestamp
    };
  }
}