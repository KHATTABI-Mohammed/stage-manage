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
import { DeleteStagiaireComponent } from '../delete-stagiaire/delete-stagiaire.component';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../loader/loader.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-card-stagiaire',
  standalone: true,
  imports: [
    LoaderComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatDividerModule,
    MatCardModule
  ],
  templateUrl: './card-stagiaire.component.html',
  styleUrls: ['./card-stagiaire.component.scss']
})
export class CardStagiaireComponent implements OnInit {
  stagiaires: any[]=[];
  user: any = null;
  isAddStagiaire: boolean = true;
  isLoading: boolean = true;
  id:any;
  constructor(
    private service: StagiaireService,
    private serv: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.id=this.route.snapshot.paramMap.get('id');
    this.getStagaire();
    this.getRole();
    this.getAllStagiaires();
  }
  getStagaire(){
    this.service.getStagiaire(this.id).subscribe(
      (data: any) => {
        this.stagiaires = [data];
      }
    );
  }
  getAllStagiaires() {
  if ((this.user?.role === 'stagiairesCompte' || this.user?.role === 'encadrantCompte') && this.user != null) {
      this.service.getStagiaire(this.user?.userId)
        .subscribe((res: any) => {
          if (res == null) {
            this.isAddStagiaire = true;
            this.toastr.info('Vous n\'avez pas encore créé votre profil.', '', {
              positionClass: 'toast-top-right',
              progressBar: true,
              progressAnimation: 'increasing',
              timeOut: 3000
            });
          } else {
            this.isAddStagiaire = false;
            this.stagiaires = [res];
          }
        });
    } 
  }

  openDeleteDialog(stagiaireId: string) {
    const dialogRef = this.dialog.open(DeleteStagiaireComponent, {
      width: '400px',
      data: { stagiaireId: stagiaireId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllStagiaires(); // Reload the list after deletion
      }
    });
  }

  getRole() {
    this.serv.getLogin()
   
      .subscribe((res: any) => {
        if (res && res.role) {
          this.user = res;
          this.getAllStagiaires(); // Call getAllStagiaires after ensuring user is initialized
        }
      });
  }

  downloadAttestation(): void {
    this.service.downloadAttestation(this.user?.userId);
  }
}