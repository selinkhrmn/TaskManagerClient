import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Project } from 'src/app/interfaces';
import { Task } from 'src/app/interfaces/task';
import { ProjectService } from 'src/app/services';
import { TaskService } from 'src/app/services/task.service';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ColumnService } from 'src/app/services/column.service';
import { Column } from 'src/app/interfaces/column';
import { ProjectDto } from 'src/app/interfaces/project';
import { IPriority } from 'src/app/interfaces/IPriority';
import { MatSnackBar} from '@angular/material/snack-bar';
import { TranslocoService} from '@ngneat/transloco';
import { PriorityService } from 'src/app/services/priority.service';

interface DialogData {
  table: MatTable<Task>;
}


@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {

  
  // priorities: IPriority[] = [
  //   { name: "highest", value: 5 },
  //   { name: "high", value: 4 },
  //   { name: "medium", value: 3 },
  //   { name: "low", value: 2 },
  //   { name: "lowest", value: 1 }
  // ];

  iconOptions: string[]; 
  selectedIcon: string;

  projects: Project[] = [];
  columns: Column[] = [];
  currentDate = new FormControl(new Date());
  currentProject: ProjectDto;
  project: ProjectDto = {
    name: '',
    id: 0
  }

  task : Partial<Task> = {
    name: "",
    projectId: 0,
    columnId: 1,
    priority : 3,
    endDate: new Date()
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
    private snackBar: MatSnackBar,
    public translocoService: TranslocoService,
    public priorityService: PriorityService

  ) {
    this.getAllProjects();
    this.getCurrentProject();
    this.iconOptions = this.priorityService.getOptions();
  }



  ngOnInit() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
    });

    this.project = this.projectService?.getProjectLocal();
  }


 

  onIconSelectionChange() {
    const priorityNumber = this.priorityService.getIconPriority(this.selectedIcon);
    console.log('Selected Priority Number:', priorityNumber);
    this.task.priority = priorityNumber;

  }


  onChangeProject(event: any) {
    this.columns = [];
    this.project.id = event.id;
    this.project.name = event.name;
    let pro : Partial<ProjectDto> ={
    }
    pro.id = event.id;
    this.columnService.GetAllProjectColumns({ "id": pro.id }).subscribe((response) => {
      if (response.data != null) {
        this.columns = response.data;
      }
    });
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
    if(this.task.name != null || this.task.projectId != null || this.task.columnId != null || this.task.priority != null) {
      this.dialogRef.close({
        isAdded: true,
        name: this.task.name,
        projectId: this.task.projectId,
        columnId: this.task.columnId,
        priority: this.task.priority,
        endDate : this.task.endDate
      });
    }
  }


}
