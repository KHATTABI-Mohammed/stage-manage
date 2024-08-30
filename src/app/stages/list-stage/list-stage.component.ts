import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StagiaireService } from '../../services/stagiaire.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { StageService } from '../../services/stage.service';
import { DeleteStageComponent } from '../delete-stage/delete-stage.component';
import { InscrirStageComponent } from '../inscrir-stage/inscrir-stage.component';
import { LoaderComponent } from '../../loader/loader.component';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-list-stage',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,LoaderComponent,MatLabel,MatFormField,RouterModule, MatTableModule, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatDividerModule],
  templateUrl: './list-stage.component.html',
  styleUrls: ['./list-stage.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in-out', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ListStageComponent implements OnInit {
  stages: any[] = [];
  filteredStages: any[] = [];
  user: any = null;
  isAddStage: boolean = true;
  isInscrir: boolean = false;
  isInscrit: boolean = false;
  stage: any = null;
  stagiaire: any = null;
  isLoading: boolean = true;
  stageAffectations: any[] = [];
  displayedColumns: string[] = ['titre_stage', 'startDate', 'endDate', 'actions'];

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private toastr: ToastrService,
    private stagiaireService: StagiaireService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.getUserAndLoadStages();
  }

  private getUserAndLoadStages() {
    this.authService.getLogin().subscribe(
      (res: any) => {
        this.user = res;
        this.loadStages();
      },
      (err) => {
        this.toastr.error('Erreur lors de la récupération de l\'utilisateur', "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      }
    );
  }

  private loadStages() {
    if (this.user?.role === 'encadrantCompte' && this.user != null) {
      this.stageService.getAllStage().subscribe(
        (res: any) => {
          this.stages = res;
          this.filteredStages = [...this.stages];
          this.isAddStage = true;
          this.isInscrir = false;
        },
        (err) => {
          this.toastr.error('Erreur lors du chargement des stages', "", {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
        }
      );
    } else if (this.user?.role === 'stagiairesCompte' && this.user != null) {
      this.stagiaireService.getStagiaire(this.user.userId).subscribe(
        (res: any) => {
          this.stagiaire = res;
          if (this.stagiaire?.idStage == null) {
            this.isAddStage = false;
            this.stageService.getAllStage().subscribe(
              (res: any) => {
                this.stages = res;
                this.filteredStages = [...this.stages];
                this.isAddStage = false;
                this.isInscrir = true;
              },
              (err) => {
                this.toastr.error('Erreur lors du chargement des stages', "", {
                  disableTimeOut: false,
                  titleClass: "toastr_title",
                  messageClass: "toastr_message",
                  timeOut: 5000,
                  closeButton: true,
                });
              }
            );
            return;
          }
          this.stageService.getStage(this.stagiaire?.idStage).subscribe(
            (res: any) => {
              if (res == null) {
                this.stages = [];
                this.filteredStages = [];
              } else {
                this.isAddStage = false;
                this.stages = [res];
                this.filteredStages = [...this.stages];
                this.isInscrir = true;
              }
            },
            (err) => {
              this.toastr.error('Erreur lors du chargement du stage', "", {
                disableTimeOut: false,
                titleClass: "toastr_title",
                messageClass: "toastr_message",
                timeOut: 5000,
                closeButton: true,
              });
            }
          );
        },
        (err) => {
          this.toastr.info('Erreur lors du chargement du stagiaire ou stagiaire inexistant !', "", {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
        }
      );
    } else {
      this.stages = [];
      this.filteredStages = [];
      this.isAddStage = false;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredStages = this.stages.filter(stage =>
      stage.titre_stage.toLowerCase().includes(filterValue) ||
      stage.startDate.toLowerCase().includes(filterValue) ||
      stage.endDate.toLowerCase().includes(filterValue)
    );
  }
  

  openDeleteDialog(stageId: string) {
    const dialogRef = this.dialog.open(DeleteStageComponent, {
      width: '400px',
      data: { stageId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStages();
      }
    });
  }

  openInscriptionDialog(stageId: any) {
    const dialogRef = this.dialog.open(InscrirStageComponent, {
      width: '400px',
      data: { stageId }
    });

    this.stageService.getStage(stageId).subscribe(
      (data: any) => {
        this.stage = data;
      }
    );

    this.stagiaireService.getStagiaire(this.user.userId).subscribe(
      (data: any) => {
        this.stagiaire = data;
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.stagiaire.idStage == stageId) {
          this.toastr.warning('Vous êtes déjà inscrit à ce stage !', "", {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
        } else {
          const today = new Date();
          const affectStageModel = {
            infoStagiaire: `${this.stagiaire.nom} ${this.stagiaire.prenom}:${this.stagiaire.cin}`,
            dateAffectation: today.toISOString().split('T')[0]
          };

          this.stageAffectations = this.stage.stageAffectations ? [...this.stage.stageAffectations, affectStageModel] : [affectStageModel];

          const modelStage = {
            ...this.stage,
            stageAffectations: this.stageAffectations
          };

          this.stageService.updateStage(this.stage.id, modelStage).subscribe(() => {
            const model = {
              ...this.stagiaire,
              idStage: this.stage.id,
              startDate: this.stage.startDate,
              endDate: this.stage.endDate
            };

            this.stagiaireService.updateStagiaire(this.user.userId, model).subscribe(() => {
              this.toastr.success('Stagiaire inscrit avec succès !', "", {
                disableTimeOut: false,
                titleClass: "toastr_title",
                messageClass: "toastr_message",
                timeOut: 5000,
                closeButton: true,
              });
              this.loadStages();
            });
          });
        }
      }
    });
  }

  downloadAttestation() {
    // Implement your logic for downloading the attestation here.
  }
}
