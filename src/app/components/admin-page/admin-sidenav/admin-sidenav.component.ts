import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.scss']
})
export class AdminSidenavComponent {

  constructor(
    private router : Router,
    public tokenService: TokenService) {}

  navigateToHome() {
    this.router.navigate(['home'])
  }
}
