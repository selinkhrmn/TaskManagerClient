import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileData } from '../interfaces/FileData';



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
  constructor(private http:HttpClient) { }



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
}
