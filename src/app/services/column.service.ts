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
import { TokenService } from './token.service';
import { ColumnDto } from '../interfaces/columnDto';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  baseUrl = `${environment.baseUrl}/business/Column`;

  constructor(private http: HttpClient,
    public tokenService: TokenService) { }

  headers = this.tokenService.getHeaders();
  httpOptions = {
      headers: this.headers
  };

  CreateColumn(column: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/CreateColumn`,column, this.httpOptions );
  }

  DeleteColumn(id : Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/DeleteColumn`,id, this.httpOptions );
  }

  UpdateColumn(column: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/UpdateColumn`,column, this.httpOptions );
  }

  GetAllProjectColumns(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<ColumnDto>>(`${this.baseUrl}/GetAllProjectColumns`, id, this.httpOptions);
  }

  GetProjectColumnsTasks(id: Partial<ProjectDto>): Observable<ResponseModel<ColumnTask>> {
    return this.http.post<ResponseModel<ColumnTask>>(`${this.baseUrl}/GetProjectColumnsTasks`, id, this.httpOptions);
  }

  
}

