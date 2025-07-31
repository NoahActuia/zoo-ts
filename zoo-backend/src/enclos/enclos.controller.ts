import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EnclosService } from './enclos.service';
import { CreateEnclosDto } from './dto/create-enclos.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('enclos')
@Controller('enclos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class EnclosController {
  constructor(private readonly enclosService: EnclosService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel enclos' })
  @ApiResponse({
    status: 201,
    description: 'Enclos créé avec succès',
    type: CreateEnclosDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle gardien requis',
  })
  @Roles('gardien')
  create(@Body() createEnclosDto: CreateEnclosDto) {
    return this.enclosService.create(createEnclosDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les enclos' })
  @ApiResponse({
    status: 200,
    description: 'Liste des enclos récupérée avec succès',
    type: [CreateEnclosDto],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findAll() {
    return this.enclosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un enclos par son ID' })
  @ApiParam({ name: 'id', description: "ID de l'enclos", type: Number })
  @ApiResponse({
    status: 200,
    description: 'Enclos récupéré avec succès',
    type: CreateEnclosDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Enclos non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enclosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un enclos' })
  @ApiParam({
    name: 'id',
    description: "ID de l'enclos à modifier",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Enclos modifié avec succès',
    type: CreateEnclosDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle gardien requis',
  })
  @ApiResponse({ status: 404, description: 'Enclos non trouvé' })
  @Roles('gardien')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnclosDto: Partial<CreateEnclosDto>,
  ) {
    return this.enclosService.update(id, updateEnclosDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un enclos' })
  @ApiParam({
    name: 'id',
    description: "ID de l'enclos à supprimer",
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Enclos supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle gardien requis',
  })
  @ApiResponse({ status: 404, description: 'Enclos non trouvé' })
  @Roles('gardien')
  deleteWithId(@Param('id', ParseIntPipe) id: number) {
    return this.enclosService.deleteWithId(id);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Activer/Désactiver un enclos' })
  @ApiParam({
    name: 'id',
    description: "ID de l'enclos à modifier",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Statut de l'enclos modifié avec succès",
    type: CreateEnclosDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Rôle gardien requis',
  })
  @ApiResponse({ status: 404, description: 'Enclos non trouvé' })
  @Roles('gardien')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.enclosService.toggleStatus(id);
  }
}
