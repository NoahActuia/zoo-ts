import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Animal {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	species: string;
}
