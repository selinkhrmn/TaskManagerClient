import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/responseModel';
import { UserDto } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { ProjectDto } from '../interfaces/project';
import { ProjectUserDto } from '../interfaces/projectUserDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrlIdentity = `${environment.baseUrl}/identity/Users`;
  baseUrl =  `${environment.baseUrl}/business/ProjectUser`;

  constructor(
    private http: HttpClient,
    public tokenService: TokenService) { 

  }

  headers = this.tokenService.getHeaders();
  httpOptions = {
      headers: this.headers
  };

  getAllUsers(): Observable<ResponseModel<UserDto>> {
    return this.http.get<ResponseModel<UserDto>>(`${this.baseUrlIdentity}/GetAllUsers`, this.httpOptions);
  }

  GetAllProjectUsers(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/GetAllProjectUsers`, id, this.httpOptions);
  }

  AddUserToProject(projectUser : Partial<ProjectUserDto>) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/AddUserToProject`, projectUser, this.httpOptions);
  }
}
