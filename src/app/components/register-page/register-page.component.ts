import { Component } from '@angular/core';
import { AuthService } from 'src/app/services';
import { User, User1 } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  constructor(private authService: AuthService) {}

  user: User1 = {
    name: '',
    surname: '',
    password: '',
    role: '',
    userName: '',
    email: ''
  };

  username : string = this.user.name + '.' + this.user.surname;
  
  
  register() {
    
    if (
      this.user.name ||
      this.user.surname ||
      this.user.userName != ''
    ) {
      this.authService.register(this.user).subscribe((res) => {
        console.log(res);
        
      });
      console.log(this.user);
    }
  }
}
