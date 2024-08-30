import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StageService } from '../../services/stage.service';
import { ToastrService } from 'ngx-toastr';
import { StagiaireService } from '../../services/stagiaire.service';
@Component({
  selector: 'app-inscrir-stage',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    
  ],
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>
      <p>Êtes-vous sûr de vouloir inscrire cet étudiant à ce stage ?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annuler</button>
      <button mat-raised-button color="primary" (click)="confirm()">Confirmer</button>
    </mat-dialog-actions>
  `,
})
export class InscrirStageComponent implements OnInit {
 
  constructor(
    public dialogRef: MatDialogRef<InscrirStageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private stageService: StageService,
    private stagiaireService:StagiaireService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
 
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {

        this.dialogRef.close(true);
  
}


}
