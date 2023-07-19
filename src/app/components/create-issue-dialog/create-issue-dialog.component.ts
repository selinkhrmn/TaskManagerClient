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
import { Column } from 'src/app/interfaces/column';
import { taskDto } from 'src/app/interfaces/taskDto';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { ProjectDto } from 'src/app/interfaces/project';

interface DialogData {
  table: MatTable<Task>;
}

interface IPriority {
  name: string;
  value: number;
}


@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {
  errors: any = {};
  
  priorities: IPriority[] = [
    { name: "highest", value: 5 },
      { name: "high", value: 4 },
      { name: "medium", value: 3 },
      { name: "low", value: 2 },
      { name: "lowest", value: 1 }
  ];

  projects: Project[] = [];
  currentDate = new FormControl(new Date());
  

  task: Partial<Task> = {
    name: "",
    projectId: 0,
    columnId: 0,
    priority: 0,
    userUpdatedDate: new Date,
    endDate: new Date,
   
  }

   
  // column : Column;
  // taskName: string;
  // dueTime : Date;

  projectForTask: Project[] = [];
  columns: Column[] = [];
  currentProject: ProjectDto;
  project : ProjectDto = {
    name: '',
    id: 0
  }

  

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
    private fb: FormBuilder,
    private errorHandler: ErrorHandler

  ) {
    this.getAllProjects();
    this.getCurrentProject();
  }



  ngOnInit() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
    });
    
    this.project = this.projectService?.getProjectLocal();

  }

  onChangeProject(event: any){
    this.columns = [];
    this.project.id = event.id;
    this.project.name = event.name;
    this.columnService.GetAllProjectColumns({ "id": this.project.id }).subscribe((response) => {
      if (response.data != null) {
        this.columns = response.data;
      }
    });
  }


  createTask() {
    this.closeDialog();

  }

  // //bütün projeleri servis üstünden çekip proje arrayına atanıyor.
  public getAllProjects() {
    this.projectService.getAllProjects().subscribe((response) => {
      if (response.data != null) {
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

  closeDialog() {
    this.dialogRef.close({
      isAdded : true,
      task : this.task
    });
  }

}
