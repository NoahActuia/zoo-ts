import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enclos } from './entities/enclos.entity';
import { CreateEnclosDto } from './dto/create-enclos.dto';

@Injectable()
export class EnclosService {
  constructor(
    @InjectRepository(Enclos)
    private readonly enclosRepo: Repository<Enclos>,
  ) {}

  create(dto: CreateEnclosDto) {
    const enclos = this.enclosRepo.create(dto);
    return this.enclosRepo.save(enclos);
  }

  findAll() {
    return this.enclosRepo.find();
  }

  async findOne(id: number) {
    const enclos = await this.enclosRepo.findOneBy({ id });
    if (!enclos) {
      throw new NotFoundException(`Enclos avec l'ID ${id} non trouvé`);
    }
    return enclos;
  }

  async findByName(name: string) {
    const enclos = await this.enclosRepo.findOneBy({ name });
    if (!enclos) {
      throw new NotFoundException(`Enclos avec le nom ${name} non trouvé`);
    }
    return enclos;
  }

  async update(id: number, dto: Partial<CreateEnclosDto>) {
    const enclos = await this.findOne(id);
    Object.assign(enclos, dto);
    return this.enclosRepo.save(enclos);
  }

  async deleteWithId(id: number) {
    const result = await this.enclosRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Enclos avec l'ID ${id} non trouvé`);
    }
    return { message: `Enclos avec l'ID ${id} supprimé avec succès` };
  }

  async toggleStatus(id: number) {
    const enclos = await this.findOne(id);
    enclos.isActive = !enclos.isActive;
    return this.enclosRepo.save(enclos);
  }
}
