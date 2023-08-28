import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { User, User1 } from 'src/app/interfaces/user';
import { TranslocoService} from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent  {
  constructor(private authService: AuthService,
    public translocoService : TranslocoService,public dialog: MatDialog,) {}


  user: User1 = {
    name: '',
    surname: '',
    password: '',
    role: '',
    userName: '',
    email: ''
  };

  updateUserName() {
    this.user.userName = this.user.name + '.' + this.user.surname
  }
  
  register() {
  
    if (
      this.user.name &&
      this.user.surname &&
      this.user.userName != ''
    ) {
      this.authService.register(this.user).subscribe((res) => {
       console.log(res);
       
        let response : any = res;
         console.log(response);
        if(response.isSuccessful == true) {
          Swal.fire(
            'Good job!',
            'You registered a person successfully',
            'success'
          )
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href="">Why do I have this issue?</a>'
          })
        }
      });
      console.log(this.user);
    }
  }
  closeDialog() {
    const dialogRef = this.dialog.closeAll()
  }

  
}
