import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Project } from 'src/app/interfaces';
import { ProjectDto } from 'src/app/interfaces/project';
import { Task } from 'src/app/interfaces/task';
import { taskDto } from 'src/app/interfaces/taskDto';
import { ProjectService, TaskService } from 'src/app/services';
import { TranslocoService} from '@ngneat/transloco';
import { ListTask } from 'src/app/interfaces/listTask';



@Component({
  selector: 'app-task-setting-page',
  templateUrl: './task-setting-page.component.html',
  styleUrls: ['./task-setting-page.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule]
})


export class TaskSettingPageComponent implements AfterViewInit, OnInit {
  currentProject : ProjectDto;
  projectName: string;

  displayedColumns: string[] = ['id', 'projectName', 'name', 'status'];
  dataSource: MatTableDataSource<Task>;
  tasks : Task[] = [];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  

  constructor(
    private taskService : TaskService,
    private projectService : ProjectService,
    public translocoService : TranslocoService
  ) {
    
    
  }

  ngOnInit() : void{
    this.currentProject = this.projectService.getCurrentProject();
   
    this.taskService.getAllProjectTask({"id" : this.currentProject.id}).subscribe((res)=>
    {
      if( res.data != null) {
             this.tasks = res.data; 
      }

   
   
      this.dataSource = new MatTableDataSource<Task>(this.tasks);
     

      
      
      
    });
    this.projectName = this.currentProject.name;
    
    

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
}

