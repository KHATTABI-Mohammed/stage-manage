import { Component, Inject, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectsAffectComponent } from '../projects-affect/projects-affect.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { StagiaireService } from '../../services/stagiaire.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'card-project-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterModule,LoaderComponent,MatIcon],
  templateUrl: './card-project.component.html',
  styleUrls: ['./card-project.component.scss'],
  animations: [
    trigger('cardAnimation', [
      state('in', style({ transform: 'scale(1)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class CardProjectComponent implements OnInit {
  projects: any[] = [];
  isLoading = true;
  assignForm!: FormGroup;
  isStagiaire:boolean = false;
  user:any=null;
  stagiaire:any=null;
  affectationStagiaires:any[]=[];
  projetRapports:any[]=[];
  idProjects:any[]=[];
  stagiaires:any[]=[];
  idProjet:any=null;
  constructor(
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private dialog: MatDialog
    ,private authService: AuthService,
    private toaster:ToastrService,
    private stagiaireService:StagiaireService,
    private route: ActivatedRoute

  ) {
    // Initialize the form with empty values, it will be set when the dialog is opened
    this.assignForm = this.fb.group({
      stagiaireCIN: ['', Validators.required],
      dateAffectation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);
this.idProjet=this.route.snapshot.paramMap.get('id');
    this.loadProjects();
    this.getUserAndLoadProjet();
    this.getAllStagiaires()

  }

  loadProjects(): void {
  
    if(this.user){
      this.projectsService.getProjectById(this.idProjet).subscribe(data => {
        this.projects = [data];
        this.isLoading = false;
      });
    }
 
  }

  // deleteProject(id: string): void {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
  //     this.projectsService.deleteProject(id).subscribe(() => {
  //       this.projects = this.projects.filter(project => project.id !== id);
  //     });
  //   }
  // }

  openAssignDialog(project: any): void {
    const dialogRef = this.dialog.open(ProjectsAffectComponent, {
      width: '600px', // Ajustez la largeur selon vos besoins
    height: 'auto', // Ajustez la hauteur si nécessaire
    disableClose: true, // Empêche la fermeture en dehors du dialogue
    autoFocus: true,// Focalise automatiquement sur le dialogue
      data: { projetId: project.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignProject(project.id,result.stagiaireID);
      }
    });
  }

  assignProject(projetId: string, stagiaireID: string): void {
    this.projectsService.getProjectById(projetId).subscribe(project => {
        this.stagiaireService.getStagiaire(stagiaireID).subscribe(data => {
            this.stagiaire = data;
            
            // Vérifier si le stagiaire est déjà affecté au projet
            if (project?.affectationStagiaires &&project?.affectationStagiaires.some((affectation: any) => affectation.stagiaireID === stagiaireID)) {
                this.toaster.warning("Ce stagiaire est déjà affecté à ce projet !", "", {
                    disableTimeOut: false,
                    titleClass: "toastr_title",
                    messageClass: "toastr_message",
                    timeOut: 5000,
                    closeButton: true,
                });
                return;
            }
            
            // Vérifier si le projet est déjà dans la liste des projets du stagiaire
            if (this.stagiaire.idProjets && this.stagiaire.idProjets.includes(projetId)) {
                this.toaster.warning("Ce stagiaire est déjà affecté à ce projet !", "", {
                    disableTimeOut: false,
                    titleClass: "toastr_title",
                    messageClass: "toastr_message",
                    timeOut: 5000,
                    closeButton: true,
                });
                return;
            }
            
            // Ajouter le projet à la liste des projets du stagiaire
            if(this.stagiaire.idProjets ){
            this.idProjects = [...this.stagiaire.idProjets, projetId];
            }else{
                this.idProjects = [projetId];
            }
            const stagiaireModel = {
                ...this.stagiaire,
                idProjets: this.idProjects
            };

            // Mettre à jour le stagiaire avec le nouveau projet
            this.stagiaireService.updateStagiaire(this.stagiaire.id, stagiaireModel).subscribe(() => {
                this.loadProjects(); // Recharger la liste des projets
            });
            const today = new Date();

            // Ajouter le stagiaire au projet
            const affectStagiaire = {
                stagiaireID: stagiaireID,
                infoStagiaire: this.stagiaire.nom + " " + this.stagiaire.prenom + ":" + this.stagiaire.cin,
             
                dateAffectation: today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
            };
           let updatedAffectations = [];
              if(project?.affectationStagiaires){
                 updatedAffectations = [...project.affectationStagiaires, affectStagiaire]; 
              }
           else{
             updatedAffectations = [affectStagiaire];
           }

            const projectModel = {
                ...project,
                affectationStagiaires: updatedAffectations,
                
            };

            this.projectsService.updateProject(projetId, projectModel).subscribe(() => {
                this.loadProjects(); // Recharger la liste des projets
            });

            this.toaster.success("Projet affecté avec succès !", "", {
                disableTimeOut: false,
                titleClass: "toastr_title",
                messageClass: "toastr_message",
                timeOut: 5000,
                closeButton: true,
            });
        });
    });
}


  private getUserAndLoadProjet() {
    this.authService.getLogin().subscribe(
      (res: any) => {
        this.user = res;
        this.loadProjects();
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


  openDeleteDialog(projetId: string) {
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      width: '400px',
      data: { projetId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
      }
    });
  } 

getAllStagiaires(){
  this.stagiaireService.getAllStagiaires().subscribe((data:any) => {
    this.stagiaires = data;
  })
}
  

}
