import { Component, Inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { TokenService } from 'src/app/services/token.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer } from '@angular/platform-browser';


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
  working = false;

  uploadFileLabel: string | undefined = 'Choose an image to upload';
 

  user: Partial<UserDto> = {
    name: "",
    surname: "",
    email: ""
  };

  oldPassword: any;
  newPassword: any;

  id = this.tokenService.getTokenId();
  url = '';
  imageUrl : any[] = [];
  images: any[] = [];
  formData = new FormData();
  token: string;
  

  constructor(private tokenService: TokenService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public translocoService: TranslocoService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {




  }
  ngOnInit() {


    this.token = localStorage.getItem('token');


    this.userService.getUserById( this.id ).subscribe(
      {
        next: (response) => {

          this.user.name = response.data.name;
          this.user.email = response.data.email;
          this.user.surname = response.data.surname;



        },

        error: (err: any) => {
          console.log('error:', err);

        },
        complete: () => {

        }
      }
    );

    this.fileService.getProfilePhoto({"userId" : this.id}).subscribe((res)=> {
      
      this.imageUrl = res;
      this.url = res[res.length-1];
    });


  }

  changePassword() {
    const t = localStorage.getItem('token');
    const n = this.newPassword;
    this.userService.ChangePasswordWithToken(
      t, n);
  }

  save() {
    this.userService.ChangePasswordWithToken(this.token, this.newPassword);
    if (this.newPassword != null) {
      this.toaster.success("Password updated successfully");
      this.router.navigate(['/']);
    }

  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }

    var f = event.target.files.item(0);
    this.formData.append('file', f);

    if (this.formData != null) {
      this.fileService.addFile(this.formData, this.id).subscribe((res) => {
      });
      this.toaster.success("Profile photo updated successfully");
      
    }





  }

}
