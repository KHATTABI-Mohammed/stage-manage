import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour les directives communes comme *ngIf, *ngFor, etc.
import { FormsModule } from '@angular/forms'; // Pour le support de [(ngModel)]
import { MatCardModule } from '@angular/material/card'; // Pour MatCard
import { MatFormFieldModule } from '@angular/material/form-field'; // Pour MatFormField
import { MatInputModule } from '@angular/material/input'; // Pour MatInput
import { MatSelectModule } from '@angular/material/select'; // Pour MatSelect
import { MatButtonModule } from '@angular/material/button'; // Pour MatButton
import { MatOptionModule } from '@angular/material/core'; // Pour MatOption
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Pour les directives de routage
import { StagiaireService } from '../../services/stagiaire.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stagiaire-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    RouterModule
  ],
  templateUrl: './detail-stagiaire.component.html',
  styleUrls: ['./detail-stagiaire.component.scss']
})
export class StagiaireDetailComponent {
  stagiaire: any;
  isEditing = false;
  id:any;
  user:any=null
  isEdit:boolean=true;
  constructor(
    private route: ActivatedRoute,
    private stagiaireService: StagiaireService,
    private serv :AuthService,
    private toaster: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('id');
   this.getStagaire();
   this.getLogin();
  }
getStagaire(){
  this.stagiaireService.getStagiaire(this.id).subscribe(
    (data: any) => {
      this.stagiaire = data;
    }
  );
}
  edit(){
    this.isEditing = true;
  }

  save() {
    this.stagiaireService.updateStagiaire(this.stagiaire.id, this.stagiaire).subscribe(
      (response) => {
        this.isEditing = false;
        this.toaster.success("Mise à jour réussite !", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      },
      (error) => {
        this.toaster.error("Mise à jour interrompue !", "", {
          disableTimeOut: false,
          titleClass: "toastr_title",
          messageClass: "toastr_message",
          timeOut: 5000,
          closeButton: true,
        });
      }
    );
  }

  cancel() {
    this.isEditing = false;
    this.ngOnInit(); // Recharger les données pour annuler les modifications
  }

  getLogin(){
    this.serv.getLogin().subscribe((res: any) => {
         if (res && res.role) {
        
           this.user = res;
           if(this.user.role=="encadrantCompte"){
            this.isEdit=false;
            }
//this.getAllStagiaires(); // Appelez ici pour être sûr que user est bien initialisé
         } else {
         }
       });

   
}
}
