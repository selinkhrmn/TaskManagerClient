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
import { ColumnDto, TransferDto } from '../interfaces/columnDto';
@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  baseUrl = `${environment.baseUrl}/business/Column`;

  constructor(private http: HttpClient,
    public tokenService: TokenService) { }

  // headers = this.tokenService.getHeaders();
  // httpOptions = {
  //     headers: this.headers
  // };

  CreateColumn(column: Partial<Column>) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/CreateColumn`,column );
  }

  DeleteColumn(id : number) {
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/DeleteColumn`,{id: id} );
  }

  UpdateColumn(column: Partial<Column>) {
    
    return this.http.post<ResponseModel<Column>>(`${this.baseUrl}/UpdateColumn`,column );
  }

  GetAllProjectColumns(id: Partial<ProjectDto>) {
    return this.http.post<ResponseModel<ColumnDto>>(`${this.baseUrl}/GetAllProjectColumns`, id);
  }

  GetProjectColumnsTasks(id: number): Observable<ResponseModel<ColumnTask>> {
    debugger
    return this.http.post<ResponseModel<ColumnTask>>(`${this.baseUrl}/GetProjectColumnsTasks`, {id:id});
  }
  
  TransferColumnTasks(transferDto : TransferDto): Observable<ResponseModel<ColumnDto>>{
    return this.http.post<ResponseModel<ColumnDto>>(`${this.baseUrl}/TransferColumnTasks`, transferDto);
  }

  
}

