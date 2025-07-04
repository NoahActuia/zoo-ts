import { Animal } from "./Animal";
import { Espece } from "../enums/Espece";
import { Nourrissable } from "../interfaces/Nourrissable";

export class Elephant extends Animal implements Nourrissable {
	constructor(nom: string) {
		super(nom, Espece.Elephant);
	}

	crier(): void {
		console.log(`${this.nom} barrit !`);
	}

	nourrir(): void {
		console.log(`${this.nom} mange des feuilles 🥬`);
	}
}
