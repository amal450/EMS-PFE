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
    
    // CAS 1 : Aucune donnée trouvée (Génère des zéros avec les nouveaux noms)
    if (validData.length === 0) {
      return {
        assetId: assetId,
        V1N: '000', V2N: '000', V3N: '000',
        V12: '000', V23: '000', V31: '000',
        I1: '0.0', I2: '0.0', I3: '0.0',
        TKW: '0.00', IKWH: '0.00', HZ: '00.00', PF: '0.00', KVAH: '0.00',
        timestamp: new Date()
      };
    }

    // CAS 2 : Agrégation (Sommes pour les puissances, cumul pour préparer les moyennes)
    const agg = validData.reduce((acc, curr) => ({
      V1N: acc.V1N + (curr.V1N || 0), V2N: acc.V2N + (curr.V2N || 0), V3N: acc.V3N + (curr.V3N || 0),
      V12: acc.V12 + (curr.V12 || 0), V23: acc.V23 + (curr.V23 || 0), V31: acc.V31 + (curr.V31 || 0),
      I1: acc.I1 + (curr.I1 || 0), I2: acc.I2 + (curr.I2 || 0), I3: acc.I3 + (curr.I3 || 0),
      HZ: acc.HZ + (curr.HZ || 0), PF: acc.PF + (curr.PF || 0),
      TKW: acc.TKW + (curr.TKW || 0), // Les puissances/énergies sont additionnées
      IKWH: acc.IKWH + (curr.IKWH || 0),
      KVAH: acc.KVAH + (curr.KVAH || 0),
      count: acc.count + 1
    }), { 
      V1N: 0, V2N: 0, V3N: 0, V12: 0, V23: 0, V31: 0, 
      I1: 0, I2: 0, I3: 0, HZ: 0, PF: 0, TKW: 0, IKWH: 0, KVAH: 0, count: 0 
    });

    // CAS 3 : Retourne le résultat final (Moyennes pour tensions/courants, sommes pour énergie)
    return {
      V1N: (agg.V1N / agg.count).toFixed(1),
      V2N: (agg.V2N / agg.count).toFixed(1),
      V3N: (agg.V3N / agg.count).toFixed(1),
      V12: (agg.V12 / agg.count).toFixed(1),
      V23: (agg.V23 / agg.count).toFixed(1),
      V31: (agg.V31 / agg.count).toFixed(1),
      I1: (agg.I1 / agg.count).toFixed(1),
      I2: (agg.I2 / agg.count).toFixed(1),
      I3: (agg.I3 / agg.count).toFixed(1),
      HZ: (agg.HZ / agg.count).toFixed(2),
      PF: (agg.PF / agg.count).toFixed(2),
      TKW: agg.TKW.toFixed(2),     // Pas de division, c'est la somme totale
      IKWH: agg.IKWH.toFixed(2),   // Pas de division
      KVAH: agg.KVAH.toFixed(2),   // Pas de division
      timestamp: validData[0].timestamp
    };
  }
}