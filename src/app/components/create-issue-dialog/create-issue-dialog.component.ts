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
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { UserDto } from 'src/app/interfaces/user';

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
  currentDate = new FormControl(new Date());
  currentProject: ProjectDto;

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
  uploadFile: File | null ;
  uploadFileLabel: string | undefined = 'Choose an image to upload';
  uploadProgress: number;
  uploadUrl: string;
  formData = new FormData();
  images:any[]=[];
  files : FileList;

  task : Partial<Task> = {
    name: "",
    projectId: 0,
    columnId: 1,
    priority : 3,
    endDate: new Date()
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
    private fileService: FileService,
    private http : HttpClient

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
    let pro : Partial<ProjectDto> ={
    }
    pro.id = event;
    let projectId: number = event;
    this.columnService.GetAllProjectColumns({ "id": pro.id }).subscribe((response) => {
      if (response.data != null) {
        this.columns = response.data;
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
        this.ngOnInit();

      }
    });
  }

  addTask(){
    // if(this.task.name != null && this.task.projectId != null && this.task.columnId != null && this.task.priority != null) {
      if(this.task.name != null) {

      this.closeDialog();
    }
    else{
      alert("Input areas");
      return ;
    }

  }

  closeDialog() {
    this.images.forEach(f=>{
      this.formData.append('file',f); 
      });
    
      this.dialogRef.close({
        isAdded: true,
        task: this.task,
        file : this.formData
      });
   
  }

  public getCurrentProject() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
    });
    this.currentProject = this.projectService.getCurrentProject();
  }

  uploadEvent(event: Event){
    this.fileService.uploadFile(event);
    this.Files = this.fileService.selectedFiles;
  }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  handleFileInput(e:any) {
    
    
      this.uploadFile = e.files.item(0);
      this.uploadFileLabel = this.uploadFile?.name;
      let x:any[]=[];
    for(let i = this.images.length; i < e.files.length; i++){
    x.push(e.files[i]);
    }
    if(x.length>0){
      x.forEach(f=> {
        this.images.push(f);
      });
    }
    console.log(this.uploadFile);

   

  //   this.files = files;
  // this.uploadFileLabel = ''; 

  // for (let i = 0; i < files.length; i++) {
  //   const file = files.item(i);
  //   this.uploadFileLabel += file?.name;
  //   this.uploadFileLabel += "-";
    
  // }
    
  }

//   upload() {
//     debugger
//     // if (!this.task.name) {
//     //   alert('Please write a task name');
//     //   return;
//     // }

//     if(!this.uploadFile) {
//       // alert("file boş");
//       return;
//     }

//     const formData = new FormData();
//     this.formData = formData;
//     formData.append(this.uploadFile.name, this.uploadFile, this.task.id?.toString());

    

//     this.uploadUrl = '';
//     this.uploadProgress = 0;
//     this.working = true;

//   // this.http.post(`${this.baseUrl}/UploadFile`, formData, {reportProgress : true}).subscribe((event : any) => {
//   //   if (event.type === HttpEventType.UploadProgress) {
//   //     this.uploadProgress = Math.round((100 * event.loaded) / event.total);
//   //   } else if (event.type === HttpEventType.Response) {
//   //     this.uploadUrl = event.body.url;
//   //   }
//   // }, (error: any) => {
//   //   console.error(error);
//   // }).add(() => {
//   //   this.working = false;
//   // });;

//   this.fileService.saveFile(formData, this.task.id?.toString()).subscribe((event : any) => {
//     if (event.type === HttpEventType.UploadProgress) {
//       this.uploadProgress = Math.round((100 * event.loaded) / event.total);
//     } else if (event.type === HttpEventType.Response) {
//       this.uploadUrl = event.body.url;
//     }
//   }, (error: any) => {
//     console.error(error);
//   }).add(() => {
//     this.working = false;
//   });;


// }
}
