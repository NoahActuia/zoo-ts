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
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('animaux')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AnimauxController {
  constructor(private readonly animauxService: AnimauxService) {}

  @Post()
  @Roles('gardien')
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animauxService.create(createAnimalDto);
  }

  @Get()
  @Roles('gardien', 'veterinaire')
  findAll() {
    return this.animauxService.findAll();
  }

  @Get(':id')
  @Roles('gardien', 'veterinaire')
  findOne(@Param('id') id: number) {
    return this.animauxService.findOne(id);
  }

  @Get('search/name')
  @Roles('gardien', 'veterinaire')
  findByName(@Query('name') name: string) {
    return this.animauxService.findByName(name);
  }

  @Delete(':id')
  @Roles('gardien')
  deleteWithId(@Param('id') id: number) {
    return this.animauxService.deleteWithId(id);
  }
}
