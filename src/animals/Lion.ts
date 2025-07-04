import { Animal } from "./Animal";
import { Espece } from "../enums/Espece";

export class Lion extends Animal {
	constructor(nom: string) {
		super(nom, Espece.Lion);
	}

	crier(): void {
		console.log(`${this.nom} rugit 🦁 !`);
	}
}
