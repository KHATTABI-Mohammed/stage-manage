import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { StagiaireService } from '../../services/stagiaire.service';
import { Chart } from 'chart.js/auto';
import { MatIcon } from '@angular/material/icon';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-stagiaire-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIcon, LoaderComponent],
  templateUrl: './stagiaire-dashboard.component.html',
  styleUrls: ['./stagiaire-dashboard.component.scss']
})
export class StagiaireDashboardComponent implements OnInit, AfterViewInit {
  stagiairesCount: number = 0;
  maleStagiairesCount: number = 0;
  femaleStagiairesCount: number = 0;
  stageApplicationCount: number = 0;
  stageObservationCount: number = 0;
  isLoading: boolean = true;
  stagiaires: any[] = [];

  constructor(private stagiaireService: StagiaireService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.isLoading) {
        this.loadSexeChart();
        this.loadDiplomaChart();
      }
    }, 100); // Petit délai pour garantir que les éléments canvas sont présents
  }

  loadStatistics() {
    this.stagiaireService.getAllStagiaires().subscribe((stagiaires: any) => {
      this.stagiaires = stagiaires;
      this.stagiairesCount = stagiaires?.length;
      this.maleStagiairesCount = stagiaires?.filter((s: any) => s?.sexe === 'male').length;
      this.femaleStagiairesCount = stagiaires?.filter((s: any) => s?.sexe === 'female').length;
      this.stageApplicationCount = stagiaires?.filter((s: any) => s?.typeStage === 'stage_application').length;
      this.stageObservationCount = stagiaires.filter((s: any) => s?.typeStage === 'stage_observation').length;

      this.isLoading = false; // Fin du chargement des données
    });
  }

  loadSexeChart() {
    const sexeChartElement = document.getElementById('sexeChart') as HTMLCanvasElement;
    if (sexeChartElement) {
      new Chart(sexeChartElement, {
        type: 'pie',
        data: {
          labels: ['Hommes', 'Femmes'],
          datasets: [{
            label: 'Répartition par Sexe',
            data: [this.maleStagiairesCount, this.femaleStagiairesCount],
            backgroundColor: ['#42A5F5', '#66BB6A'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const count: any = tooltipItem.raw;
                  const total = this.maleStagiairesCount + this.femaleStagiairesCount;
                  const percentage = ((count / total) * 100).toFixed(2);
                  return `${tooltipItem.label}: ${count} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      console.error('Element with ID "sexeChart" not found.');
    }
  }

  loadDiplomaChart() {
    const diplomaChartElement = document.getElementById('diplomaChart') as HTMLCanvasElement;
    if (diplomaChartElement) {
      const diplomas = this.stagiaires?.map((s: any) => s?.diplome);
      const diplomaCounts = diplomas?.reduce((acc: any, diploma: string) => {
        acc[diploma] = (acc[diploma] || 0) + 1;
        return acc;
      }, {});

      new Chart(diplomaChartElement, {
        type: 'bar',
        data: {
          labels: Object?.keys(diplomaCounts),
          datasets: [{
            label: 'Nombre de Stagiaires par Diplôme',
            data: Object?.values(diplomaCounts),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    } else {
      console.error('Element with ID "diplomaChart" not found.');
    }
  }
}
