import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProjectsAffectComponent } from '../projects-affect/projects-affect.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { StagiaireService } from '../../services/stagiaire.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { LoaderComponent } from '../../loader/loader.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [LoaderComponent, MatTableModule, CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule, ProjectsAffectComponent, DeleteProjectComponent,MatLabel,MatFormFieldModule,MatInputModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class ProjectsListComponent implements OnInit {
  projects: any[] = [];
  dataSource = new MatTableDataSource<any>(this.projects); // Utilisation de MatTableDataSource
  isLoading = true;
  displayedColumns: string[] = ['nom', 'dateRendu', 'stagiaires', 'actions']; // Définir les colonnes à afficher
  user: any = null;

  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    private toaster: ToastrService,
    private stagiaireService: StagiaireService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.loadProjects();
  }

  loadProjects(): void {
    this.authService.getLogin().subscribe(
      (res: any) => {
        this.user = res;
        if (this.user?.role === 'encadrantCompte') {
          this.projectsService.getAllProjects().subscribe(data => {
            this.projects = data;
            this.dataSource.data = this.projects; // Mise à jour de la dataSource
          });
        } else if (this.user?.role === 'stagiairesCompte') {
          console.log(this.user)
          this.stagiaireService.getStagiaire(this.user?.userId).subscribe((data: any) => {
            const stagiaire = data;
            if (stagiaire.idProjets.length === 0) {
              this.toaster.info("Vous n'avez pas encore de projet à faire !");
              this.projects = [];
              this.dataSource.data = this.projects; // Mise à jour de la dataSource
              return;
            }else{
            this.projects = [];
            stagiaire.idProjets.forEach((element: any) => {
              this.projectsService.getProjectById(element).subscribe(project => {
                this.projects.push(project);
                this.dataSource.data = this.projects; // Mise à jour de la dataSource
              });
            });}
          
          }, err => {
            this.toaster.error("Erreur lors du chargement du stagiaire.");
          });
        }
      },
      err => {
        this.toaster.error('Erreur lors de la récupération de l\'utilisateur');
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDeleteDialog(projetId: string): void {
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
}
