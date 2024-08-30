import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StagiaireService } from '../services/stagiaire.service';
import { AuthService } from '../services/auth.service';
import { FeedbackService } from '../services/feedback.service';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    LoaderComponent
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  feedbacks: any[] = [];
  user: any = null;
  isLoading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private stagiaireService: StagiaireService,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private toaster:ToastrService
  ) {
    this.feedbackForm = this.fb.group({
      question: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.loadFeedbacks();
    this.getLogin();
  }

  onSubmit() {
    const newFeedback = {
      question: this.feedbackForm.value.question,
      reponses: []
    };

    this.feedbackService.createFeedback(newFeedback).subscribe(() => {
      this.feedbacks.push(newFeedback);
      this.feedbackForm.reset();
      this.loadFeedbacks();
      this.toaster.success("Votre question ou feedback a été envoyé avec succès !","",{
        positionClass: 'toast-top-center',
        timeOut: 3000,
        disableTimeOut: false,
        closeButton: true
      })
    });
  }

  loadFeedbacks() {
    this.feedbackService.loadFeedbacks().subscribe(data => {
      this.feedbacks = data;
    });
  }

  submitReponse(item: any) {
    if (!item.newReponse || item.newReponse.trim() === '') return;

    item.reponses.push(item.newReponse.trim());
    item.newReponse = ''; // Réinitialiser le champ de nouvelle réponse

    this.feedbackService.updateFeedback(item.id, item).subscribe(()=> {
      this.toaster.success("Votre réponse a été envoyée avec succès !","",{
        positionClass: 'toast-top-center',
        timeOut: 3000,
        disableTimeOut: false,
        closeButton: true
      })
      this.loadFeedbacks();
    });
  }

  getLogin() {
    this.authService.getLogin().subscribe((data:any) => {
      if (data?.role === "encadrantCompte") {
        this.user = "Encadrant";
      } else if (data?.role === "stagiaireCompte") {
        this.stagiaireService.getStagiaire(data?.userId).subscribe((stagiaire:any) => {
          this.user = `${stagiaire?.nom} ${stagiaire?.prenom}`;
        });
      }
    });
  }
}
