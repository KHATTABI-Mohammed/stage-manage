import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatIconModule,LoaderComponent
  ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  projectForm!: FormGroup;
  isLoading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.createForm();
  }

  createForm() {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateRendu: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.projectsService.addProject(this.projectForm.value).subscribe(
        (response) => {
          this.toastr.success('Projet ajouté avec succès !', '', {
            disableTimeOut: false,
            timeOut: 5000,
            closeButton: true
          });
          this.router.navigate(['/projects-list']);
        },
        (error) => {
          this.toastr.error('Échec de l\'ajout du projet !', '', {
            disableTimeOut: false,
            timeOut: 5000,
            closeButton: true
          });
     
        }
      );
    } else {
    
    }
  }
}
