import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  role: string;

  constructor(
    public jwtHelper: JwtHelperService) {
     this.role = this.tokenRole();
  }


  decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; 
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken;
  }

  tokenRole(){
    const rol = this.decodeToken();
    const role = rol['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role;
  }

  tokenUsername(){
    return this.decodeToken().Username;
  }
  
  tokenNameSurname(){
    let token = this.decodeToken();
    return token.UserName[0]+token.UserSurname[0];
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }

  public getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
