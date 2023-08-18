import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Project } from 'src/app/interfaces';
import { ProjectDto } from 'src/app/interfaces/project';
import { Task } from 'src/app/interfaces/task';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { ColumnService, ProjectService, TaskService } from 'src/app/services';
import { TranslocoService} from '@ngneat/transloco';
import { ListTask } from 'src/app/interfaces/listTask';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';




@Component({
  selector: 'app-task-setting-page',
  templateUrl: './task-setting-page.component.html',
  styleUrls: ['./task-setting-page.component.scss']
})


export class TaskSettingPageComponent implements AfterViewInit, OnInit {
  currentProject : ProjectDto;
  projectName: string;

  displayedColumns: string[] = ['name','projectName', 'columnId', 'reporter', 'status'];
  dataSource: MatTableDataSource<any>;
  tasks : ListTask[] = [];
  columnList : ColumnDto[] = [];
  userList : UserDto[] = [];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  

  constructor(
    private taskService : TaskService,
    private projectService : ProjectService,
    public translocoService : TranslocoService,
    private userService : UserService,
    private columnService : ColumnService
  ) {
    
    
  }

  ngOnInit() : void{
    this.currentProject = this.projectService.getProjectLocal();
   
    this.taskService.getAllProjectTask({"id" : this.currentProject.id}).subscribe((res)=>
    {
      if( res.data != null) {
             this.tasks = res.data; 
             
             
      }

      this.dataSource = new MatTableDataSource<any>(this.tasks);
 
    });
    
    this.projectName = this.currentProject.name;
    
    this.columnService.GetAllProjectColumns({"id" : this.currentProject.id}).subscribe(data => {
      if(data.isSuccessful) {
        this.columnList = data.data;
      }
      
    });

    this.userService.getAllUsers().subscribe(data => {
      if(data.isSuccessful) { 
        this.userList = data.data;
      }

    })

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    const columnNAME = value.trim().toLowerCase();
    

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

