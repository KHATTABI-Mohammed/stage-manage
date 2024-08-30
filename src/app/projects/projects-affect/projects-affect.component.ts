import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { StagiaireService } from '../../services/stagiaire.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-projects-affect',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatFormField,
    MatSelectModule,
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './projects-affect.component.html',
  styleUrls: ['./projects-affect.component.scss']
})
export class ProjectsAffectComponent implements OnInit {
  assignForm!: FormGroup;
  stagiaires: any[] = [];
 
  idStagiaire:any;
  isDejaRendu:boolean=false;
  constructor(
    public dialogRef: MatDialogRef<ProjectsAffectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private stagiaireService: StagiaireService,
    private serviceProjet: ProjectsService
  ) {
    this.assignForm = this.fb.group({
      stagiaireID: ['', Validators.required],
    
    });
  
  }

  ngOnInit(): void {
    this.loadStagiaires();
     
  }

  loadStagiaires(): void {
    this.stagiaireService.getAllStagiaires().subscribe((data: any) => {
      // Tri des stagiaires en fonction de la longueur de idProjets
      this.stagiaires = data.sort((a: any, b: any) => {
        const lengthA = a?.idProjets?.length || 0;
        const lengthB = b?.idProjets?.length || 0;
        return lengthA - lengthB; // Tri décroissant
      });
    });
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAssign(): void {
    if (this.assignForm.valid) {

      this.dialogRef.close(this.assignForm.value);

    }
  }


}
