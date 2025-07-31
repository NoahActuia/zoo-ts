import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty({
    description: "Nom de l'animal",
    example: 'Simba',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Espèce de l'animal",
    example: 'Lion',
    type: String,
  })
  species!: string;
}
