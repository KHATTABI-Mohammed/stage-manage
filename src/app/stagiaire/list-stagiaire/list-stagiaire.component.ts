import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table'; 
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
import { DeleteStagiaireComponent } from '../delete-stagiaire/delete-stagiaire.component';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../loader/loader.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-list-stagiaire',
  standalone: true,
  imports: [
    LoaderComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatDividerModule,
    MatCardModule,
    MatTable,
    MatFormFieldModule,
    MatInputModule,MatTableModule
  ],
  templateUrl: './list-stagiaire.component.html',
  styleUrls: ['./list-stagiaire.component.scss']
})
export class ListStagiaireComponent implements OnInit {
  stagiaires: any[] = [];
  dataSource = new MatTableDataSource<any>(this.stagiaires); 
  user: any = null;
  isAddStagiaire: boolean = true;
  isLoading: boolean = true;
  displayedColumns: string[] = ['nom', 'cin', 'email', 'adresse', 'telephone', 'actions'];

  constructor(
    private service: StagiaireService,
    private serv: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.getRole();
  }

  getAllStagiaires() {
    if (this.user?.role === 'encadrantCompte' && this.user != null) {
      this.service.getAllStagiaires()
        .pipe(
          catchError(error => {
            this.toastr.error('Une erreur s\'est produite lors de la récupération des stagiaires.', '', {
              positionClass: 'toast-top-right',
              progressBar: true,
              progressAnimation: 'increasing',
              timeOut: 3000
            });
            return of([]); 
          })
        )
        .subscribe((res: any) => {
          if (res && res.length > 0) {
            this.stagiaires = res.sort((a:any, b:any) => b.isValider - a.isValider); // Trier par isValider
            this.dataSource.data = this.stagiaires; 
            this.isAddStagiaire = false;
          } else {
            this.toastr.info('Aucun stagiaire n\'est actuellement disponible.', '', {
              positionClass: 'toast-top-right',
              progressBar: true,
              progressAnimation: 'increasing',
              timeOut: 3000
            });
          }
        });
    } else if (this.user?.role === 'stagiairesCompte' && this.user != null) {
      this.service.getStagiaire(this.user?.userId)
        .pipe(
          catchError(error => {
            this.toastr.error('Une erreur s\'est produite lors de la récupération de votre profil.', '', {
              positionClass: 'toast-top-right',
              progressBar: true,
              progressAnimation: 'increasing',
              timeOut: 3000
            });
            return of(null);
          })
        )
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
            this.dataSource.data = this.stagiaires; 
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
        this.getAllStagiaires(); 
      }
    });
  }

  getRole() {
    this.serv.getLogin()
      .pipe(
        catchError(error => {
          this.toastr.error('Une erreur s\'est produite lors de la récupération de votre rôle.', '', {
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing',
            timeOut: 3000
          });
          return of(null); 
        })
      )
      .subscribe((res: any) => {
        if (res && res.role) {
          this.user = res;
          this.getAllStagiaires(); 
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  downloadAttestation(): void {
    this.service.downloadAttestation(this.user?.userId);
  }
}
