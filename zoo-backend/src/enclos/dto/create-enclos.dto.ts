import { ApiProperty } from '@nestjs/swagger';

export class CreateEnclosDto {
  @ApiProperty({
    description: "Nom de l'enclos",
    example: 'Safari Lions',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Type d'enclos",
    example: 'Safari',
    type: String,
  })
  type!: string;

  @ApiProperty({
    description: "Capacité maximale de l'enclos",
    example: 5,
    type: Number,
    minimum: 1,
  })
  capacity!: number;

  @ApiProperty({
    description: "Description de l'enclos",
    example: 'Grand enclos pour les lions avec vue sur la savane',
    type: String,
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Statut de l'enclos (actif/inactif)",
    example: true,
    type: Boolean,
    default: true,
  })
  isActive?: boolean;
}
