import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [  MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,RouterModule,CommonModule,LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isLoading: boolean = true;
  holidays = [
    { name: 'Anniversaire de la Marche Verte', date: new Date('2023-11-06') },
    { name: 'Fête de l’Indépendance', date: new Date('2023-11-18') },
    { name: 'Nouvel An', date: new Date('2024-01-01') },
    { name: 'Manifeste de l’Indépendance', date: new Date('2024-01-11') },
    { name: 'Nouvel An Amazigh', date: new Date('2024-01-14') },
    { name: 'Fête du Travail', date: new Date('2024-05-01') },
    { name: 'Fête du Trône', date: new Date('2024-07-30') },
    { name: 'Allégeance Oued Eddahab', date: new Date('2024-08-14') },
    { name: 'Révolution du Roi et du Peuple', date: new Date('2024-08-20') },
    { name: 'Fête de la Jeunesse', date: new Date('2024-08-21') },
    { name: 'Anniversaire de la Marche Verte', date: new Date('2024-11-06') },
    { name: 'Fête de l’Indépendance', date: new Date('2024-11-18') },
  ];

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.checkIfHolidayIsTomorrow();
  }

  checkIfHolidayIsTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const holiday = this.holidays.find(h => 
      h.date.getDate() === tomorrow.getDate() && 
      h.date.getMonth() === tomorrow.getMonth() 
    )

    if (holiday) {
      this.toastr.info(`Demain est ${holiday.name}`, 'Notification',
        { positionClass: 'toast-top-right' ,
          timeOut: 10000,
          disableTimeOut: false,
          closeButton: true
        }
      );
    }
  }


  downloadPDF() {
    const link = document.createElement('a');
    link.href = 'fete.pdf'; 
    link.download = 'Calendrier-Jours-Fériés.pdf';
    link.click();
  }
}