import { Lion } from "./src/animals/Lion";
import { Elephant } from "./src/animals/Elephant";
import { Perroquet } from "./src/animals/Perroquet";
import { Animal } from "./src/animals/Animal";
import { ZooRepository } from "./src/services/ZooRepository";
import { Nourrisseur } from "./src/services/Nourrisseur";

const zoo = new ZooRepository<Animal>();
zoo.add("simba", new Lion("Simba"));
zoo.add("dumbo", new Elephant("Dumbo"));
zoo.add("coco", new Perroquet("Coco"));

console.log("🐾 Bienvenue au Zoo ! 🐾\n");

console.log("=== Tous les animaux crient ===");
const tousLesAnimaux = zoo.getAll();
tousLesAnimaux.forEach((animal) => animal.crier());

console.log("\n=== Nourrissage des animaux ===");
const nourrisseur = new Nourrisseur();
tousLesAnimaux.forEach((animal) => {
	if ("nourrir" in animal) {
		nourrisseur.nourrir(animal as any);
	}
});

console.log("\n=== Fin de la visite du zoo ===");
