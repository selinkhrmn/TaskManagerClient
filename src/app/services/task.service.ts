import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { ResponseModel } from '../interfaces/responseModel';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = `${environment.baseUrl}/Task`;

  constructor(private http : HttpClient) { }

  createTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/CreateTask`, task);
  }

}
