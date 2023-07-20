import { Injectable } from '@angular/core';
import { Column } from '../interfaces/column';
import { ColumnTask } from '../interfaces/columnTasks';
import { ResponseModel } from '../interfaces/responseModel';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OnInit } from '@angular/core';
import { Project } from '../interfaces';
import { ProjectDto } from '../interfaces/project';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  baseUrl = `${environment.baseUrl}/business/Column`;

  constructor(private http: HttpClient) { }

  CreateColumn(column: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/CreateColumn`,column );
  }

  DeleteColumn(id : Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/DeleteColumn`,id );
  }

  UpdateColumn(column: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/UpdateColumn`,column );
  }

  GetAllProjectColumns(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/GetAllProjectColumns`, id);
  }

  GetProjectColumnsTasks(id: Partial<ProjectDto>): Observable<ResponseModel<ColumnTask>> {
    return this.http.post<ResponseModel<ColumnTask>>(`${this.baseUrl}/GetProjectColumnsTasks`, id);
  }

  
}

