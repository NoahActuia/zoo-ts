import { Animal } from "./Animal";
import { Espece } from "../enums/Espece";
import { Nourrissable } from "../interfaces/Nourrissable";

export class Perroquet extends Animal implements Nourrissable {
	constructor(nom: string) {
		super(nom, Espece.Perroquet);
	}

	crier(): void {
		console.log(`${this.nom} crie: "Coucou!" 🦜`);
	}

	nourrir(): void {
		console.log(`${this.nom} mange des graines 🌱`);
	}
}
