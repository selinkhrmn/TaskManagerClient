import { Component, Inject, Input, OnInit,HostListener,OnDestroy   } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { TaskService } from 'src/app/services/task.service';
import { TranslocoService } from '@ngneat/transloco';
import { FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ElementRef, ViewChild } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { FileService } from 'src/app/services/file.service';
import { FileData } from 'src/app/interfaces/FileData';
import { CommentService } from 'src/app/services/comment.service';
import { CommentRequest, Comment } from 'src/app/interfaces/comment';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { PriorityService } from 'src/app/services/priority.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface DialogData {
  task: Task;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})




export class TaskComponent implements OnInit {

  



  @ViewChild('wrapper') wrapperElement!: ElementRef<HTMLElement>;
  taskName: string = this.data.task.name;
  taskId: number = this.data.task.id;
  taskProjectId: number = this.data.task.projectId;
  isDone : boolean = false;
  isWorking : boolean = false;
  taskChange: Task = JSON.parse(JSON.stringify(this.data.task));
  taskDueDate = new FormControl(this.taskChange.endDate);
  taskUpdatedDate = new FormControl(this.taskChange.updatedDate)
  taskC = new FormControl(this.taskChange.createdDate);
  editorContent: string;
  descriptionText: string = '';
  Files: FileData[];
  fileUploaded: boolean = false;
  addSubtopicClicked = false;
  commentWantsToGetCreated: boolean;
  commentWantsToBeEdited: boolean;
  fileIcons: { [extension: string]: string } = {
    jpg: '../../../assets/hosgeldiniz.png',
    png: '../../../assets/hosgeldiniz.png',
    // pptx: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/.pptx_icon_%282019%29.svg',
    docx: 'path-to-docx-icon',
    pdf: 'path-to-pdf-icon',
  };
  commentReq: CommentRequest = {
    id: this.taskId,
    comment: ''
  };
  comments: Comment[] = [];
  userList: UserDto[] = [];
  createComment: string;
  priorities: string[] = [];
  users: ProjectUserDto[] = [];
  selectedDate: Date;
  isInputDisabled: boolean = false;
  taskColor: number;
  

  public sortableElement: any
  public selectedUser: string = this.data.task.reporterId;

  constructor(
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
    public translocoService: TranslocoService,
    public projectService: ProjectService,
    private dialogRef: MatDialogRef<TaskComponent>,
    public tokenService: TokenService,
    public priorityService: PriorityService,
    private fileService: FileService,
    private commentService: CommentService,
    private userService: UserService,
    
  ) { }

  ngOnInit() { 
    console.log(this.taskChange.label);
    
    this.getTaskComments();
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }
    });

    this.userService.GetAllProjectUsers(this.projectService.getProjectLocal().id).subscribe((res) => {
      if(res.isSuccessful == true){
        this.users = res.data
        this.users.unshift({ id: 'unassigned', profileImageUrl: '../../assets/user.png'});
      }
    })
    this.priorities = this.priorityService.getOptions();
    this.sortableElement = this.priorityService.getIcon(this.data.task.priority, 'icon');

    this.taskColor = this.taskChange.label  

    
    this.commentWantsToBeEdited= false;
    


  }
  
  ngOnDestroy() {
    this.closeDialog(); // Call closeDialog() when the component is about to be destroyed
  }


  closeSubmitAndCancelButtons() {
    this.commentWantsToGetCreated = false;
    this.createComment= ''
  }

  closeEditAndDeleteButtons() {
    this.commentWantsToBeEdited= true;
  }


  logChange($event: any) {
    console.log('Content changed:', $event);
  }

  selectUserForAssignee(userId: string){
    this.taskChange.assigneeId = userId;
    
  }
  selectUserForReporter(userId: string){
    this.taskChange.reporterId = userId;
    
  }

  setSortableElement(event: any) {
    
    this.sortableElement = event;
    this.taskChange.priority = this.priorityService.getIconPriority(event);

  }

  upload(event: Event) {
    this.fileUploaded = true;
    
    this.fileService.uploadFile(event);

    this.Files = this.fileService.selectedFiles;
   
  }

  async alertBox() {
    // const { value: accept } = await Swal.fire({
    //   title: 'Are you working on this task?',
    //   inputPlaceholder: 'Yes, sir.',
    //   input: 'checkbox',
    //   inputValue: 1,
    //   confirmButtonText:
    //     'Continue <i class="fa fa-arrow-right"></i>',
      
    // })
    
    // if (accept) {
    //   this.data.task.label = 1;
    // }
    // else {
    //   this.data.task.label = 0;
    // }

    // console.log(this.data.task.label);
    
  } 

  todoClick(label: any) {    
    label = 0;

    this.taskChange.label = 0;
    console.log(label);
    this.taskColor = 0;
  }

  onProgressClick(label: any) {
    label = 1;

    this.taskChange.label = 1;
    console.log(label);
    this.taskColor = 1;

  }

  doneClick(label: any) {
    label = 2;
    this.taskChange.label = 2;
    console.log(label);
    this.taskColor = 2;

  }

  // controlIsDone(e : any) {
  //   this.isDone = true;
  //   this.taskChange.label = 2;
  //   console.log(this.taskChange);
  // }


  getUserProfileImage(x: any){
    return "../../assets/user (1).png"
  }

  

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  updateTask() {    
    if (JSON.stringify(this.data.task) != JSON.stringify(this.taskChange)){
      console.log("different");
      this.taskService.updateTask(this.taskChange).subscribe((res) =>{
        if(res.isSuccessful == true){
          // alert("YES!")
        }
      } )
    } else {
      console.log("same");
      
    }
    

  }

  deleteTask() {
    debugger
    this.taskService.deleteTask(this.taskId).subscribe((res)=> {
      this.closeDialog()
    })
    
  }
  

 

  editOpen(id: number){
    return true;
  }

  getTaskComments(){
    this.commentService.GetTaskComments(this.taskId).subscribe((res) => {
      if(res.isSuccessful == true){
        this.comments = res.data;
        console.log(res.data);
    
      }
    })
  }

  checkIfCommentAdded() {
    if(this.commentReq.comment != null) {
      this.commentWantsToGetCreated = true;
    }
    else {
      this.commentWantsToGetCreated = false;
    }
  }

  submitComment() {
    if (this.createComment.trim() !== '') {
      this.commentReq.comment = this.createComment;
      this.commentService.CreateComment(this.commentReq).subscribe((res) => {
        if(res.isSuccessful == true){  
          this.getTaskComments();       
          this.createComment = '';
        }
      })
      
    }
  }

  editComment(id: number, comment: string){
    console.log(comment);
    this.commentReq.id = id;
    this.commentReq.comment = comment; //alınan yeni input
    this.commentService.UpdateComment({'id': this.commentReq.id, 'comment': this.commentReq.comment}).subscribe((res) => { //değiştirdim 24.08.2023
      if(res.isSuccessful){
        this.getTaskComments();
      }
    })
  }
  

  deleteComment(id: number){
    this.commentService.DeleteComment(id).subscribe((res) => {
      if(res.isSuccessful == true){
        this.getTaskComments();
      }
    })

  }
 
  
  closeDialog() {
    this.taskColor = this.taskChange.label  
    this.dialogRef.close();
    this.updateTask();
  }
  // config: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: false,
  //   height: '12rem',
  //   minHeight: '5rem',
  //   placeholder: 'Enter text here...',
  //   translate: 'no',
  //   defaultParagraphSeparator: 'p',
  //   defaultFontName: "'Kanit', sans-serif"

  // };

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

}

function isEqual(task: Task, taskChange: Task) {
  throw new Error('Function not implemented.');
}

