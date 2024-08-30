
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { StagiaireService } from '../../services/stagiaire.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StageService } from '../../services/stage.service';
import { LoaderComponent } from '../../loader/loader.component';
@Component({
  selector: 'app-create-stage',
  standalone: true,
  imports: [LoaderComponent,RouterModule,ReactiveFormsModule,CommonModule,MatButtonModule,MatInputModule,MatSelectModule,MatFormFieldModule,MatIconModule,MatToolbarModule,MatCardModule,MatSidenavModule,MatListModule,FlexLayoutModule],
  templateUrl: './create-stage.component.html',
  styleUrl: './create-stage.component.scss'
})
export class CreateStageComponent implements OnInit {
  stageForm!: FormGroup;
ngOnInit(): void {
  this.createForm();
}
  constructor(private fb: FormBuilder,private stageService:StageService,private toaster: ToastrService,private router:Router,private serv :AuthService) {

  }

  createForm(){
    this.stageForm = this.fb.group({
      titre_stage: ['', Validators.required],
      description_stage: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
 
    });
  }
  onSubmit() {
    if (this.stageForm.valid) {
      this.stageService.addStage(this.stageForm.value).subscribe(
        (response) => {
          this.toaster.success("Informations bien enregistrées !", "", {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
          this.router.navigate(['/stages']); // Navigate to the list of stages or another relevant page
        },
        (error) => {
          this.toaster.error("Enregistrement échoué !", "", {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
        }
      );
    } else {

    }
  }
}
