import { Injectable } from "@nestjs/common";
import { CreateAnimalDto } from "./dto/create-animal.dto";

@Injectable()
export class AnimauxService {
	private animaux: CreateAnimalDto[] = [];

	create(dto: CreateAnimalDto) {
		this.animaux.push(dto);
		return dto;
	}

	findAll() {
		return this.animaux;
	}

	findOne(name: string) {
		return this.animaux.find((a) => a.name === name);
	}
}
