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
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService, setValue } from '@ngneat/transloco';
import { PriorityService } from 'src/app/services/priority.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { FileService } from 'src/app/services/file.service';
import { FileData } from 'src/app/interfaces/FileData';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { UserDto } from 'src/app/interfaces/user';
import { TokenService } from 'src/app/services/token.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface DialogData {
  table: MatTable<Task>;
}


@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {
  baseUrl = `${environment.baseUrl}/business/File`;
  priorities: string[];
  selectedIcon: string;

  projects: Project[] = [];
  columns: ColumnDto[] = [];
  currentDate: Date | undefined = undefined;
  currentProject: ProjectDto;
  currentTime = new Date();

  reporter: ProjectUserDto[] = [];
  assignees: ProjectUserDto[] = [];
  userList: UserDto[] = [];

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

  working = false;
  uploadFile: File | null;
  uploadFileLabel: string | undefined = 'Choose an image to upload';
  uploadProgress: number;
  uploadUrl: string;
  formData = new FormData();
  images: any[] = [];
  files: FileList;
  projectIdFromLocal: number;
  FileLabel: string[] = [];

  task: Partial<Task> = {
    name: "",
    projectId: this.projectService.getProjectLocal().id,
    columnId: 0,
    priority: 3,
    endDate: this.currentDate,
    assigneeId: "unassigned",
    reporterId: this.tokenService.getTokenId(),
    description: ""
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
    private fileService: FileService,
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router

  ) {

    this.getAllProjects();
    this.getCurrentProject();
    this.priorities = this.priorityService.getOptions();
    this.projectIdFromLocal = this.projectService.getProjectLocal().id;
    this.columnService.GetAllProjectColumns({ "id": this.projectIdFromLocal }).subscribe((res) => {
      this.task.columnId = res.data[0].id;
      this.columns = res.data;
    });

    this.userService.GetAllProjectUsers(this.projectIdFromLocal).subscribe((response) => {

      this.assignees = response.data;
      this.reporter = response.data;

    });
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }
    })
  }

  onIconSelectionChange() {
    const priorityNumber = this.priorityService.getIconPriority(this.selectedIcon);
    this.task.priority = priorityNumber;
  }

  onChangeProject(event: any) {
    this.columns = [];
    let pro: Partial<ProjectDto> = {
    }
    pro.id = event;
    let projectId: number = event;
    this.columnService.GetAllProjectColumns({ "id": pro.id }).subscribe((response) => {
      if (response.data != null) {
        this.columns = response.data;
        this.task.columnId = response.data[0].id;

      }
    });

    this.userService.GetAllProjectUsers(projectId).subscribe((response) => {
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
      }
    });
  }

  addTask() {
    // if(this.task.name != null && this.task.projectId != null && this.task.columnId != null && this.task.priority != null) {
    if (this.task.name != null) {
      this.closeDialog();
    } 
    // window.location.reload();
  }

  closeDialog() {
    this.images.forEach(f => {
      this.formData.append('file', f);
    });
    this.taskService.createTask(this.task).subscribe((response) => {
      if (response.isSuccessful) {

        window.location.reload();
      } 
    });   
    this.dialogRef.close({
      isAdded: true,  
      task: this.task,    
      file: this.formData
    });
  }

  public getCurrentProject() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
    });
    this.currentProject = this.projectService.getCurrentProject();
  }

  uploadEvent(event: Event) {
    this.fileService.uploadFile(event);
    this.Files = this.fileService.selectedFiles;
  }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  handleFileInput(e:any) {
    var i = 0;
    let list: FileList = e.files;
 
    const listArray = Array.from(list);

    listArray.forEach((file: File, i: number) => {
      this.FileLabel[i] = file.name;
      i++;
    });
      let x:any[]=[];
    for(let i = this.images.length; i < e.files.length; i++){
    x.push(e.files[i]);
    }
    if (x.length > 0) {
      x.forEach(f => {
        this.images.push(f);
      });
    }

  }

}