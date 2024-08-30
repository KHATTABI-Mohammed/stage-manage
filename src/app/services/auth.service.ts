import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  user=new Subject();
  loggedIn = false;

  login(data: any) {
    this.loggedIn = true;
  return this.http.put('http://localhost:3000/login/1', data);
  }
getLogin(){
  return this.http.get('http://localhost:3000/login/1')
}
  logout() {
    const model = {};
    this.login(model).subscribe((res) => {
     
      this.user.next(res);
    });
    this.loggedIn=false;
  }
  


  getUsers(type:string){
    return this.http.get('http://localhost:3000/'+type )}


  getRole(){
    return this.http.get('http://localhost:3000/login/1')

  }  
  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}