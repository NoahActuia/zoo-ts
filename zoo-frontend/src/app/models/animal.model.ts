export interface Animal {
  id: number;
  name: string;
  species: string;
  health: number;
}

export interface CreateAnimalDto {
  name: string;
  species: string;
  health?: number;
}
