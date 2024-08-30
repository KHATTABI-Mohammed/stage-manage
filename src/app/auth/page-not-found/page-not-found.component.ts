import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterModule,LoaderComponent,CommonModule],
  template: `
  <app-loader *ngIf="isLoading"></app-loader>
    <div class='center' *ngIf="!isLoading">
      <img src="error.png"/>
      <h1>Hey, cette page n'existe pas !</h1>
      <a routerLink="/projects" class="waves-effect waves-teal btn-flat">
        Retourner
      </a>
    </div>
  `,
  styles: `.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #f4f4f4;
    padding: 20px;
  
    img {
      max-width: 300px;
      width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
  
    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 20px;
      font-weight: 700;
    }
  
    a {
      display: inline-block;
      padding: 12px 24px;
      font-size: 1.2rem;
      color: #fff;
      background-color: #f99a41;
      border-radius: 4px;
      text-decoration: none;
      transition: background-color 0.3s, transform 0.3s;
      
      &:hover {
        background-color: darken(#f99a41, 10%);
        transform: scale(1.05);
      }
  
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(249, 154, 65, 0.3);
      }
    }
  }
  `
})
export class PageNotFoundComponent implements OnInit{
  isLoading: boolean = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    
   
    
  }
}