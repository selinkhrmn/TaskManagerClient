import { Component, Inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { TokenService } from 'src/app/services/token.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-profile-setting-page',
  templateUrl: './profile-setting-page.component.html',
  styleUrls: ['./profile-setting-page.component.scss']
})
export class ProfileSettingPageComponent implements OnInit {

name : string ;
surname : string ;
email : any ;
user : UserDto;
userId = this.tokenService.getTokenId();

emailFormControl = new FormControl('' , [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();
  constructor(private tokenService : TokenService,
    private userService : UserService
    ) {debugger
      // const userId = this.tokenService.getTokenId();


      // var eachProduct = 
      // {
      //     "id": userId,
          
      // };

  
     
  }
  ngOnInit() {
    this.userService.getUserById({"id" : this.userId}).subscribe(
      (user) => {
        this.user = user; 
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

}
