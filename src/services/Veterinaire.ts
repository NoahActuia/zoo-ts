import { Soignable } from "../interfaces/Soignable";

export class Veterinaire {
	soigner(animal: Soignable): void {
		animal.soigner();
	}
}
