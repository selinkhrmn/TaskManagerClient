import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { UserDto, UserProfilPhoto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { PriorityService } from 'src/app/services/priority.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { LogDto } from 'src/app/interfaces/logDto';
import { MatPaginator } from '@angular/material/paginator';

interface DialogData {
  task: Task;
  file : FormData
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @ViewChild('wrapper') wrapperElement!: ElementRef<HTMLElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  taskName: string = this.data.task.name;
  taskId: number = this.data.task.id;
  taskProjectId: number = this.data.task.projectId;
  isDone: boolean = false;
  isWorking: boolean = false;
  taskChange: Task = JSON.parse(JSON.stringify(this.data.task));
  taskChangeFile : FormData = this.data.file;
  taskDueDate = new FormControl(this.taskChange.endDate);
  taskDueDateValue: Date = this.taskDueDate.value;
  taskUpdatedDate = new FormControl(this.taskChange.updatedDate);
  taskC = new FormControl(this.taskChange.createdDate);
  editorContent: string;
  descriptionText: string = '';
  Files: FileData[];
  fileUploaded: boolean = false;
  addSubtopicClicked = false;
  commentWantsToGetCreated: boolean;
  commentWantsToBeEdited: boolean;
  commentBeingEditedId: number = -1;
  fileIcons: { [extension: string]: string } = {
    jpg: '../../../assets/hosgeldiniz.png',
    png: '../../../assets/hosgeldiniz.png',
    // pptx: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/.pptx_icon_%282019%29.svg',
    docx: 'path-to-docx-icon',
    pdf: 'path-to-pdf-icon',
  };
  commentReq: CommentRequest = {
    id: this.taskId,
    comment: '',
  };
  comments: Comment[] = [];
  userList: UserDto[] = [];
  createComment: string;
  priorities: string[] = [];
  users: ProjectUserDto[] = [];
  selectedDate: Date;
  isInputDisabled: boolean = false;
  taskColor: number;
  updatedComment: string;
  emptyCheck: boolean;
  dateChangeCheck: boolean = false;

  public sortableElement: any;
  public selectedUser: string = this.data.task.reporterId;
  imageUrl: string[] = [];
  uploadFile: File | null;
  uploadFileLabel: string | undefined = 'Choose an image to upload';
  uploadProgress: number;
  uploadUrl: string;
  images: any[] = [];
  formData = new FormData();
  url: string;
  openCloseLog: boolean;
  id = this.tokenService.getTokenId();

  logTable: LogDto[] = [];

  usersProfiles: UserProfilPhoto[] = [];
  noImage = '../../assets/noImage.png';
  FileLabel: string[] = [];

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
    public logService: LogService
  ) { }

  displayedColumns: string[] = [
    'fieldName',
    'oldValue',
    'newValue',
    'actionDate',
    'userId'
  ];
  dataSource = new MatTableDataSource<LogDto>(this.logTable);



  ngOnInit() {
    
    
    this.getTaskLogs();
    const minDate = new Date('2000-01-01T00:00:00');
    if (new Date(this.data.task.endDate).getTime() < minDate.getTime()) {
      this.dateChangeCheck = false;
    } else {
      this.dateChangeCheck = true;
    }

    if (this.taskChange.label == -1) {
      this.taskChange.label = 0;
      this.taskColor = 0;
    }
    console.log(this.taskChange.label);

    this.getTaskComments();
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }
    });

    this.userService.GetAllProjectUsers(this.projectService.getProjectLocal().id).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.users = res.data
        this.users.unshift({ id: 'unassigned', userId: 'unassigned', profileImageUrl: '../../assets/user.png' });
      }
    })

    //to get users profile
    this.fileService.GetFileForProjectUsers({ "projectId": this.projectService.getCurrentProject().id }).subscribe((res) => {
      this.usersProfiles = res;
    });

    this.priorities = this.priorityService.getOptions();
    this.sortableElement = this.priorityService.getIcon(this.data.task.priority, 'icon');

    this.taskColor = this.taskChange.label


    this.commentWantsToBeEdited = false;


    this.fileService.GetFileForTask(this.taskId).subscribe((res) => {
      this.imageUrl = res;

    });

  }

  ngOnDestroy() {
    this.updateTask();
  }

  closeSubmitAndCancelButtons() {
    this.commentWantsToGetCreated = false;
    this.createComment = '';
  }

  closeEditAndDeleteButtons(id: number, comment: string) {
    this.commentReq.id = id;
    this.commentReq.comment = comment;
    console.log(this.commentReq);

    this.commentWantsToBeEdited = true;
  }

  closeSaveAndCancelButtons() {
    this.commentWantsToBeEdited = false;
    this.commentBeingEditedId = -1;
    console.log(this.commentReq);
  }

  // GetCommentById() {
  //   this.commentService.GetCommentById(this.taskId).subscribe((res) => {
  //     console.log(res);

  //   })
  // }

  logChange($event: any) {
    console.log('Content changed:', $event);
  }

  selectUserForAssignee(userId: string) {
    this.taskChange.assigneeId = userId;
    this.updateTask();
  }
  selectUserForReporter(userId: string) {
    this.taskChange.reporterId = userId;
    this.updateTask();
  }

  setSortableElement(event: any) {
    this.sortableElement = event;
    this.taskChange.priority = this.priorityService.getIconPriority(event);
    this.updateTask();
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

  getProfilePhoto(id: string): string {
    const a = this.usersProfiles.find(u => u.userId == id)
    if (a) {
      if (a.path != null) {
        return a.path;
      }
    }
    return this.noImage;

  }

  onSave() {
    console.log('Description:', this.descriptionText);
    console.log('Selected Files:', this.Files);
  }

  changeDueDate() {
    const todaysDate = new Date();
    const minDate = new Date('2000-01-01T00:00:00');
    const taskDueDateValue = new Date(this.taskDueDate.value);

    if (taskDueDateValue < minDate) {
      Swal.fire({
        title: 'Would you like to change the due date',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(this.taskDueDate);

          this.dateChangeCheck = true;
          this.taskChange.endDate = new Date(todaysDate);
          this.taskDueDate = new FormControl(this.taskChange.endDate);
          //this.updateTask();
        } else {
          this.dateChangeCheck = false;
          this.taskChange.endDate = this.taskDueDateValue;
        }
      });
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    this.taskChange.endDate = event.value;
    console.log(this.taskDueDate);
    this.updateTask()

  }

  updateTask() {
    debugger
    console.log(this.dateChangeCheck);
if(this.images.length > 0) {
  this.fileService.saveFile(this.images,this.data.task.id).subscribe((res)=> {

  })
  
}

    if (JSON.stringify(this.data.task) != JSON.stringify(this.taskChange) ) {
      console.log('different');

      this.taskService.updateTask(this.taskChange).subscribe((res) => {
        if (res.isSuccessful == true) {
          // alert("YES!")
        }
      });
    } else {
      console.log('same');
    }
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId).subscribe((res) => {
      if (res.isSuccessful) {
        Swal.fire(
          'You succesfully deleted the task!',
          '',
          'success'
        ).then(() => {
          this.closeDialog();
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }

    });
  }

  editOpen(id: number) {
    return true;
  }

  getTaskComments() {
    this.commentService.GetTaskComments(this.taskId).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.comments = res.data;
        console.log(res.data);
      }
    });
  }

  checkIfCommentAdded() {
    if (this.commentReq.comment != null) {
      this.commentWantsToGetCreated = true;
    } else {
      this.commentWantsToGetCreated = false;
    }
  }

  submitComment() {
    if (this.createComment.trim() !== '') {
      this.commentReq.comment = this.createComment;
      this.commentService.CreateComment(this.commentReq).subscribe((res) => {
        if (res.isSuccessful == true) {
          this.getTaskComments();
          this.createComment = '';
        }
      });
    }
  }

  editComment(id: number, comment: string) {
    console.log(comment);
    this.commentBeingEditedId = id;
    this.commentReq.id = id;
    this.commentReq.comment = this.updatedComment; //alınan yeni input
    this.commentService
      .UpdateComment({
        id: this.commentReq.id,
        comment: this.commentReq.comment,
      })
      .subscribe((res) => {
        //değiştirdim 24.08.2023
        if (res.isSuccessful) {
          this.getTaskComments();
        }
      });
  }

  findEditComment(commentId: number) {
    console.log(this.comments);

    this.commentWantsToBeEdited = true;
    this.commentBeingEditedId = commentId;
  }

  deleteComment(id: number) {
    this.commentService.DeleteComment(id).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.getTaskComments();
      }
    });
  }

  closeDialog() {
    debugger
this.images.forEach(f=> {
  this.formData.append('file', f);
});

    console.log(this.taskColor);
    this.updateTask();
    this.taskColor = this.taskChange.label
    this.dialogRef.close({
      isAdded: true,
      file: this.formData
    });

  }

  getTaskLogs() {
    this.logService.getLogs('Task', this.data.task.id.toString()).subscribe((res) => {
      this.dataSource.data = res.data;
      this.dataSource.paginator = this.paginator;
    })
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


  openCloseLogFunc() {
    this.openCloseLog = !this.openCloseLog
  }

  handleFileInput(e : any) {
    
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
    if(x.length>0){
      x.forEach(f=> {
        this.images.push(f);
      });
    }
   
    
  }
}
