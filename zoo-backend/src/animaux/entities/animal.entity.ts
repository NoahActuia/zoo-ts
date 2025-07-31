import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Animal {
  @ApiProperty({
    description: "Identifiant unique de l'animal",
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Nom de l'animal",
    example: 'Simba',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Espèce de l'animal",
    example: 'Lion',
    type: String,
  })
  @Column()
  species: string;

  @ApiProperty({
    description: "Niveau de santé de l'animal (0-100)",
    example: 100,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @Column({ default: 100 })
  health: number;
}
