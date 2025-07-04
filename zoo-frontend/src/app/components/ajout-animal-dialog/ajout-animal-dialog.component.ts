import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CreateAnimalDto } from '../../../dto/create-animal.dto';

@Component({
  selector: 'app-ajout-animal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './ajout-animal-dialog.component.html',
})
export class AjoutAnimalDialogComponent {
  animal: CreateAnimalDto = {
    name: '',
    species: '',
    health: 100,
  };

  constructor(public dialogRef: MatDialogRef<AjoutAnimalDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.animal);
  }
}
