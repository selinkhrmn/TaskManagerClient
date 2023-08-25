import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { ResponseModel } from '../interfaces/responseModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Project } from '../interfaces';
import { TokenService } from './token.service';
import { ProjectDto } from '../interfaces/project';
import { ListTask } from '../interfaces/listTask';
import { UserDto } from '../interfaces/user';
import { TaskDto } from '../interfaces/taskDto';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  task: Task;
  baseUrl = `${environment.baseUrl}/business/Task`;

  private task$ = new BehaviorSubject<any>({});
  selectedTask$ = this.task$.asObservable();

 // selectedFilter: { name: string; fromDate: Date; toDate: Date } | null = null;
 selectedFilter: any | null = null;
  summaryFilter: string | null = null;

  constructor(private http: HttpClient,
    public tokenService: TokenService) {
  }

  // headers = this.tokenService.getHeaders();
  // httpOptions = {
  //   headers: this.headers
  // };

  createTask(task: Partial<Task>): Observable<ResponseModel<Task>> {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/CreateTask`, task);
  }


  updateTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTask`, task);
  }

  deleteTask(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/DeleteTask`, { body: task });
  }

  updateTaskColumnId(task: Partial<Task>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/UpdateTaskColumnId`, task);
  }

  getAllProjectTask(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<ListTask>>(`${this.baseUrl}/GetAllProjectTask`, id);
  }

  getTaskById(id: number) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetTaskById`, { id: id });
  }

  GetAllTaskForUser(id: Partial<UserDto>) {
    return this.http.post<ResponseModel<Task>>(`${this.baseUrl}/GetAllTaskForUser`, id);
  }

  // setSelectedFilter(filter: { name: string, fromDate: Date, toDate: Date }) {
  //   console.log("Setting filter:", filter);
  //   this.selectedFilter = filter;
  // }

  
  setSelectedFilter(filter: any) {
    console.log("Setting filter:", filter);
    this.selectedFilter = filter;
  }


  getSelectedFilter() {
    return this.selectedFilter;
  }



  getSummaryFilter(){
    return this.summaryFilter;
  }

  getUnplannedTask(projectId: number){
    const url = `${this.baseUrl}/UnplannedTask`;
    const params = new HttpParams().set('id', projectId.toString());
    return this.http.get<ResponseModel<TaskDto>>(url, { params: params });
  }

  // getUnassignedTask(projectId: number){
  //   const url = `${this.baseUrl}/UnassignedTask`;
  //   const params = new HttpParams().set('id', projectId.toString());
  //   return this.http.get<ResponseModel<TaskDto>>(url, { params: params });
  // }

  filterUpdatedDate(filteredData: ListTask[], updatedFromDate: Date, updatedToDate?: Date ){
    if (updatedFromDate && updatedToDate) {
      
      updatedToDate.setHours(23, 59, 59, 999); 
      filteredData = filteredData.filter(t => {
        const taskUpdatedDate = new Date(t.updatedDate);
        return (taskUpdatedDate >= updatedFromDate && taskUpdatedDate <= updatedToDate);
      });
    }
    else if (updatedFromDate) {
      filteredData = filteredData.filter(t => {
        const taskUpdatedDate = new Date(t.updatedDate);
        return (taskUpdatedDate >= updatedFromDate);
      });
    }
    return filteredData;
  }


  filterCreatedDate(filteredData: ListTask[], createdFromDate: Date, createdToDate?: Date){
    if (createdFromDate && createdToDate) {
        createdToDate.setHours(23, 59, 59, 999); 
        filteredData = filteredData.filter(t => {
          const taskCreatedDate = new Date(t.createdDate);
          return (taskCreatedDate >= createdFromDate && taskCreatedDate <= createdToDate);
        });
      }
      else if (createdFromDate) {
        filteredData = filteredData.filter(t => {
          const taskCreatedDate = new Date(t.createdDate);
          return (taskCreatedDate >= createdFromDate);
        });
      }
    return filteredData;
  }

  filterDueDate(filteredData: ListTask[], dueDateFrom: Date, dueDateTo?: Date){
    if (dueDateFrom && dueDateTo) {
      dueDateTo.setHours(23, 59, 59, 999); 
      filteredData = filteredData.filter(t => {
        const taskDueDate = new Date(t.dueDate);

        return (taskDueDate >= dueDateFrom && taskDueDate <= dueDateTo);
      });
    }
    else if (dueDateFrom) {
      filteredData = filteredData.filter(t => {
        const taskDueDate = new Date(t.dueDate);
        return (taskDueDate >= dueDateFrom);
      });
    }
    return filteredData;
  }

  filterDoneSevenDay(filteredData: ListTask[], isDoneFromDate: Date, isDoneToDate: Date){
    if (isDoneFromDate && isDoneToDate) {
      isDoneToDate.setHours(23, 59, 59, 999); 
      filteredData = filteredData.filter(t => {
        const taskUpdatedDate = new Date(t.updatedDate);
        return (taskUpdatedDate >= isDoneFromDate && taskUpdatedDate <= isDoneToDate && t.isDone == true);
      });
      return filteredData;
    }
    else{
      return null;
    }
  }

}
