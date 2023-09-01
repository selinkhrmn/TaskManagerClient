import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';
import { TokenService } from 'src/app/services/token.service';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.scss']
})
export class AdminSidenavComponent {
url : string;

  constructor(
    private router : Router,
    public tokenService: TokenService,
    public fileService : FileService) {}

  navigateToHome() {
    this.router.navigate(['home/summary'])
  }

  ngOnInit() {
    this.fileService.getProfilePhoto({"userId" : this.tokenService.getTokenId()}).subscribe((res)=> {
      this.url = res[res.length-1];
    });
  }
}
