import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'http://localhost:3000/projets'; // Assurez-vous que l'URL correspond à votre configuration
  private baseUrl = 'http://localhost:5000/';
  private apiUrlJson = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  // Obtenir tous les projets
  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtenir un projet par ID
  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un projet
  addProject(project: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, project);
  }
  addProjectRapport(project: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/projetsRapports', project);
  }
  // Mettre à jour un projet
  updateProject(id: string, project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, project);
  }

  // Supprimer un projet
  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }


  
  createProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }
  uploadFile(formData: FormData): Observable<{ rapportPath: string }> {
    return this.http.post<{ rapportPath: string }>(`${this.baseUrl}uploadRapport`, formData);
  }
  getProjectsByStagiaire(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlJson}projets/${id}`);
  }

  getAllProjetRapport(){
    return this.http.get<any[]>(this.apiUrlJson+'projetsRapports');
  }

  getProjetRapportById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlJson}projetsRapports/${id}`);
  }

  updateProjetRapport(id: string, project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlJson}projetsRapports/${id}`, project);
  }

   // Envoyer l'attestation par e-mail
   sendAttestation(email: string, nom: string, prenom: string, stagiaireId: string): Observable<any> {
    const payload = { email, nom, prenom, stagiaireId };
    return this.http.post(`${this.baseUrl}send-attestation`, payload);
  }
  
}