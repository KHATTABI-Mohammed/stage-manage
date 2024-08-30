import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private apiUrl = 'http://localhost:5000/';
  private jsonServerUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getStage(id: any) {
    return this.http.get(`${this.jsonServerUrl}stages/${id}`);
  }

  updateStage(id: number, model: any) {
    return this.http.put(`${this.jsonServerUrl}stages/${id}`, model);
  }

 

  addStage(model: any) {
    return this.http.post(`${this.jsonServerUrl}stages`, model);
  }

  getAllStage(){
    return this.http.get(`${this.jsonServerUrl}stages`)
  }
  deleteStage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.jsonServerUrl}stages/${id}`);
  }
}
