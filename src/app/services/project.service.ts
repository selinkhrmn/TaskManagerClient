import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from "src/environments/environment";
import { ResponseModel } from '../interfaces/responseModel';
import { Project } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  project :Project;
  baseUrl = `${environment.baseUrl}/Project`;

  private project$ = new BehaviorSubject<any>({});
  selectedProject$ = this.project$.asObservable();
  
  constructor(private http: HttpClient) { 
    this.getProjectLocal();
  }

  getAllProjects(): Observable<ResponseModel<Project>> {
    return this.http.get<ResponseModel<Project>>(`${this.baseUrl}/GetAllProjects`);
  }

  createProject(project: Partial<Project>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/CreateProject`, project);
  }

  updateProject(project: Partial<Project>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/UpdateProject`, project);
  }

  deleteProject(project: Partial<Project>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/DeleteProject`, project);
  }

  setCurrentProject(proj: any) {
    this.project = proj;
    this.project$.next(proj);
    localStorage.setItem('current-project', JSON.stringify({"id": this.project.id, "name": this.project.name} ));
  }

  getCurrentProject() {
    return this.project;
  }

  private getProjectLocal() {
    const data = localStorage.getItem('current-project');
    this.project = data ? JSON.parse(data) : null;
  }

}
