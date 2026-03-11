import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module'; // <--- Zid hédha
import { MeasurementsModule } from './measurements/measurements.module';

@Module({
  imports: [DbModule, UsersModule, AssetsModule, MeasurementsModule],
})
export class AppModule {}