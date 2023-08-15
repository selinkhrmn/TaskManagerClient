import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { ResponseModel } from '../interfaces/responseModel';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../interfaces';
import { TokenService } from './token.service';
import { ProjectDto } from '../interfaces/project';
import { ListTask } from '../interfaces/listTask';
import { UserDto } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  task: Task;
  baseUrl = `${environment.baseUrl}/business/Task`;

  private task$ = new BehaviorSubject<any>({});
  selectedTask$ = this.task$.asObservable();
  
  selectedFilter: { name: string; fromDate: Date; toDate: Date } | null = null;

  constructor(private http: HttpClient,
    public tokenService: TokenService) {
  }

  headers = this.tokenService.getHeaders();
  httpOptions = {
    headers: this.headers
  };

  createTask(task: Partial<Task>): Observable<ResponseModel<Task>> {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/CreateTask`, task, this.httpOptions);
  }
 

  updateTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTask`, task, this.httpOptions);
  }

  deleteTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/DeleteTask`, { body: task }, this.httpOptions);
  }

  updateTaskColumnId(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTaskColumnId`, task, this.httpOptions);
  }

  getAllProjectTask(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<ListTask>>(`${this.baseUrl}/GetAllProjectTask`, id, this.httpOptions);
  }

  getTaskById(id: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetTaskById`, id, this.httpOptions);
  }

  GetAllTaskForUser(id : Partial<UserDto>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetAllTaskForUser`, id, this.httpOptions);
  }

 setSelectedFilter(filter: { name: string, fromDate: Date, toDate: Date }) {
  console.log("Setting filter:", filter);
  this.selectedFilter = filter;
}


  getSelectedFilter() {
    return this.selectedFilter;
  }



}
