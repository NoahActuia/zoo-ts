import { Espece } from "../enums/Espece";

export abstract class Animal {
	name: string;

	constructor(public nom: string, public espece: Espece) {
		this.name = nom;
	}

	abstract crier(): void;
}
