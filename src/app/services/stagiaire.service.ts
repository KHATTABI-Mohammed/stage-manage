import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StagiaireService {

  private apiUrl = 'http://localhost:5000/';
  private jsonServerUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  createStagiaire(data: any) {
    return this.http.post(`${this.jsonServerUrl}stagiairesCompte`, data);
  }

  getStagiaire(id: any) {
    return this.http.get(`${this.jsonServerUrl}stagiairesInfo/${id}`);
  }

  updateStagiaire(id: number, model: any) {
    return this.http.put(`${this.jsonServerUrl}stagiairesInfo/${id}`, model);
  }

  uploadFiles(formData: FormData): Observable<{ cvPath: string; photoPath: string }> {
    return this.http.post<{ cvPath: string; photoPath: string }>(`${this.apiUrl}upload`, formData);
  }

  addStagiaire(stagiaireData: any) {
    return this.http.post(`${this.jsonServerUrl}stagiairesInfo`, stagiaireData);
  }

  getAllStagiaires(){
    return this.http.get(`${this.jsonServerUrl}stagiairesInfo`)
  }
  deleteStagiaire(id: string): Observable<void> {
    return this.http.delete<void>(`${this.jsonServerUrl}stagiairesInfo/${id}`);
  }

  downloadAttestation(id:any): void {
    const stagiaireId = id;
    const url = `${this.apiUrl}download-attestation/${stagiaireId}`;
    window.open(url, '_blank');
  }
   
}
