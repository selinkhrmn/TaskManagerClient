import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from "src/environments/environment";
import { ResponseModel } from '../interfaces/responseModel';
import { Project } from '../interfaces';
import { ProjectDto } from '../interfaces/project';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  project : ProjectDto;
  baseUrl = `${environment.baseUrl}/business/Project`;

  private project$ = new BehaviorSubject<any>({});
  selectedProject$ = this.project$.asObservable();
  
  constructor(
    private http: HttpClient,
    public tokenService: TokenService) { 
    this.getProjectLocal();
  }

  headers = this.tokenService.getHeaders();
  httpOptions = {
      headers: this.headers
  };
  
  getAllProjects(): Observable<ResponseModel<Project>> {
    return this.http.get<ResponseModel<Project>>(`${this.baseUrl}/GetAllProjects`, this.httpOptions);
  }

  createProject(project: Partial<Project>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/CreateProject`, project, this.httpOptions);
  }

  updateProject(project: Partial<any>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/UpdateProject`, project, this.httpOptions);
  }

  deleteProject(project: Partial<Project>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/DeleteProject`, project, this.httpOptions);
  }

  getProject(id : Partial<Project>){
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/GetProject`, id, this.httpOptions);
  }


  setCurrentProject(proj: any) {
    this.project = proj;
    this.project$.next(proj);
    localStorage.setItem('current-project', JSON.stringify({"id": this.project.id, "name": this.project.name} ));
  }

  getCurrentProject() { 
    return this.project;
  }


  public getProjectLocal() {
    const data = localStorage.getItem('current-project');
    this.project = data ? JSON.parse(data) : null;
    return this.project;
  }

}
