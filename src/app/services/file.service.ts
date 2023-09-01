import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileData } from '../interfaces/FileData';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Token } from '@angular/compiler';
import { ResponseModel } from '../interfaces/responseModel';
import { UserDto } from '../interfaces/user';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})



export class FileService {
   


selectedFiles: FileData[] = [];
fileIcons: { [extension: string]: string } = {
  jpg: '../../../assets/hosgeldiniz.png',
  png: '../../../assets/hosgeldiniz.png',
 // pptx: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/.pptx_icon_%282019%29.svg',
  docx: 'path-to-docx-icon',
  pdf: 'path-to-pdf-icon',
};

task : any;
baseUrl = `${environment.baseUrl}/business/File`;
token = localStorage.getItem('token'); 
httpOptionsFormData = {
  headers: new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
  })
}
 constructor(private http:HttpClient,
    private tokenService : TokenService) {} 



  uploadFile(event:Event){
    const inputElement = event.target as HTMLInputElement;
    if(inputElement?.files){
      this.selectedFiles = Array.from(inputElement.files).map((file)=>({
        file,
        iconUrl: this.getFileIconUrl(file),
      }));
    }
    this.onSave();
    
  }

  

  onSave(){
    console.log('Selected Files', this.selectedFiles);
  }

  getFileIconUrl(file: File): string {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    return this.fileIcons[fileExtension] || 'default-icon'; // Provide a default icon URL for unknown types
  }

  //for task files 
  saveFile(files: any, taskId: string) {
     const url = `${this.baseUrl}/UploadWithout`;

    const params = new HttpParams().set('taskId', taskId);
  const httpOptionsFormData = {
    headers: new HttpHeaders({
      'Accept': 'application/json'
    }),
    params: params
  };

   return this.http.post(url, files, httpOptionsFormData);
  }

  //to get tasks files
  GetFileForTask(id : any) : Observable<any> {
    const url = `${this.baseUrl}/GetFileForTask`;
    return this.http.post(url, id);
  }

  // for user profile photo
  addFile(files : any , userId : string) {
  
    const url = `${this.baseUrl}/AddFile`;
    const params = new HttpParams().set('userId', userId);
    const httpOptionsFormData = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      params: params
    };
  
     return this.http.post(url, files, httpOptionsFormData);
  }

  //to get profile photos
  getProfilePhoto(id: any): Observable<any> {

    const url = `${this.baseUrl}/GetFile`;
    return this.http.post(url, id);
  }

  //to get all users profile photo
  GetFileForProjectUsers(projectId : any) : Observable<any> {
    debugger
    const url = `${this.baseUrl}/GetFileForProjectUsers`;
    return this.http.post(url, projectId);
  }
 

}



