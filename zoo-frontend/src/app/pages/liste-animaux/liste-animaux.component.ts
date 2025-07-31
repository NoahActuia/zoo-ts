import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAnimaux();
  }

  loadAnimaux(): void {
    this.api.get<AnimalDto[]>('/animaux').subscribe({
      next: (animaux) => {
        this.dataSource.data = animaux;
      },
      error: (error) => {
        console.error('Erreur chargement animaux:', error);
        this.showSnackBar('Erreur lors du chargement des animaux', 'error');
      },
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
          this.api.post<AnimalDto>('/animaux', result).subscribe({
            next: (animal) => {
              this.dataSource.data = [...this.dataSource.data, animal];
              this.showSnackBar('Animal ajouté avec succès', 'success');
            },
            error: (error) => {
              console.error('Erreur ajout animal:', error);
              if (error.status === 403) {
                this.showSnackBar(
                  'Accès interdit : Rôle gardien requis pour ajouter un animal',
                  'error'
                );
              } else {
                this.showSnackBar(
                  "Erreur lors de l'ajout de l'animal",
                  'error'
                );
              }
            },
          });
        }
      });
  }

  soignerAnimal(id: number): void {
    this.api.get<any>(`/animaux/soigner/${id}`).subscribe({
      next: (updatedAnimal) => {
        const index = this.dataSource.data.findIndex(
          (animal) => animal.id === id
        );
        if (index !== -1) {
          this.dataSource.data[index] = updatedAnimal;
          this.dataSource._updateChangeSubscription();
        }
        this.showSnackBar('Animal soigné avec succès !', 'success');
      },
      error: (error) => {
        console.error('Erreur soin:', error);
        if (error.status === 403) {
          this.showSnackBar(
            'Accès interdit : Rôle vétérinaire requis pour soigner un animal',
            'error'
          );
        } else if (error.status === 404) {
          this.showSnackBar('Animal non trouvé', 'error');
        } else {
          this.showSnackBar('Erreur lors du soin', 'error');
        }
      },
    });
  }

  relacherAnimal(id: number) {
    if (confirm('Êtes-vous sûr de vouloir relâcher cet animal ?')) {
      this.api.delete<AnimalDto>(`/animaux/${id}`).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (animal) => animal.id !== id
          );
          this.showSnackBar('Animal relâché avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur suppression:', error);
          if (error.status === 403) {
            this.showSnackBar(
              'Accès interdit : Rôle gardien requis pour supprimer un animal',
              'error'
            );
          } else if (error.status === 404) {
            this.showSnackBar('Animal non trouvé', 'error');
          } else {
            this.showSnackBar('Erreur lors de la suppression', 'error');
          }
        },
      });
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }
}
