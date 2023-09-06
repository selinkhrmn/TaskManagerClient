import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../interfaces/responseModel';
import { LogDto, LogUserDto } from '../interfaces/logDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  baseUrl = `${environment.baseUrl}/business/Log`;

  constructor(  private http: HttpClient) { }

  public getLogs(tableName: string, tableid: string) : Observable<ResponseModel<LogDto>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("tablename", tableName);
    queryParams =  queryParams.append("tableid", tableid);
 
    return this.http.get<ResponseModel<LogDto>>(`${this.baseUrl}/GetLogs`,{params:queryParams});
  }

  getUserLogs(projectIds: number[], userId: string): Observable<ResponseModel<LogUserDto>> {
    let queryParams = new HttpParams();
    const tableIdString = projectIds.join(',');
    queryParams = queryParams.set('ProjectIds', tableIdString);
    queryParams= queryParams.set('UserId', userId);
    return this.http.get<ResponseModel<LogUserDto>>(`${this.baseUrl}/GetUserLogs`,{params:queryParams});
  }
}
