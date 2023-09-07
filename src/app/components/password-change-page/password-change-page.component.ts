import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { ResponseModel } from 'src/app/interfaces/responseModel';
import { User, UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-change-page',
  templateUrl: './password-change-page.component.html',
  styleUrls: ['./password-change-page.component.scss']
})
export class PasswordChangePageComponent implements OnInit {
  passwordChangeForm: FormGroup;
  isLoading = false;
  resultMessage = '';
  userId: string; // Variable to store the user ID from the URL
  private routeSub: Subscription;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    public translocoService: TranslocoService,
    private http : HttpClient,
    private userService : UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit() {
    this.passwordChangeForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        // Token is missing, navigate to an error page or handle accordingly
        this.router.navigate(['/error']); // Redirect to an error page
      }
    });
  }

  onSubmit() {
    
      const newPassword = this.passwordChangeForm.value.newPassword;
      const oldPassword = this.passwordChangeForm.value.confirmNewPassword
      if(newPassword == oldPassword) {
        this.userService.ChangePasswordWithToken(this.token, newPassword)
        .subscribe(response => {
          if (response.success) {
            Swal.fire(
              'Good job!',
              'You clicked the button!',
              'success'
            ).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/login']);
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Password change failed. Please try again.',
            })
          }
        });
       }

       else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords should match!',
        })
      }
      }

      
      


}
