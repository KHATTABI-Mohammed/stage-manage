import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,
  CommonModule,
  HttpClientModule,
  MatToolbarModule,
  MatButtonModule
  ,MatIconModule,
  MatSidenavModule,
  MatListModule,
  FlexLayoutModule],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  user: any = null;
 

  constructor(
    private service: AuthService,
 
  ) {}

  ngOnInit(): void {
     this.getRole()
    }

    getRole(){
      this.service.user.subscribe((res: any) => {
        if (res.role) {
          this.user = res;
        }
      });
    }
  logout() {
    this.user = null;
    this.service.logout();
  }

}
