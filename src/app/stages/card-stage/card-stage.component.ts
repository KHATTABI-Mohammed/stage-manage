import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
@Component({
  selector: 'card-stage',
  standalone: true,
  imports: [LoaderComponent,RouterModule,CommonModule,MatToolbarModule,MatIconModule,MatButtonModule,MatCardModule,MatDividerModule],
  templateUrl: './card-stage.component.html',
  styleUrl: './card-stage.component.scss',
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
export class CardStageComponent implements OnInit{
  stages: any[] = [];
  user: any = null;
  isAddStage: boolean = true;
  isInscrir:boolean=false;
  isInscrit:boolean=false;
  stage:any=null;
  stagiaire:any=null;
  isLoading: boolean = true;
  stageAffectations:any[]=[];
  idStage:any;
  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private toastr: ToastrService,
    private stagiaireService:StagiaireService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.idStage=this.route.snapshot.params['id'];
 this.getStage();
    this.getUserAndLoadStages();
    this.stagiaireService.getStagiaire(this.user.userId).subscribe(
      (data: any) => {
        this.stagiaire = data;
      }
    )
    
  }
getStage(){
  this.stageService.getStage(this.idStage).subscribe(
    (res: any) => {
      this.stages = [res];
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
  )
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
 if ((this.user?.role === 'stagiairesCompte' || this.user?.role === 'encadrantCompte') && this.user!=null) {
      this.getStage();
   
    } else {
      this.stages = [];
      this.isAddStage = false;
    }
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
    )
    this.stagiaireService.getStagiaire(this.user.userId).subscribe(
      (data: any) => {
        this.stagiaire = data;
      }
    )
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        

     if(this.stagiaire.idStage==stageId){
      this.toastr.warning('Vous avez deja inscrit à ce stage !', "", {
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass: "toastr_message",
        timeOut: 5000,
        closeButton: true,
      });

     }else{
      const today = new Date();
      const affectStageModel={
       
        infoStagiaire: this.stagiaire.nom + " " + this.stagiaire.prenom + ":" + this.stagiaire.cin,
        dateAffectation: today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
      }
      if(this.stage.stageAffectations){
        this.stageAffectations=[...this.stage.stageAffectations, affectStageModel]
      }else{
        this.stageAffectations=[affectStageModel]
      }

      const modelStage={
        ...this.stage,
        stageAffectations:this.stageAffectations
      }
      this.stageService.updateStage(this.stage.id, modelStage).subscribe( );
        const model={
          ...this.stagiaire,
          idStage:this.stage.id,
          startDate:this.stage.startDate,
          endDate:this.stage.endDate
        }
     
        this.stagiaireService.updateStagiaire(this.user.userId, model).subscribe(
          (data: any) => {
            this.toastr.success('Stagiaire inscrit avec succès !', "", {
              disableTimeOut: false,
              titleClass: "toastr_title",
              messageClass: "toastr_message",
              timeOut: 5000,
              closeButton: true,
            });
            this.loadStages();
          }
        )
     
      }
    }
    });
    
  }
  // isInscritFct(id:any){
  //   this.stagiaireService.getStagiaire(this.user.userId).subscribe(
  //     (data: any) => {
  //       this.stagiaire = data;
  //     })
  //   if(this.stagiaire.idStage==id){
  //  this.isInscrit= true
  //   }
  //   else{
  //     this.isInscrit= false
  //   }
  // }
}