import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';
import { User, UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string;
  constructor(public translocoService : TranslocoService,
              public userService : UserService
    ) {}



    ForgotPassword() {      
      this.userService.ForgotPassword(this.email).subscribe((res) => {
        console.log(res);
        
      })
    }
}
