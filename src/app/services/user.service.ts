import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/responseModel';
import { UserDto } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { ProjectDto } from '../interfaces/project';
import { ProjectUserList, ProjectUserDto } from '../interfaces/projectUserDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserDto;

  baseUrlIdentity = `${environment.baseUrl}/identity/Users`;
  baseUrl = `${environment.baseUrl}/business/ProjectUser`;

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
    debugger
    return this.http.get<ResponseModel<UserDto>>(`${this.baseUrlIdentity}/GetAllUsers`, this.httpOptions);
  }

  GetAllProjectUsers(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/GetAllProjectUsers`, id, this.httpOptions);
  }

  AddUserToProject(projectUser: Partial<ProjectUserList>) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/AddUserToProject`, projectUser, this.httpOptions);
  }

  DeleteUserFromProject(projectUser: Partial<ProjectUserList>) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/DeleteUserFromProject`, projectUser, this.httpOptions);
  }

  // DeleteUserFromProject(id: string, projectId: number) {
  //   return this.http.post(`${this.baseUrl}/DeleteUserFromProject`, { userId: id, projectId: projectId }, this.httpOptions);
  // }

 
  GetProjectSelectedUsers(projectId: number): Observable<ResponseModel<ProjectUserDto>> {
    const url = `${this.baseUrl}/GetSelectedUsersForProject`;
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get<ResponseModel<ProjectUserDto>>(url, { params: params });
  }
  
  ChangePasswordWithToken(token: string, newPassword: string): Observable<any> {
    const payload = { token, newPassword };
    const url = `${this.baseUrlIdentity}/ChangePasswordWithToken`; // Replace with the appropriate endpoint URL
    return this.http.post(url, payload);
  }

  ForgotPassword(email : string) :Observable<any>{
    debugger
    const payload = { email };
    const url = `${this.baseUrlIdentity}/ForgotPassword`; // Replace with the appropriate endpoint URL

    return this.http.post(url, payload)
  }


}

