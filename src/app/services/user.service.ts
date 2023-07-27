import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/responseModel';
import { UserDto } from '../interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = `${environment.baseUrl}/identity/Users`;

  constructor(
    private http: HttpClient,
    public tokenService: TokenService) { 

  }

  headers = this.tokenService.getHeaders();
  httpOptions = {
      headers: this.headers
  };

  getAllUsers(): Observable<ResponseModel<UserDto>> {
    return this.http.get<ResponseModel<UserDto>>(`${this.baseUrl}/GetAllUsers`, this.httpOptions);
  }

}
