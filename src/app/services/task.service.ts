import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { ResponseModel } from '../interfaces/responseModel';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  task : Task;
  baseUrl = `${environment.baseUrl}/Task`;
  
  private task$ = new BehaviorSubject<any>({});
  selectedTask$ = this.task$.asObservable();
  

  constructor(private http : HttpClient) {
   }

  createTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/CreateTask`, task);
  }

  updateTask(task : Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTask`, task);
  }

  deleteTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/DeleteTask`, {body: task });
  }

  updateTaskColumnId(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTaskColumnId`, task);
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