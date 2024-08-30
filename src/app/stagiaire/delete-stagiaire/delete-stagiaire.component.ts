import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { StagiaireService } from '../../services/stagiaire.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-stagiaire',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-stagiaire.component.html',
  styleUrls: ['./delete-stagiaire.component.scss']
})
export class DeleteStagiaireComponent {
  stagiaireId: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteStagiaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stagiaireService: StagiaireService,
    private toastr: ToastrService
  ) {
    this.stagiaireId = data.stagiaireId;
  }

  confirmDelete(): void {
    this.stagiaireService.deleteStagiaire(this.stagiaireId).subscribe(
      () => {
        this.toastr.success('Stagiaire supprimé avec succès', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });
        this.dialogRef.close(true);
      },
      (error) => {
        this.toastr.error('Erreur lors de la suppression', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });

      }
    );
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
