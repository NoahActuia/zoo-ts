import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnclosService } from '../../services/enclos.service';
import { CreateEnclosDto } from '../../models/enclos.model';

@Component({
  selector: 'app-ajout-enclos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>🏠 Ajouter un nouvel enclos</h2>

    <form [formGroup]="enclosForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom de l'enclos</mat-label>
            <input
              matInput
              formControlName="name"
              placeholder="Ex: Safari Lions"
            />
            <mat-error *ngIf="enclosForm.get('name')?.hasError('required')">
              Le nom est requis
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Type d'enclos</mat-label>
            <mat-select formControlName="type">
              <mat-option value="Safari">Safari</mat-option>
              <mat-option value="Aquarium">Aquarium</mat-option>
              <mat-option value="Volière">Volière</mat-option>
              <mat-option value="Terrarium">Terrarium</mat-option>
              <mat-option value="Enclos">Enclos standard</mat-option>
            </mat-select>
            <mat-error *ngIf="enclosForm.get('type')?.hasError('required')">
              Le type est requis
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Capacité</mat-label>
            <input
              matInput
              type="number"
              formControlName="capacity"
              placeholder="Ex: 5"
            />
            <mat-error *ngIf="enclosForm.get('capacity')?.hasError('required')">
              La capacité est requise
            </mat-error>
            <mat-error *ngIf="enclosForm.get('capacity')?.hasError('min')">
              La capacité doit être d'au moins 1
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (optionnel)</mat-label>
            <textarea
              matInput
              formControlName="description"
              placeholder="Ex: Grand enclos pour les lions avec vue sur la savane"
              rows="3"
            ></textarea>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-checkbox formControlName="isActive" color="primary">
            Enclos actif
          </mat-checkbox>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="enclosForm.invalid || loading"
        >
          {{ loading ? 'Création...' : 'Créer l'enclos' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form-row {
        margin-bottom: 16px;
      }

      .full-width {
        width: 100%;
      }

      mat-dialog-content {
        min-width: 400px;
      }

      mat-dialog-actions {
        padding: 16px 0;
      }
    `,
  ],
})
export class AjoutEnclosDialogComponent {
  enclosForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjoutEnclosDialogComponent>,
    private enclosService: EnclosService,
    private snackBar: MatSnackBar
  ) {
    this.enclosForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      isActive: [true],
    });
  }

  onSubmit(): void {
    if (this.enclosForm.valid) {
      this.loading = true;
      const enclosData: CreateEnclosDto = this.enclosForm.value;

      this.enclosService.createEnclos(enclosData).subscribe({
        next: (enclos) => {
          this.loading = false;
          this.snackBar.open('Enclos créé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.dialogRef.close(enclos);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erreur création enclos:', error);
          this.snackBar.open(
            "Erreur lors de la création de l'enclos",
            'Fermer',
            {
              duration: 3000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
