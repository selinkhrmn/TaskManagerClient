import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { User, User1 } from 'src/app/interfaces/user';
import { TranslocoService} from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent  {
  constructor(private authService: AuthService,
    public translocoService : TranslocoService,public dialog: MatDialog,) {}
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);


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
         
        if(response.isSuccessful == true && response.message != "User created but the username has changed") {
          Swal.fire(
            'Good job!',
            'You registered a person successfully',
            'success'
          )
          this.closeDialog();
        }
        else if(response.message == "User Email already exist") {
          Swal.fire({
                icon: 'error',
                title: 'Something went wrong!',
                text: 'There is already a user with the same email!',
                footer: '<a href="">Why do I have this issue?</a>'
              })
        }
        else if (response.message == "Role doesn't exist") {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong!',
            text: 'You have to pick a role!',
            footer: '<a href="">Why do I have this issue?</a>'
          })
        }
        else if(response.isSuccessful &&  response.message == "User created but the username has changed") {
          Swal.fire({
            icon: 'info',
            title: 'You registered a person successfully',
            text: `But there is another person with the same username so we changed that to ${response.data.username}`,
          })
          this.closeDialog();

        }
        
      });
      console.log(this.user);
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: 'Fill in the blanks!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
    
  }
  closeDialog() {
    const dialogRef = this.dialog.closeAll()
  }

  
}
