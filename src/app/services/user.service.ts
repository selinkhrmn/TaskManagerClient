import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../interfaces/responseModel';
import { DeleteUserDto, UserDto } from '../interfaces/user';
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
    return this.http.post<ResponseModel<ProjectUserDto>>(`${this.baseUrl}/AddUserToProject`, projectUser);
  }

  DeleteUserFromProjectTasks(deleteUserDto: DeleteUserDto) {
    debugger;
    return this.http.post<ResponseModel<DeleteUserDto>>(`${this.baseUrl}/DeleteUserFromProjectTasks`, deleteUserDto);
  }

  deleteUserFromProjectAfterTasks(projectId: number, userId: string){
    return this.http.post<ResponseModel<DeleteUserDto>>(`${this.baseUrl}/DeleteUserFromProjectAfterTasks`, {projectId: projectId, userId: userId});
  }

  getUsersProjects(userId: string){
    let params = new HttpParams()
    .set('userId', userId.toString())
    return this.http.get<ResponseModel<ProjectDto>>(`${this.baseUrl}/GetUsersProjects`, {params})
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

  SendEmailToUsers(emails : ProjectUserListForEmail){
    return this.http.post( `${this.baseUrlIdentity}/SendsEmail`,emails);
  }

  ForgotPassword(email : string) :Observable<any>{
    const payload = { email };
    const url = `${this.baseUrlIdentity}/ForgotPassword`;

    return this.http.post(url, payload)
  }

  getUserById(id : string): Observable<any>{
    debugger
    return this.http.post<ResponseModel<UserDto>>(`${this.baseUrlIdentity}/GetUserById`, {id: id});
  }

  updateUser(user: Partial<UserDto>){
    return this.http.post<ResponseModel<UserDto>>(`${this.baseUrlIdentity}/UpdateUser`, user);
  }

  deleteUser(id: string){
    return this.http.post<ResponseModel<UserDto>>(`${this.baseUrlIdentity}/DeleteUser`, {UserId: id});
  }

  deleteUserDialog(projectId: number){

  }

}

