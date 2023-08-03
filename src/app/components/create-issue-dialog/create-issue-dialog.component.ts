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
import { UserService } from 'src/app/services/user.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { FileService } from 'src/app/services/file.service';
import { FileData } from 'src/app/interfaces/FileData';

interface DialogData {
  table: MatTable<Task>;
}


@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {

  priorities: string[]; 
  selectedIcon: string;

  projects: Project[] = [];
  columns: ColumnDto[] = [];
  currentDate = new FormControl(new Date());
  currentProject: ProjectDto;

  reporter: ProjectUserDto[] = [];
  assignees: ProjectUserDto[] = [];
 

  
  descriptionText: string = '';
  Files: FileData[];
  addSubtopicClicked = false;
  fileIcons: { [extension: string]: string } = {
    jpg: '../../../assets/hosgeldiniz.png',
    png: '../../../assets/hosgeldiniz.png',
   // pptx: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/.pptx_icon_%282019%29.svg',
    docx: 'path-to-docx-icon',
    pdf: 'path-to-pdf-icon',
  };
  // v:File;

  task : Partial<Task> = {
    name: "",
    projectId: 0,
    columnId: 1,
    priority : 3,
    endDate: new Date(),
    // files: this.v;
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



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
    private dialog: MatDialog,
    private taskService: TaskService,
    private columnService: ColumnService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public translocoService: TranslocoService,
    public priorityService: PriorityService,
    public userService: UserService,
    private fileService: FileService

  ) {
    this.getAllProjects();
    this.getCurrentProject();
    this.priorities = this.priorityService.getOptions();
  }



  ngOnInit() {
    // this.projectService.selectedProject$?.subscribe((value) => {
    //   this.currentProject = value;
    // });

    // this.project = this.projectService?.getProjectLocal();
  }


 

  onIconSelectionChange() {
    const priorityNumber = this.priorityService.getIconPriority(this.selectedIcon);
    this.task.priority = priorityNumber;

  }


  onChangeProject(event: any) {
    this.columns = [];
    let pro : Partial<ProjectDto> ={
    }
    pro.id = event;
    this.columnService.GetAllProjectColumns({ "id": pro.id }).subscribe((response) => {
      if (response.data != null) {
        this.columns = response.data;
      }
    });

    this.userService.GetAllProjectUsers({"id": pro.id}).subscribe((response) => {
      if (response.isSuccessful == true) {
        this.assignees = response.data;
        this.reporter = response.data;
      }
    });
  }

  public getAllProjects() {
    this.projectService.getAllProjects().subscribe((response) => {
      if (response.data != null) {
        this.projects = response.data;
        this.ngOnInit();

      }
    });
  }

  addTask(){
    if(this.task.name != null && this.task.projectId != null && this.task.columnId != null && this.task.priority != null) {
      debugger;
      this.closeDialog();
    }
    else{
      alert("Input areas");
      return ;
    }

  }

  closeDialog() {
      this.dialogRef.close({
        isAdded: true,
        task: this.task
      });
    
  }

  public getCurrentProject() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
    });
    this.currentProject = this.projectService.getCurrentProject();
  }


  upload(event: Event){
    this.fileService.uploadFile(event);
    this.Files = this.fileService.selectedFiles;
  }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

}
