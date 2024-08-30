import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { StagiaireService } from '../../services/stagiaire.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
     MatRadioModule, 
     MatButtonModule,
      RouterModule,LoaderComponent
    ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss'
})
export class InscriptionComponent {
  userForm!: FormGroup;
  stagiaires:any[]=[];
  isLoading: boolean = true;
  type:string="stagiairesCompte";
  constructor( private fb: FormBuilder,
    private service: AuthService,
    private serviceStagiaire:StagiaireService,
    private router: Router,
    private toaster :ToastrService) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.createForm();
    this.getStagiaires();
  }

  getStagiaires(){
    this.service.getUsers(this.type).subscribe((res:any)=>{
      this.stagiaires=res;
    })
    }
 
  createForm() {
    this.userForm = this.fb.group({
      cin: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit() {
    const model = {
      id:this.userForm.get('cin')?.value,
      username: this.userForm.get('username')?.value,
      email: this.userForm.get('email')?.value,
      password: this.userForm.get('password')?.value,
    };
    let index=this.stagiaires.findIndex(item=>item.email==this.userForm.value.email);
    if(index!==-1){
      this.toaster.error("Email déja exister ! ","",{
        disableTimeOut:false,
        titleClass:"toastr_title",
        messageClass:"toastr_message",
        timeOut:5000,
        closeButton:true,
      })
    }else{
    this.serviceStagiaire.createStagiaire(model).subscribe(
      (res:any) => {
       this.toaster.success("Compte crée avec succes !","",{
        disableTimeOut:false,
        titleClass:"toastr_title",
        messageClass:"toastr_message",
        timeOut:5000,
        closeButton:true,
      })

    const model = {
      username: res.username,
      role:"stagiairesCompte",
      userId:res.id,
    
    };

    this.service.login(model).subscribe(
      (res:any) => {
        this.service.user.next(res);
     
      }
    );
      
        this.router.navigate(['/stagiaire']);
      }
    );
  }
}
}

