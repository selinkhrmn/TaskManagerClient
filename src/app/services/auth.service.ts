import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { ResponseModel } from '../interfaces/responseModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl = `${environment.baseUrl}/Users`;
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient) { }

    login(user: User){
        return this.http.post(this.baseUrl + '/LoginUser', user).pipe(
            map((response: any )=> {
                const result = response;
                if (result.isSuccessful) {
                    localStorage.setItem("token", result.data.accessToken),
                        this.decodedToken = this.jwtHelper.decodeToken(result.data.accessToken);
                    localStorage.setItem("username", this.decodedToken.UserName);
                    localStorage.setItem("userId", this.decodedToken.UserId);
                }
                else if(!result.isSuccessful){
                    alert(result.message);
                }
            })
        )
    }

    register(user: Partial<User>) {
        localStorage.setItem("isSuccessful", "false");
        return this.http.post(this.baseUrl + '/RegisterUser', user).pipe(
            map((response: any) => {
                const result = response;
                if (result) {
                    localStorage.setItem("isSuccessful", result.isSuccessful);
                }
            }))
    }

     loggedIn() {
        const token: any = localStorage.getItem("token");
        return !this.jwtHelper.isTokenExpired(token);
    }

}
