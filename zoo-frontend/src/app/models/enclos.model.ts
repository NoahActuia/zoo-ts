export interface Enclos {
  id: number;
  name: string;
  type: string;
  capacity: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEnclosDto {
  name: string;
  type: string;
  capacity: number;
  description?: string;
  isActive?: boolean;
}
