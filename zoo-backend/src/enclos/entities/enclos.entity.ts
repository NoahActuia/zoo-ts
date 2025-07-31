import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Enclos {
  @ApiProperty({
    description: "Identifiant unique de l'enclos",
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Nom de l'enclos",
    example: 'Safari Lions',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Type d'enclos",
    example: 'Safari',
    type: String,
  })
  @Column()
  type: string;

  @ApiProperty({
    description: "Capacité maximale de l'enclos",
    example: 5,
    type: Number,
  })
  @Column()
  capacity: number;

  @ApiProperty({
    description: "Description de l'enclos",
    example: 'Grand enclos pour les lions avec vue sur la savane',
    type: String,
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: "Statut de l'enclos (actif/inactif)",
    example: true,
    type: Boolean,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: "Date de création de l'enclos",
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière modification de l'enclos",
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
