import { Injectable } from '@angular/core';
import { Column } from '../interfaces/column';
import { ColumnTask } from '../interfaces/columnTasks';
import { ResponseModel } from '../interfaces/responseModel';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OnInit } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ColumnService implements OnInit{

  baseUrl = `${environment.baseUrl}/Column`;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
  }

  CreateColumn(column: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/CreateColumn`,column );
      

  }

  GetAllProjectColumns(projectId: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/GetAllProjectColumns`, projectId);
  }

  GetProjectColumnsTasks(projectId: Partial<Column>): Observable<ResponseModel<ColumnTask>> {
    return this.http.post<ResponseModel<ColumnTask>>(`${this.baseUrl}/GetProjectColumnsTasks`, projectId);
  }
}

