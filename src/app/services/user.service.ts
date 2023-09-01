import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/responseModel';
import { UserDto } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { ProjectDto } from '../interfaces/project';
import { ProjectUserList, ProjectUserDto, ProjectUserListForEmail } from '../interfaces/projectUserDto';

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
    return this.http.get<ResponseModel<UserDto>>(`${this.baseUrlIdentity}/GetAllUsers`);
  }

  GetAllProjectUsers(id: number) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/GetAllProjectUsers`, {id: id});
  }

  AddUserToProject(projectUser: ProjectUserList) {
    debugger
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/AddUserToProject`, projectUser);
  }

  DeleteUserFromProject(projectUser: ProjectUserList) {
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/DeleteUserFromProject`, projectUser);
  }

  GetProjectSelectedUsers(projectId: number): Observable<ResponseModel<ProjectUserDto>> {
    const url = `${this.baseUrl}/GetSelectedUsersForProject`;
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get<ResponseModel<ProjectUserDto>>(url, { params: params });
  }
  
  ChangePasswordWithToken(token: string, newPassword: string): Observable<any> {
    const payload = { token, newPassword };
    const url = `${this.baseUrlIdentity}/ChangePasswordWithToken`; 
    return this.http.post(url, payload);
  }

  SendEmailToUsers(emails : Partial<ProjectUserListForEmail>){
    return this.http.post<ResponseModel<ProjectUserList>>(`${this.baseUrlIdentity}/SendsEmail`, emails);
  }

  ForgotPassword(email : string) :Observable<any>{
    const payload = { email };
    const url = `${this.baseUrlIdentity}/ForgotPassword`;

    return this.http.post(url, payload)
  }

  getUserById(id : any): Observable<any>{

    return this.http.post(`${this.baseUrlIdentity}/GetUserById`, id);
  }

}

