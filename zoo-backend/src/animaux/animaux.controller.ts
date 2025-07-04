import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnimauxService } from './animaux.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('animaux')
export class AnimauxController {
  constructor(private readonly animauxService: AnimauxService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animauxService.create(createAnimalDto);
  }

  @Get()
  findAll() {
    return this.animauxService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.animauxService.findOne(id);
  }

  @Get('search/name')
  findByName(@Query('name') name: string) {
    return this.animauxService.findByName(name);
  }

  @Delete(':id')
  deleteWithId(@Param('id') id: number) {
    return this.animauxService.deleteWithId(id);
  }
}
