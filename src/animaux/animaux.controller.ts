import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { AnimauxService } from "./animaux.service";
import { CreateAnimalDto } from "./dto/create-animal.dto";

@Controller("animaux")
export class AnimauxController {
	constructor(private readonly service: AnimauxService) {}

	@Post()
	create(@Body() dto: CreateAnimalDto) {
		return this.service.create(dto);
	}

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(":name")
	findOne(@Param("name") name: string) {
		return this.service.findOne(name);
	}
}
