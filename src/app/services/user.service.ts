import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/responseModel';
import { UserDto } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { ProjectDto } from '../interfaces/project';
import { AddProjectUser, ProjectUserDto } from '../interfaces/projectUserDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user : UserDto;

  baseUrlIdentity = `${environment.baseUrl}/identity/Users`;
  baseUrl =  `${environment.baseUrl}/business/ProjectUser`;

  constructor(
    private http: HttpClient,
    public tokenService: TokenService) { 

  }
  private user$ = new BehaviorSubject<any>({});
  selectedUser$ = this.user$.asObservable();

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

  AddUserToProject(projectUser : Partial<AddProjectUser>) {
    debugger
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/AddUserToProject`, projectUser, this.httpOptions);
  }
}
