import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AjoutAnimalDialogComponent } from '../../components/ajout-animal-dialog/ajout-animal-dialog.component';
import { AnimalDto } from '../../../dto/animal.dto';
import { CreateAnimalDto } from '../../../dto/create-animal.dto';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-liste-animaux',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './liste-animaux.component.html',
})
export class ListeAnimauxComponent implements OnInit {
  displayedColumns: string[] = ['name', 'species', 'health', 'action'];
  dataSource: MatTableDataSource<AnimalDto> =
    new MatTableDataSource<AnimalDto>();

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.api.get<AnimalDto[]>('/animaux').subscribe((animaux) => {
      this.dataSource.data = animaux;
    });
  }

  ajouterAnimal() {
    this.dialog
      .open(AjoutAnimalDialogComponent, {
        height: '400px',
        width: '400px',
      })
      .afterClosed()
      .subscribe((result: CreateAnimalDto) => {
        if (result) {
          this.api.post<AnimalDto>('/animaux', result).subscribe((animal) => {
            this.dataSource.data = [...this.dataSource.data, animal];
          });
        }
      });
  }

  relacherAnimal(id: number) {
    this.api.delete<AnimalDto>(`/animaux/${id}`).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (animal) => animal.id !== id
      );
    });
  }
}
