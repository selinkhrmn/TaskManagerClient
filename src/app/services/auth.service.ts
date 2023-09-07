import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User, User1 } from '../interfaces/user';
import { ResponseModel } from '../interfaces/responseModel';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl = `${environment.baseUrl}/identity/Users`;
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient,
        public tokenService: TokenService, private router: Router) { }

    login(user: User) {

        return this.http.post(this.baseUrl + '/LoginUser', user).pipe(
            map((response: any) => {
                const result = response;

                if (result.isSuccessful) {
                    localStorage.setItem("token", result.data.accessToken)
                }
                else if (!result.isSuccessful) {
                    alert(result.message);
                }
            })
        )
    }

    logOut(){
        localStorage.removeItem("token");
        localStorage.clear();
        this.router.navigate(['']);
       }
  

    register(user: Partial<User1>){
        // debugge
        // localStorage.setItem("isSuccessful", "false");
        // return this.http.post(this.baseUrl + '/RegisterUser', user).pipe(
        //     map((response: any) => {
        //         const result = response;
        //         if (result) {
        //             localStorage.setItem("isSuccessful", result.isSuccessful);
        //         }
        //     }))


        const headers = this.tokenService.getHeaders();

        

        return this.http.post(this.baseUrl + '/RegisterUser', user)
    }

    loggedIn() {
        const token: any = localStorage.getItem("token");
        return !this.jwtHelper.isTokenExpired(token);
    }

}
