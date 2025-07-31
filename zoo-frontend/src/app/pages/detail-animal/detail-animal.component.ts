import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-detail-animal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  template: `
    <div class="container">
      <mat-card *ngIf="animal">
        <mat-card-header>
          <mat-card-title>🦁 Détails de l'animal</mat-card-title>
          <mat-card-subtitle>
            Informations complètes sur {{ animal.name }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="animal-details">
            <div class="detail-row">
              <strong>Nom :</strong>
              <span>{{ animal.name }}</span>
            </div>

            <div class="detail-row">
              <strong>Espèce :</strong>
              <span>{{ animal.species }}</span>
            </div>

            <div class="detail-row">
              <strong>Santé :</strong>
              <div class="health-container">
                <span class="health-value">{{ animal.health }}%</span>
                <div class="health-bar">
                  <div
                    class="health-fill"
                    [style.width.%]="animal.health"
                    [class.healthy]="animal.health >= 70"
                    [class.warning]="animal.health >= 30 && animal.health < 70"
                    [class.danger]="animal.health < 30"
                  ></div>
                </div>
              </div>
            </div>

            <div class="detail-row">
              <strong>ID :</strong>
              <span>{{ animal.id }}</span>
            </div>

            <div class="status-chip">
              <mat-chip
                [color]="
                  animal.health >= 70
                    ? 'accent'
                    : animal.health >= 30
                    ? 'warn'
                    : 'warn'
                "
                selected
              >
                {{ getHealthStatus(animal.health) }}
              </mat-chip>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="soignerAnimal()"
            *ngIf="animal.health < 100"
          >
            <mat-icon>healing</mat-icon>
            Soigner l'animal
          </button>
          <button mat-button color="warn" (click)="supprimerAnimal()">
            <mat-icon>delete</mat-icon>
            Supprimer
          </button>
          <button mat-button (click)="retourListe()">
            <mat-icon>arrow_back</mat-icon>
            Retour à la liste
          </button>
        </mat-card-actions>
      </mat-card>

      <div class="loading" *ngIf="loading">
        <p>Chargement des détails...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>Erreur: {{ error }}</p>
        <button mat-raised-button color="primary" (click)="retourListe()">
          Retour à la liste
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .animal-details {
        margin: 20px 0;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
      }

      .detail-row:last-child {
        border-bottom: none;
      }

      .health-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .health-value {
        font-weight: bold;
        min-width: 50px;
      }

      .health-bar {
        width: 200px;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
      }

      .health-fill {
        height: 100%;
        transition: width 0.3s ease;
      }

      .health-fill.healthy {
        background-color: #4caf50;
      }

      .health-fill.warning {
        background-color: #ff9800;
      }

      .health-fill.danger {
        background-color: #f44336;
      }

      .status-chip {
        margin: 20px 0;
      }

      .loading,
      .error {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .error {
        color: #f44336;
      }

      mat-card-actions {
        display: flex;
        gap: 10px;
        padding: 16px;
      }
    `,
  ],
})
export class DetailAnimalComponent implements OnInit {
  animal: Animal | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAnimalDetails();
  }

  loadAnimalDetails(): void {
    this.loading = true;
    this.error = null;

    const animalId = this.route.snapshot.paramMap.get('id');
    if (!animalId) {
      this.error = "ID de l'animal non trouvé";
      this.loading = false;
      return;
    }

    this.apiService.get<Animal>(`/animaux/${animalId}`).subscribe({
      next: (animal) => {
        this.animal = animal;
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.error = 'Animal non trouvé';
        } else if (error.status === 401) {
          this.error = 'Vous devez être connecté pour voir les détails';
        } else {
          this.error = 'Erreur lors du chargement des détails';
        }
        this.loading = false;
        console.error('Erreur chargement détails:', error);
      },
    });
  }

  getHealthStatus(health: number): string {
    if (health >= 70) return 'En bonne santé';
    if (health >= 30) return 'Santé fragile';
    return 'Santé critique';
  }

  soignerAnimal(): void {
    if (!this.animal) return;

    this.apiService.get<any>(`/animaux/soigner/${this.animal.id}`).subscribe({
      next: (updatedAnimal) => {
        this.animal = updatedAnimal;
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

  supprimerAnimal(): void {
    if (!this.animal) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer ${this.animal.name} ?`)) {
      this.apiService.delete<any>(`/animaux/${this.animal.id}`).subscribe({
        next: () => {
          this.showSnackBar('Animal supprimé avec succès', 'success');
          this.retourListe();
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

  retourListe(): void {
    this.router.navigate(['/liste']);
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }
}
