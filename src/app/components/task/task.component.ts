import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { taskDto } from 'src/app/interfaces/taskDto';
import { TaskService } from 'src/app/services/task.service';
import { TranslocoService} from '@ngneat/transloco';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {  ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TokenService } from 'src/app/services/token.service';
import { FileService } from 'src/app/services/file.service';
import { FileData } from 'src/app/interfaces/FileData';


interface DialogData{
  task: Task;
}



@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})


export class TaskComponent  {
  taskName: string = this.data.task.name;
  taskId: number =this.data.task.id;
  taskProjectId: number = this.data.task.projectId
  task : Task = Object.assign({}, this.data.task);
  taskDueDate = new FormControl(this.task.endDate);
  editorContent: string;
  descriptionText: string = '';
  Files: FileData[];
  fileUploaded: boolean = false;
  @ViewChild('wrapper') wrapperElement!: ElementRef<HTMLElement>;
  addSubtopicClicked = false;
  fileIcons: { [extension: string]: string } = {
    jpg: '../../../assets/hosgeldiniz.png',
    png: '../../../assets/hosgeldiniz.png',
   // pptx: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/.pptx_icon_%282019%29.svg',
    docx: 'path-to-docx-icon',
    pdf: 'path-to-pdf-icon',
  };
 
  constructor(
    private taskService : TaskService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translocoService : TranslocoService,
    public projectService: ProjectService,
    private dialogRef: MatDialogRef<TaskComponent>,
    private fb: FormBuilder,
    private router: Router,
    public tokenService: TokenService, 
    private location: Location,
    private fileService: FileService
    ) { }

    
    
    logChange($event: any) {
      console.log('Content changed:', $event);
    }



 upload(event: Event){
  this.fileUploaded = true;
  debugger;
this.fileService.uploadFile(event);

this.Files = this.fileService.selectedFiles;
 }

  // onFileSelect(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement?.files) {
  //     this.selectedFiles = Array.from(inputElement.files).map((file) => ({
  //       file,
  //       iconUrl: this.getFileIconUrl(file),
  //     }));
  //   }
  // }

  // getFileIconUrl(file: File): string {
  //   const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  //   return this.fileIcons[fileExtension] || 'default-icon'; // Provide a default icon URL for unknown types
  // }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  updateTask(){
    if(this.data.task != this.task ){
      this.taskService.updateTask(this.task).subscribe((res)=> {
        console.log(res.data);
      })
    }
    
  }

  closeDialog() {
    this.dialogRef.close();
    
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: "'Kanit', sans-serif"

  };
 // Add this method to your component class
closeDetails() {
  // Implement the logic to close the "Details" section
  // For example, you can set a variable to hide the "Details" section or navigate to another page.
}

onCloseDetails() {
  this.location.back();
}

}
