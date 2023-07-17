import { Component, ErrorHandler, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Project } from 'src/app/interfaces';
import { Task } from 'src/app/interfaces/task';
import { ProjectService } from 'src/app/services';
import { TaskService } from 'src/app/services/task.service';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ColumnService } from 'src/app/services/column.service';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { Column } from 'src/app/interfaces/column';

interface DialogData {
  table: MatTable<Task>;
}

@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {
  

  task: Task[] = [];
  projects: Project[] = [];
  currentDate = new FormControl(new Date());

  project : Project;
  column : Column;
  taskName: string;
  dueTime : Date;

  projectForTask: Project[] = [];
  columnForTask: Column[] = [];

  currentProject: Partial<Project>;

  

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial'
  };


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
    private dialog: MatDialog,
    private taskService: TaskService,
    private columnService: ColumnService,
    private projectService: ProjectService,

  ) {
    this.getAllProjects();
    this.getCurrentProject();
  }


  ngOnInit() {
      //get current project id 
       this.projectService.selectedProject$?.subscribe((value) => {
        this.currentProject = value;
      });
      this.currentProject = this.projectService.getCurrentProject();
  
      //get current colums of projects
      this.columnService.GetAllProjectColumns({"projectId": this.currentProject.id}).subscribe((response) => {
        if(response.data != null){
          this.columnForTask = response.data;
          
        }
        
      });

      //error message
      
  }


  createTask() {
    this.taskService.createTask({ "name": this.taskName, "columnId": this.column.id , "projectId": this.project.id }).subscribe(
      response => {
        if (response.data != null) {
          this.task = response.data;
          
        }
      });
   
  }

  // setTask(task: any) {
  //   this.taskService.updateTask(task);
  // }


  // //bütün projeleri servis üstünden çekip proje arrayına atanıyor.
  public getAllProjects() {
    this.projectService.getAllProjects().subscribe((response) => {
      if (response.data != null ) {
        this.projects = response.data;
        this.ngOnInit();
        
      }
    });
    
  }

  // returned current project from local storage.
  public getCurrentProject() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
    });
    this.currentProject = this.projectService.getCurrentProject();
  }



}
