import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { Task } from 'src/app/interfaces/task';
import { User, UserDto } from 'src/app/interfaces/user';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { CreateIssueDialogComponent } from '../../create-issue-dialog/create-issue-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListTask } from 'src/app/interfaces/listTask';
import { TaskUserDto } from 'src/app/interfaces/taskDto';
import { TaskComponent } from '../../task/task.component';
import { PriorityService } from 'src/app/services/priority.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.scss']
})
export class AdminTasksComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<Task>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentProject: ProjectDto;
  projectName: string;
  projects: Project[] = [];
  taskArray: Task[] = [];
  project: ProjectDto;
  // projectId: number;
  task: Task[] = [];
  userList: UserDto[] = [];
  priorities: string[] = [];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    public translocoService: TranslocoService,
    public userService: UserService,
    public tokenService: TokenService,
    public router: Router,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
    public priorityService: PriorityService
  ) { }

  displayedColumns: string[] = ['projectId', 'name', 'assignee', 'priority'];
  dataSource = new MatTableDataSource<TaskUserDto>(this.task);

  id: any;

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchTasks()
  }


  fetchTasks(){
    this.taskService.GetAllTaskForUser({ "id": this.tokenService.getTokenId() }).subscribe((response) => {
      if (response.isSuccessful) {
        this.taskArray = response.data;
        this.dataSource = new MatTableDataSource<TaskUserDto>(this.taskArray);
        this.dataSource.paginator = this.paginator;
      }

       this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }
      this.priorities = this.priorityService.getOptions();
    })
    });

   
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateIssueDialog() {
    const dialog = this.dialog.open(CreateIssueDialogComponent, { data: { table: this.table }, width: '60%' });
    dialog.afterClosed().subscribe((response) => {
      if (response.isAdded) {
        this.taskService.createTask(response.task).subscribe((res) => {
          window.location.reload();
        })
      }
    });

  }

  // openTaskDialog(id: number) {
  //   this.taskService.getTaskById(id).subscribe((res) => {
  //     this.taskArray = res.data;

openTaskDialog(id : number) {
 this.taskService.getTaskById(id).subscribe((res) => {
  this.taskArray = res.data;
  
  
  const dialogS = this.dialog.open(TaskComponent, {data: {task: this.taskArray}, width : '60%'});
  dialogS.afterClosed().subscribe((res) => {
    window.location.reload();
  })
 })



  }
}
