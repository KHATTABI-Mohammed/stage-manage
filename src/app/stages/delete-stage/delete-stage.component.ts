import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { StageService } from '../../services/stage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-stage',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-stage.component.html',
  styleUrls: ['./delete-stage.component.scss']
})
export class DeleteStageComponent {
  stageId: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteStageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stageService: StageService,
    private toastr: ToastrService
  ) {
    this.stageId = data.stageId;
  }

  confirmDelete(): void {
    this.stageService.deleteStage(this.stageId).subscribe(
      () => {
        this.toastr.success('Stage supprimé avec succès', '', {
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
