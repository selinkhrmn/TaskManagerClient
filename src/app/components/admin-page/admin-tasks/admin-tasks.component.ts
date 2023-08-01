import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { Task } from 'src/app/interfaces/task';
import { User } from 'src/app/interfaces/user';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { CreateIssueDialogComponent } from '../../create-issue-dialog/create-issue-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.scss']
})
export class AdminTasksComponent implements OnInit{
  currentProject: ProjectDto;
  projectName: string;
  projects: Project[] = [];
  project : Project;
  projectId : number;

  displayedColumns: string[] = ['projectName', 'name', 'assign', 'status'];
  dataSource: MatTableDataSource<Task>;
  dataTask : MatTableDataSource<Task>;
  tasks: Task[] = [];
  role: string;
  username: string;
  taskArray : Task[] = [];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<Task>;



  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    public translocoService: TranslocoService,
    public userService: UserService,
    public tokenService: TokenService,
    public router : Router,
    private dialog : MatDialog,
    private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
  ) {


  }

  // ngOnInit(): void {
  //   debugger

  //   const role = this.tokenService.tokenRole();
  //   // let username = this.tokenService.tokenUsername();
  //   const tokenRole = this.tokenService.tokenRole();
  //   const token = this.tokenService.decodeToken();


  //   this.projectService.getAllProjects().subscribe((res) => {
  //     if (res.data != null && tokenRole) {
  //       this.projects = res.data;
  //     }
  //     this.projects.forEach((project) => {
  //       const projeId =  project.id; 
  //       this.taskArray = [];
  //       this.taskService.getAllProjectTask({"id" : projeId}).subscribe((res) => {
  //         if(res.data != null ) {
  //           this.tasks = res.data;
            
  //         }
  //         this.taskArray = this.tasks;
  //         console.log(this.taskArray);
          
  //       })

  //       this.dataTask = new MatTableDataSource<Task>(this.taskArray);
        
  //     })
     
      


    
      





  //   });




  // }

  ngOnInit() : void {
    
    this.projectService.getAllProjects().subscribe((res)=> {
      if(res.data != null) {
        this.projects = res.data;

      }
      this.projects.forEach(element => {
        this.projectId = element.id;
      });
      

      this.taskService.getAllProjectTask({"id" : this.projectId}).subscribe((res)=>
    {
      
      if( res.data != null) {
        res.data.forEach(element => {
          // this.tasks.push(element);
        });
             console.log(this.tasks);
             
      }

      // console.log(this.tasks);
      
      this.dataSource = new MatTableDataSource<Task>(this.tasks);
      // console.log(this.dataSource);

      
      
      
    });
    
      
    }); 
    this.projectName = this.projectService.getCurrentProject().name;
  }


  ngAfterViewInit() {
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
    const dialog = this.dialog.open(CreateIssueDialogComponent, {data : {table : this.table},width:'60%'});
    dialog.afterClosed().subscribe((response) => {
      if(response.isAdded) {
        this.taskService.createTask(response.task).subscribe((res)=>{
            window.location.reload();
        })
      }
    });
    
    
  }
}
