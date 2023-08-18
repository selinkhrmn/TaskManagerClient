import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPeopleToProjectComponent } from '../../create-project/add-people-to-project/add-people-to-project.component';
import { AddUserToProjectComponent } from '../../add-user-to-project/add-user-to-project.component';
import { AddUsersToProjectComponent } from './add-users-to-project/add-users-to-project.component';
import { ProjectService } from 'src/app/services';
import { Project } from 'src/app/interfaces';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProjectDto } from 'src/app/interfaces/project';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectComponent } from '../../project/project.component';
@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  project: any;
  projects : Project[] = [];
  // dataSource : MatTableDataSource<ProjectDto>;
  // displayedColumns: string[] = ['Name','CreatedDate', 'ProjectDate'];
  constructor(public dialog: MatDialog,private projectService: ProjectService) { }


  displayedColumns: string[] = ['name', 'createdDate', 'projectDate'];
  dataSource = new MatTableDataSource<ProjectDto>(this.projects);

  // dataSource: MatTableDataSource<ProjectDto> = null;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchProjects();
            // this.dataSource = new MatTableDataSource<ProjectDto>(this.projects);

      }
      fetchProjects() {
        this.projectService.getAllProjects().subscribe(
          (response) => {
            if (response.data != null) {
              this.projects = response.data;
              this.dataSource.data = this.projects;
            }
          },
          (error) => {
            console.error('Error fetching projects:', error);
          }
        );
      }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddUsersToProjectComponent,{height: '90%',width: '50%', panelClass: 'dialog'});
  }

 getProjectDate(createdDate: Date){
  const millisecondsPerDay = 24 * 60 * 60 * 1000; 
  const timeDifference = new Date().valueOf() - new Date(createdDate).valueOf();
  return Math.abs(Math.floor(timeDifference / millisecondsPerDay));
}

  getProject(id : Partial<Project>) {
    this.projectService.getProject(id).subscribe((res) => {
      console.log(res);
    })
  }

  openProjectDialog(id: number){
    this.projectService.getProject({id}).subscribe((res)=>{
      const dialogS = this.dialog.open(ProjectComponent, {data: {project:res.data},width : '60%'});
      dialogS.afterClosed().subscribe(()=> {
        window.location.reload();
      })
    })
  }
}
