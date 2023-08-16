import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileData } from '../interfaces/FileData';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Token } from '@angular/compiler';
import { ResponseModel } from '../interfaces/responseModel';




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
    debugger
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
    debugger
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    return this.fileIcons[fileExtension] || 'default-icon'; // Provide a default icon URL for unknown types
  }

  saveFile(files: any, taskId: string) {
    

     const url = `${this.baseUrl}/UploadWithout`;
    // const params = new HttpParams().set('taskId', taskId.toString());
    // return this.http.post(url, { params: params });

    const params = new HttpParams().set('taskId', taskId);
  const httpOptionsFormData = {
    headers: new HttpHeaders({
      'Accept': 'application/json'
    }),
    params: params
  };

   return this.http.post(url, files, httpOptionsFormData);

    // return this.http.post(`${this.baseUrl}/UploadWithout?taskId=${taskIdString}`, files, this.httpOptionsFormData);
  }
}

// saveFile(files: File[], taskId: string): Observable<any> {
//   const url = `${this.baseUrl}/UploadWithout`;
  
//   const formData = new FormData();
//   for (const file of files) {
//     formData.append('files', file, file.name);
//   }

//   const params = new HttpParams().set('taskId', taskId);
//   const httpOptionsFormData = {
//     headers: new HttpHeaders({
//       'Accept': 'application/json'
//     }),
//     params: params
//   };

//   return this.http.post(url, formData, httpOptionsFormData);
// }

