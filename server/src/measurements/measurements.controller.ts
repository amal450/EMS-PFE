import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';
@Controller('measurements')
@UseGuards(JwtAuthGuard)
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  create(@Body() data: any) {
    return this.measurementsService.create(data);
  }

  @Get('latest/:id')
  findLatest(@Param('id') id: string) {
    return this.measurementsService.findLatest(+id);
  }
}