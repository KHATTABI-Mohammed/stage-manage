import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private feedbackUrl = 'http://localhost:3000/feedbacks';

  constructor(private http: HttpClient) {}

  loadFeedbacks() {
    return this.http.get<any[]>(this.feedbackUrl);
  }

  createFeedback(feedback: any) {
    return this.http.post(this.feedbackUrl, feedback);
  }

  updateFeedback(id: string, feedback: any) {
    return this.http.put(`${this.feedbackUrl}/${id}`, feedback);
  }
}
