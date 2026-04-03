import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  // Pas de guard ici - route publique
  create(@Body() data: any) {
    console.log('📊 Données reçues du simulateur:', data);
    return this.measurementsService.create(data);
  }

  @Get('latest/:id')
  @UseGuards(JwtAuthGuard) // Seulement cette route est protégée
  findLatest(@Param('id') id: string) {
    return this.measurementsService.findLatest(+id);
  }
}