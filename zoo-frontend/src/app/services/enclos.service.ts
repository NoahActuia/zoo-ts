import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Enclos, CreateEnclosDto } from '../models/enclos.model';

@Injectable({
  providedIn: 'root',
})
export class EnclosService {
  constructor(private apiService: ApiService) {}

  getAllEnclos(): Observable<Enclos[]> {
    return this.apiService.get<Enclos[]>('/enclos');
  }

  getEnclosById(id: number): Observable<Enclos> {
    return this.apiService.get<Enclos>(`/enclos/${id}`);
  }

  createEnclos(enclos: CreateEnclosDto): Observable<Enclos> {
    return this.apiService.post<Enclos>('/enclos', enclos);
  }

  updateEnclos(
    id: number,
    enclos: Partial<CreateEnclosDto>
  ): Observable<Enclos> {
    return this.apiService.put<Enclos>(`/enclos/${id}`, enclos);
  }

  deleteEnclos(id: number): Observable<any> {
    return this.apiService.delete<any>(`/enclos/${id}`);
  }

  toggleEnclosStatus(id: number): Observable<Enclos> {
    return this.apiService.put<Enclos>(`/enclos/${id}/toggle-status`, {});
  }
}
