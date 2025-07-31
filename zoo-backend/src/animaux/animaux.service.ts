import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class AnimauxService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
  ) {}

  create(dto: CreateAnimalDto) {
    const animal = this.animalRepo.create(dto);
    return this.animalRepo.save(animal);
  }

  findAll() {
    return this.animalRepo.find();
  }

  async findOne(id: number) {
    const animal = await this.animalRepo.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal avec l'ID ${id} non trouvé`);
    }
    return animal;
  }

  async findByName(name: string) {
    const animal = await this.animalRepo.findOneBy({ name });
    if (!animal) {
      throw new NotFoundException(`Animal avec le nom ${name} non trouvé`);
    }
    return animal;
  }

  async deleteWithId(id: number) {
    const result = await this.animalRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Animal avec l'ID ${id} non trouvé`);
    }
    return { message: `Animal avec l'ID ${id} supprimé avec succès` };
  }

  async soignerAnimal(id: number) {
    const animal = await this.findOne(id);
    animal.health = 100;
    return this.animalRepo.save(animal);
  }
}
