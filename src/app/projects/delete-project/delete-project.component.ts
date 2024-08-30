import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { StageService } from '../../services/stage.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-delete-project',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-project.component.html',
  styleUrl: './delete-project.component.scss'
})
export class DeleteProjectComponent {
  projetId: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projetService: ProjectsService,
    private toastr: ToastrService
  ) {
    this.projetId = data.projetId;
  }

  confirmDelete(): void {
    this.projetService.deleteProject(this.projetId).subscribe(
      () => {
        this.toastr.success('projet supprimé avec succès', '', {
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
