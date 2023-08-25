import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { ResponseModel } from '../interfaces/responseModel';
import { CommentRequest, Comment } from '../interfaces/comment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommentService {


  baseUrl = `${environment.baseUrl}/business/Comment`;

  constructor(private http: HttpClient,
    public tokenService: TokenService) { }

  headers = this.tokenService.getHeaders();
  httpOptions = {
    'Content-Type': 'application/json',
      headers: this.headers
  };

  GetTaskComments(taskId: number): Observable<ResponseModel<Comment>> {
    return this.http.get<ResponseModel<Comment>>(`${this.baseUrl}/GetTaskComments`, { ...this.httpOptions, params: { taskId: taskId.toString()}});
  }
  
  CreateComment(comment: CommentRequest) {
    return this.http.post<ResponseModel<Comment>>(`${this.baseUrl}/CreateComment`, comment);
  }

  UpdateComment(comment: CommentRequest){
    return this.http.post<ResponseModel<Comment>>(`${this.baseUrl}/UpdateComment`, comment); 
  }

  DeleteComment(id: number){
    return this.http.post<ResponseModel<Comment>>(`${this.baseUrl}/DeleteComment`, {id: id}); 
  }
  
}
