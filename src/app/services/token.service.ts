import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  role: string;

  constructor(
    public jwtHelper: JwtHelperService) 
    {
    this.role = this.decodeToken().Role;
  }

  decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; 
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken;
  }

  hasRole(role: string): boolean {
    console.log(this.role === role); //true
    return this.role === role;
  }
}
