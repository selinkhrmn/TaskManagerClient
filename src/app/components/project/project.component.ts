import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileData } from 'src/app/interfaces/FileData';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { UserDto } from 'src/app/interfaces/user';
import { ProjectService } from 'src/app/services';
import { FileService } from 'src/app/services/file.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';



interface DialogData {
  project: Project;
}


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectId: number = this.data.project.id;
  projectName:string = this.data.project.name;
  fileUploaded: boolean = false;
  descriptionText: string = '';
  Files: FileData[];
  project:Project = Object.assign({}, this.data.project);
  addSubtopicClicked = false;


  projects: Project[]=[];
  userList: UserDto[] = [];

  constructor(    
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private projectService: ProjectService,
    private userService: UserService,
    private fileService: FileService,
    public tokenService: TokenService,
    private dialogRef: MatDialogRef<ProjectComponent>
    ){}



  ngOnInit(): void {
    console.log(this.data);
    
   this.GetProject();
   this.userService.getAllUsers().subscribe((res)=>{
    if(res.isSuccessful ==true){
      this.userList = res.data;
    }
   });
  }

  GetProject(){
    this.projectService.getProject({"id" : this.projectId}).subscribe((res)=>{
      if(res.isSuccessful ==true){
        this.projects = res.data;
        console.log(res.data);
      }
    })
  }

  upload(event: Event) {
    this.fileUploaded = true;
    debugger;
    this.fileService.uploadFile(event);

    this.Files = this.fileService.selectedFiles;
  }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  updateProject(){
    if(this.data.project != this.project){
      this.projectService.updateProject(this.project).subscribe((res)=> {
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

  editOpen(id: number){
    return true;
  }

  
}

