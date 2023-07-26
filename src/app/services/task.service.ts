import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { ResponseModel } from '../interfaces/responseModel';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../interfaces';
import { TokenService } from './token.service';
import { ProjectDto } from '../interfaces/project';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  task : Task;
  baseUrl = `${environment.baseUrl}/business/Task`;
  
  private task$ = new BehaviorSubject<any>({});
  selectedTask$ = this.task$.asObservable();
  

  constructor(private http : HttpClient,
    public tokenService: TokenService) {
   }

   headers = this.tokenService.getHeaders();
   httpOptions = {
       headers: this.headers
   };
   createNewTask(task: Partial<Task>): Observable<ResponseModel<Task>> {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/CreateTask`, task, this.httpOptions);
}

  updateTask(task : Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTask`, task, this.httpOptions);
  }

  deleteTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/DeleteTask`, {body: task }, this.httpOptions);
  }

  updateTaskColumnId(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTaskColumnId`, task, this.httpOptions);
  }

  getAllProjectTask(id: Partial<ProjectDto>) {
    

    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetAllProjectTask`, id, this.httpOptions);
  }



  // setTask(task: any) {
  //   this.task = task;
  //   this.task$.next(task);
  //   localStorage.setItem('tasks', JSON.stringify({"column-id" : this.task.columnId,"project-id" : this.task.projectId ,"name": this.task.name} ));

  // }

  getTask(Id : Partial<Task>)  {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetTaskById`, Id);
  }

}
