import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { ResponseModel } from '../interfaces/responseModel';
import { Project } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl = `${environment.baseUrl}/Project`;
  
  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<ResponseModel<Project>> {
    return this.http.get<ResponseModel<Project>>(`${this.baseUrl}/GetAllProjects`);
  }

  createProject(project: Partial<Project>) {
    return this.http.post<ResponseModel<Project>>(`${this.baseUrl}/CreateProject`, project);
  }

}
