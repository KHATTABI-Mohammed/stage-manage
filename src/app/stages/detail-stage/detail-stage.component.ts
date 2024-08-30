import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../services/stage.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-detail-stage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule,
    MatIcon
  ],
  templateUrl: './detail-stage.component.html',
  styleUrls: ['./detail-stage.component.scss']
})
export class DetailStageComponent implements OnInit {
  stage: any;
  isEditing = false;
  id: any;
  user: any = null;
isEdit:boolean=true;
  constructor(
    private route: ActivatedRoute,
    private stageService: StageService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getStage();
    this.getLogin();
  }

  getStage() {
    this.stageService.getStage(this.id).subscribe(
      (data: any) => {
        this.stage = data;
      },
      (error) => {
        this.toastr.error("Erreur lors de la récupération des détails du stage", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      }
    );
  }

  getLogin() {
    this.authService.getLogin().subscribe((res: any) => {
      this.user = res;
      if (this.user?.role == "stagiairesCompte") {
        this.isEdit = false; // Disable editing for this role if needed
      }
    });
  }

  edit() {
    this.isEditing = true;
  }

  save() {
    this.stageService.updateStage(this.stage.id, this.stage).subscribe(
      (response) => {
        this.isEditing = false;
        this.toastr.success("Mise à jour réussie !", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      },
      (error) => {
        this.toastr.error("Erreur lors de la mise à jour", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      }
    );
  }

  cancel() {
    this.isEditing = false;
    this.getStage(); // Reload the data to cancel the changes
  }
}
