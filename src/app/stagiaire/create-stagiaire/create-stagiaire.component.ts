import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { StagiaireService } from '../../services/stagiaire.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stagiaire-form',
  templateUrl: './create-stagiaire.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule
  ],
  styleUrls: ['./create-stagiaire.component.scss']
})
export class CreateStagiaireComponent implements OnInit {
  stagiaireForm!: FormGroup;
  user: any = null;
  constructor(
    private fb: FormBuilder,
    private stagiaireService: StagiaireService,
    private toaster: ToastrService,
    private serv :AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getLogin();
  }

  createForm() {
    this.stagiaireForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      cin: ['', Validators.required],
      sexe: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      diplome: ['', Validators.required],
      titreDiplome: ['', Validators.required],
      typeStage: ['', Validators.required],
      cv: [null, Validators.required],
      photo: [null, Validators.required],
    });
  }

  onFileSelected(event: any, fieldName: string): void {
    const file = event.target.files[0];
    if (file) {
      this.stagiaireForm.patchValue({
        [fieldName]: file,
      });
    }
  }

  onSubmit(): void {
    if (this.stagiaireForm.valid) {
      const formData = new FormData();
      formData.append('cv', this.stagiaireForm.get('cv')?.value);
      formData.append('photo', this.stagiaireForm.get('photo')?.value);
  
      this.stagiaireService.uploadFiles(formData).subscribe(
        (response) => {
          // Les chemins des fichiers après l'upload
          const cvPath = response.cvPath;
          const photoPath = response.photoPath;
  
          // Création des dates de début et de fin de stage
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + 1);
  
          // Extraction des valeurs du formulaire champ par champ
          const stagiaireData = {
            id:this.user?.userId,
            nom: this.stagiaireForm.get('nom')?.value,
            prenom: this.stagiaireForm.get('prenom')?.value,
            cin: this.stagiaireForm.get('cin')?.value,
            sexe: this.stagiaireForm.get('sexe')?.value,
            telephone: this.stagiaireForm.get('telephone')?.value,
            email:this.user?.email,
            adresse: this.stagiaireForm.get('adresse')?.value,
            diplome: this.stagiaireForm.get('diplome')?.value,
            titreDiplome: this.stagiaireForm.get('titreDiplome')?.value,
            typeStage: this.stagiaireForm.get('typeStage')?.value,
            cv: cvPath,
            photo: photoPath
          };
  
          // Envoi des données du stagiaire
          this.stagiaireService.addStagiaire(stagiaireData).subscribe(
            (result) => {
              this.toaster.success("Informations bien enregistrées !", "", {
                disableTimeOut: false,
                titleClass: "toastr_title",
                messageClass: "toastr_message",
                timeOut: 5000,
                closeButton: true,
              });

              this.router.navigate(['/stagiaire']);
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
  getLogin(){
    this.serv.getLogin().subscribe((res: any) => {
      if (res.role) {
        this.user = res;
      }
    });
  } 
}
