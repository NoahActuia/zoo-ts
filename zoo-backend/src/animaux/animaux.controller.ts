import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AnimauxService } from './animaux.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard, Roles, Public } from '../auth/roles.guard';

@ApiTags('animaux')
@Controller('animaux')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AnimauxController {
  constructor(private readonly animauxService: AnimauxService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel animal' })
  @ApiResponse({
    status: 201,
    description: 'Animal créé avec succès',
    type: CreateAnimalDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle gardien requis',
  })
  @Roles('gardien')
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animauxService.create(createAnimalDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer tous les animaux' })
  @ApiResponse({
    status: 200,
    description: 'Liste des animaux récupérée avec succès',
    type: [CreateAnimalDto],
  })
  findAll() {
    return this.animauxService.findAll();
  }

  @Get('search/name')
  @ApiOperation({ summary: 'Rechercher un animal par son nom' })
  @ApiQuery({ name: 'name', description: "Nom de l'animal à rechercher" })
  @ApiResponse({
    status: 200,
    description: 'Animal trouvé avec succès',
    type: CreateAnimalDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôles gardien ou veterinaire requis',
  })
  @ApiResponse({ status: 404, description: 'Animal non trouvé' })
  @Roles('gardien', 'veterinaire')
  findByName(@Query('name') name: string) {
    return this.animauxService.findByName(name);
  }

  @Get('soigner/:id')
  @ApiOperation({ summary: 'Soigner un animal (remet la santé à 100)' })
  @ApiParam({
    name: 'id',
    description: "ID de l'animal à soigner",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Animal soigné avec succès',
    type: CreateAnimalDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle veterinaire requis',
  })
  @ApiResponse({ status: 404, description: 'Animal non trouvé' })
  @Roles('veterinaire')
  soignerAnimal(@Param('id', ParseIntPipe) id: number) {
    return this.animauxService.soignerAnimal(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un animal par son ID' })
  @ApiParam({ name: 'id', description: "ID de l'animal", type: Number })
  @ApiResponse({
    status: 200,
    description: 'Animal récupéré avec succès',
    type: CreateAnimalDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Animal non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animauxService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un animal par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'animal à supprimer",
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Animal supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle gardien requis',
  })
  @ApiResponse({ status: 404, description: 'Animal non trouvé' })
  @Roles('gardien')
  deleteWithId(@Param('id', ParseIntPipe) id: number) {
    return this.animauxService.deleteWithId(id);
  }
}
