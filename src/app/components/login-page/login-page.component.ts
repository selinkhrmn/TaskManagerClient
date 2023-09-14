import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services';
import { TranslocoService} from '@ngneat/transloco';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent{

  // usernameOrEmail: string;
  // password: string;

  user: User = {
    usernameOrEmail: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public translocoService: TranslocoService,
    public tokenService: TokenService) {
  }

  signIn() {
    if(this.user.usernameOrEmail != '' && this.user.password != ''){
      this.authService.login(this.user).subscribe((res) => {
        console.log(res);
        
        const tokenT = localStorage.getItem("token");
        if (tokenT != null) {
          this.router.navigate(['home'], { relativeTo: this.activatedRoute });
        }
      },error => {
          console.log(error);
          alert("Incorrect Enterence");
        })
    }
  }
}

