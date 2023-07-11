import { Injectable } from '@angular/core';
import { Column } from '../interfaces/column';
import { ColumnTask } from '../interfaces/columnTasks';
import { ResponseModel } from '../interfaces/responseModel';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  baseUrl = `${environment.baseUrl}/Column`;

  constructor(private http: HttpClient) { }

  GetProjectColumnsTasks(projectId: number): Observable<ResponseModel<ColumnTask>> {
    return this.http.post<ResponseModel<ColumnTask>>(`${this.baseUrl}/GetProjectColumnsTasks`, projectId);
  }
}
