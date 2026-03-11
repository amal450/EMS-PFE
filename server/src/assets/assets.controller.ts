import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('tree')
  findAll() {
    return this.assetsService.findAll(); // <--- Dharouri dima famma return
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }

  @Post()
  create(@Body() data: any) {
    return this.assetsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsService.remove(+id);
  }
}