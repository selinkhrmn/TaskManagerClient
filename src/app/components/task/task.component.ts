import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { taskDto } from 'src/app/interfaces/taskDto';
import { TaskService } from 'src/app/services/task.service';
import { TranslocoService} from '@ngneat/transloco';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface DialogData{
  task: Task;
}

interface FileData {
  file: File;
  iconUrl: string; 
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
  editingTaskName = false;
  descriptionText: string = '';
  selectedFiles: FileData[] = [];

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
    private dialogRef: MatDialogRef<TaskComponent>,
    private fb: FormBuilder
    ) { }

    
  
  onTaskNameClick() {
    this.editingTaskName = true;
  }

  onTaskNameBlur() {
    this.editingTaskName = false;
    this.updateTask();
  }

 

  onFileSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      this.selectedFiles = Array.from(inputElement.files).map((file) => ({
        file,
        iconUrl: this.getFileIconUrl(file),
      }));
    }
  }

  getFileIconUrl(file: File): string {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    return this.fileIcons[fileExtension] || 'default-icon'; // Provide a default icon URL for unknown types
  }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.selectedFiles);
  }

  updateTask(){
    debugger;
    if(this.data.task != this.task ){
      this.taskService.updateTask(this.task).subscribe((res)=> {
        console.log(res.data);
      })
    }
    
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
