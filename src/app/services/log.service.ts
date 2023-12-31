import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../interfaces/responseModel';
import { LogDto, LogUserDto } from '../interfaces/logDto';
import { Observable } from 'rxjs';
import { PagedResult } from '../interfaces/pagedResult';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  baseUrl = `${environment.baseUrl}/business/Log`;

  constructor(private http: HttpClient) { }

  public getLogs(tableName: string, tableid: string): Observable<ResponseModel<LogDto>> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("tablename", tableName);
    queryParams = queryParams.append("tableid", tableid);

    return this.http.get<ResponseModel<LogDto>>(`${this.baseUrl}/GetLogs`, { params: queryParams });
  }

  
  getUserLogs(projectIds: number[], userId: string, pageNumber: number, pageSize: number): Observable<ResponseModel<PagedResult<LogUserDto>>> {
    let params = new HttpParams()
      .append('ProjectIds', projectIds.join(','))
      .append('UserId', userId)
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());

    return this.http.get<ResponseModel<PagedResult<LogUserDto>>>(`${this.baseUrl}/GetUserLogs`, { params: params });
}


}
