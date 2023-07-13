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
  

  constructor(private http : HttpClient) {
    this.getTaskLocal();
   }

  createTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/CreateTask`, task);
  }

  updateTask(task : Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTaks`, task);
  }

  deleteTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/DeleteTask`, {body: task });
  }


  // setTask(task: any) {
  //   this.task = task;
  //   this.task$.next(task);
  //   localStorage.setItem('tasks', JSON.stringify({"column-id" : this.task.columnId,"project-id" : this.task.projectId ,"name": this.task.name} ));

  // }

  getTask(taskId : Partial<Project>)  {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetTaskById`, taskId);
  }


   getTaskLocal() {
    // debugger;
    const data = localStorage.getItem('current-project');
    this.task = data ? JSON.parse(data) : null ;
  }
}
