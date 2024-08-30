import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Chart } from 'chart.js/auto';
import { ProjectsService } from '../../services/projects.service'; // Importez le service
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule,MatIcon],
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit {
  projets: any[] = [];
  stagiairesInfo: any[] = []; // Ajoutez si vous avez des données pour les stagiaires

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getAllProjects().subscribe((projets: any[]) => {
      this.projets = projets;
      this.loadProjectsStatusChart();
      this.loadProjectsPerStagiaireChart();
      this.loadProjectsByAssignmentDateChart();
    });
  }

  loadProjectsStatusChart() {
    const statusCounts = this.projets.reduce((acc: any, project: any) => {
      const status = project.description || 'Non spécifié';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    new Chart('projectStatusChart', {
      type: 'pie',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          label: 'Répartition des Projets par Description',
          data: Object.values(statusCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  loadProjectsPerStagiaireChart() {
    // Assurez-vous que les stagiaires sont récupérés si nécessaire
    const stagiaireCounts = this.projets.reduce((acc: any, project: any) => {
      const stagiaireCIN = project.stagiaireCIN || 'Non attribué';
      acc[stagiaireCIN] = (acc[stagiaireCIN] || 0) + 1;
      return acc;
    }, {});

    new Chart('projectsPerStagiaireChart', {
      type: 'bar',
      data: {
        labels: Object.keys(stagiaireCounts),
        datasets: [{
          label: 'Nombre de Projets par Stagiaire',
          data: Object.values(stagiaireCounts),
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  loadProjectsByAssignmentDateChart() {
    const dates = this.projets.map(p => new Date(p.dateAffectation));
    const uniqueDates = Array.from(new Set(dates.map(d => d.toDateString())));
    const dateCounts = uniqueDates.reduce((acc: any, date: string) => {
      acc[date] = dates.filter(d => d.toDateString() === date).length;
      return acc;
    }, {});
  
    new Chart('projectsByAssignmentDateChart', {
      type: 'line',
      data: {
        labels: Object.keys(dateCounts),
        datasets: [{
          label: 'Nombre de Projets par Date d\'Affectation',
          data: Object.values(dateCounts),
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'll'
            },
            title: {
              display: true,
              text: 'Date d\'Affectation'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
}
