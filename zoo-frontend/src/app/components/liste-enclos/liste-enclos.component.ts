import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EnclosService } from '../../services/enclos.service';
import { Enclos } from '../../models/enclos.model';
import { AjoutEnclosDialogComponent } from '../ajout-enclos-dialog/ajout-enclos-dialog.component';

@Component({
  selector: 'app-liste-enclos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>🏠 Gestion des Enclos</mat-card-title>
          <mat-card-subtitle> Liste des enclos du zoo </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Bouton Ajouter un enclos -->
          <div class="add-button-container">
            <button
              mat-raised-button
              color="primary"
              (click)="ajouterEnclos()"
              class="add-button"
            >
              <mat-icon>add</mat-icon>
              Ajouter un enclos
            </button>
          </div>

          <div class="loading" *ngIf="loading">
            <p>Chargement des enclos...</p>
          </div>

          <div class="error" *ngIf="error">
            <p>Erreur: {{ error }}</p>
          </div>

          <div class="enclos-grid" *ngIf="enclos.length > 0 && !loading">
            <mat-card class="enclos-card" *ngFor="let enclos of enclos">
              <mat-card-header>
                <mat-card-title>{{ enclos.name }}</mat-card-title>
                <mat-card-subtitle>{{ enclos.type }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <p><strong>Capacité:</strong> {{ enclos.capacity }} animaux</p>
                <p *ngIf="enclos.description">
                  <strong>Description:</strong> {{ enclos.description }}
                </p>

                <div class="status-chip">
                  <mat-chip
                    [color]="enclos.isActive ? 'accent' : 'warn'"
                    selected
                  >
                    {{ enclos.isActive ? 'Actif' : 'Inactif' }}
                  </mat-chip>
                </div>

                <p class="dates">
                  <small>
                    Créé le: {{ enclos.createdAt | date : 'short' }}<br />
                    Modifié le: {{ enclos.updatedAt | date : 'short' }}
                  </small>
                </p>
              </mat-card-content>

              <mat-card-actions>
                <button
                  mat-button
                  color="primary"
                  (click)="toggleStatus(enclos)"
                >
                  <mat-icon>{{
                    enclos.isActive ? 'block' : 'check_circle'
                  }}</mat-icon>
                  {{ enclos.isActive ? 'Désactiver' : 'Activer' }}
                </button>
                <button
                  mat-button
                  color="warn"
                  (click)="deleteEnclos(enclos.id)"
                >
                  <mat-icon>delete</mat-icon>
                  Supprimer
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <div
            class="no-enclos"
            *ngIf="enclos.length === 0 && !loading && !error"
          >
            <p>Aucun enclos trouvé.</p>
            <button mat-raised-button color="primary" (click)="ajouterEnclos()">
              <mat-icon>add</mat-icon>
              Créer le premier enclos
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .add-button-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
      }

      .add-button {
        margin-bottom: 20px;
      }

      .enclos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .enclos-card {
        height: fit-content;
      }

      .status-chip {
        margin: 10px 0;
      }

      .dates {
        margin-top: 15px;
        color: #666;
      }

      .loading,
      .error,
      .no-enclos {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .error {
        color: #f44336;
      }

      .no-enclos {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;
      }
    `,
  ],
})
export class ListeEnclosComponent implements OnInit {
  enclos: Enclos[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private enclosService: EnclosService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEnclos();
  }

  ajouterEnclos(): void {
    const dialogRef = this.dialog.open(AjoutEnclosDialogComponent, {
      width: '500px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.enclosService.createEnclos(result).subscribe({
          next: (newEnclos) => {
            this.enclos.push(newEnclos);
            this.showSnackBar('Enclos créé avec succès', 'success');
          },
          error: (error) => {
            console.error('Erreur création enclos:', error);
            if (error.status === 403) {
              this.showSnackBar(
                'Accès interdit : Rôle gardien requis pour créer un enclos',
                'error'
              );
            } else {
              this.showSnackBar(
                "Erreur lors de la création de l'enclos",
                'error'
              );
            }
          },
        });
      }
    });
  }

  loadEnclos(): void {
    this.loading = true;
    this.error = null;

    this.enclosService.getAllEnclos().subscribe({
      next: (enclos) => {
        this.enclos = enclos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des enclos';
        this.loading = false;
        console.error('Erreur chargement enclos:', error);
        this.showSnackBar('Erreur lors du chargement des enclos', 'error');
      },
    });
  }

  toggleStatus(enclos: Enclos): void {
    this.enclosService.toggleEnclosStatus(enclos.id).subscribe({
      next: (updatedEnclos) => {
        const index = this.enclos.findIndex((e) => e.id === enclos.id);
        if (index !== -1) {
          this.enclos[index] = updatedEnclos;
        }
        this.showSnackBar(
          `Enclos ${
            updatedEnclos.isActive ? 'activé' : 'désactivé'
          } avec succès`,
          'success'
        );
      },
      error: (error) => {
        console.error('Erreur toggle status:', error);
        if (error.status === 403) {
          this.showSnackBar(
            'Accès interdit : Rôle gardien requis pour modifier un enclos',
            'error'
          );
        } else {
          this.showSnackBar(
            'Erreur lors de la modification du statut',
            'error'
          );
        }
      },
    });
  }

  deleteEnclos(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enclos ?')) {
      this.enclosService.deleteEnclos(id).subscribe({
        next: () => {
          this.enclos = this.enclos.filter((e) => e.id !== id);
          this.showSnackBar('Enclos supprimé avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur suppression enclos:', error);
          if (error.status === 403) {
            this.showSnackBar(
              'Accès interdit : Rôle gardien requis pour supprimer un enclos',
              'error'
            );
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
