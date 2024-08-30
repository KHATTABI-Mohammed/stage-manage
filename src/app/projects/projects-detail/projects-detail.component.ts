import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StageService } from '../../services/stage.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { get } from 'http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StagiaireService } from '../../services/stagiaire.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-projects-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,

  
    FlexLayoutModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './projects-detail.component.html',
  styleUrls: ['./projects-detail.component.scss']
})
export class ProjectsDetailComponent implements OnInit {
  project: any;
  isEditing = false;
  user:any=null;
  stagiaire:any=null;
  stagiairee:any=null;
  isStagiaire:boolean = false;
  ProjetForm!: FormGroup;
  isSubmitted :boolean= false;
  projectRapport:any[]=[];
  rapportProjetLien:any=null;
  idStagiaire: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private toaster:ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    private stagiaireService:StagiaireService,
    private http :HttpClient
 
  ) {
  
  }

  ngOnInit(): void {
    this.creattForm();
    this.loadProjectDetails();
    this.getUserAndLoadProjet();
    this.isSubmit();
  }

  creattForm(): void {
    this.ProjetForm = this.fb.group({
      projetLien: [null, Validators.required],
      rapport: [null, Validators.required],
    }); 
  }
  loadProjectDetails(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectsService.getProjectById(projectId).subscribe(
        (data) => {
          this.project = data;
        },
        (error) => {
    
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/projects-list']);
  }

  edit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.projectsService.updateProject(this.project.id, this.project).subscribe(
      (response) => {
        this.isEditing = false;
        this.toaster.success("Projet mis à jour avec succes !", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
        // Vous pouvez ajouter une notification de succès ici
      },
      (error) => {
        this.toaster.error("Projet non mis à jour !", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
        // Vous pouvez ajouter une notification d'erreur ici
      }
    );


  }

  cancel(): void {
    this.isEditing = false;
    this.loadProjectDetails(); // Recharger les données pour annuler les modifications
  }
  private getUserAndLoadProjet() {
    this.authService.getLogin().subscribe(
      (res: any) => {
        this.user = res;
        
      },
      (err) => {
    
        this.toaster.error('Erreur lors de la récupération de l\'utilisateur', "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      }
    );
  }
isDeadLine(project: any): boolean {
    const dateRendu = new Date(project.dateRendu); // Conversion de la date de rendu en objet Date
    const currentDate = new Date(); // Date actuelle

    // Comparaison des deux dates
    if (dateRendu > currentDate) {
        return true;
    } else {
        return false;
    }
}
onSubmit(): void {
  if (this.ProjetForm.valid) {
    const formData = new FormData();
    formData.append('rapport', this.ProjetForm.get('rapport')?.value);

    this.projectsService.uploadFile(formData).subscribe(
      (response) => {
     
        const rapportPath = response.rapportPath;
      
        this.stagiaireService.getStagiaire(this.user?.userId).subscribe((data:any) => {
          this.stagiairee=data;
        })
      
        const model = {
          ...this.project,
          idStagiaire: this.user?.userId,
          infostagiaire:this.stagiairee.nom + ' ' + this.stagiairee.prenom+":"+this.stagiairee.cin,
          projetLien: this.ProjetForm.get('projetLien')?.value,
          rapport: rapportPath,  // Save the uploaded rapport path
        };
        this.projectsService.addProjectRapport(model).subscribe(
          (result) => { 
            this.toaster.success("Informations bien enregistrées !", "", {
              disableTimeOut: false,
              titleClass: "toastr_title",
              messageClass: "toastr_message",
              timeOut: 5000,
              closeButton: true,
            });

            this.router.navigate(['/projects-list']);
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
      },
      (error) => {
        this.toaster.error("Sauvegarde échouée !", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
     
      }
      
    );
  }
}

onFileSelected(event: any, fieldName: string): void {
  const file = event.target.files[0];
  if (file) {
    // Directly set the file to the form control
    this.ProjetForm.patchValue({
      [fieldName]: file
    });
  }
}
isSubmit(){
  this.projectsService.getAllProjetRapport().subscribe((data:any) => {
    this.projectRapport = data;
   this.projectRapport.forEach((element:any) => {
    if(element.idStagiaire==this.user?.userId && element.id==this.project.id){
      this.isSubmitted=true;
      this.rapportProjetLien=element;
    }

    if(element.id==this.project.id){
     this.stagiaireService.getStagiaire(element.idStagiaire).subscribe((data:any) => {
      this.stagiaire=data;
     })
    }
   })
  })
}
valider(rendu:any){
  const model = {
    ...rendu,
    isValide:true
  }
this.projectsService.updateProjetRapport(rendu.id,model).subscribe((data:any) => {
  this.toaster.success("Rapport valide !", "", {
    disableTimeOut: false,
    titleClass: "toastr_title",
    messageClass: "toastr_message",
    timeOut: 5000,
    closeButton: true,
  })
})
// Ajouter la validation à un stagiaire spécifique
this.project.affectationStagiaires.find(
  (s: any) => s.stagiaireID === this.stagiaire.id
).isValider = true;

const modelProjet={
  ...this.project,
 
}

this.projectsService.updateProject(rendu.id,modelProjet).subscribe((data:any) => {
  console.log(data)
})
this.stagiaireService.getStagiaire(rendu.idStagiaire).subscribe((data:any) => {
   // Envoyez l'attestation par e-mail via ProjectsService
   this.projectsService.sendAttestation(data.email, data.nom, data.prenom,data.id).subscribe(() => {
    this.toaster.info(`Email envoyé avec attestation à ${data.nom} ${data.prenom}!`, "", {
      disableTimeOut: false,
      titleClass: "toastr_title",
      messageClass: "toastr_message",
      timeOut: 5000,
      closeButton: true,
    });
  
  });


  this.stagiaire=data;
  const model={
    ...data,
    isValider:true
  }
  this.stagiaireService.updateStagiaire(rendu.idStagiaire,model).subscribe((data:any) => {
 
    this.toaster.info(`Attestation bien envoyée vers le stagiaire ${data.nom} ${data.prenom}!`, "", {
      disableTimeOut: false,
      titleClass: "toastr_title",
      messageClass: "toastr_message",
      timeOut: 5000,
      closeButton: true,
    })
  })
})
}

getStagiaire(id:any){
this.stagiaireService.getStagiaire(this.idStagiaire).subscribe((data:any) => {
  this.stagiaire=data;
})
}
}
