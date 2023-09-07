import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { Sidenav2Component } from '../sidenav2/sidenav2.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { TokenService } from 'src/app/services/token.service';
import { TranslocoService} from '@ngneat/transloco';
import Swal from 'sweetalert2';
import { ProjectDto } from 'src/app/interfaces/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers:[Sidenav2Component]
})
export class ProjectDetailsComponent {

  projectId: number;
  currentProject: Partial<Project>;
  currentProjectName : string;
  projects: Project[] = []
  constructor(
    public projectService: ProjectService,
    private sideNav: Sidenav2Component,
    private homePageComponent: HomepageComponent,
    public tokenService: TokenService,
    public translocoService: TranslocoService) {
  }

  ngOnInit() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
      this.currentProjectName = value.name;
    });
    this.currentProjectName = this.projectService.getCurrentProject().name;
    this.projectId = this.projectService.getCurrentProject().id
  }

  // public getAllProjectsFrom(): void {
  //   this.sideNav.getAllProjectsFrom();
  // }

  deleteProject() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

      if (result.isConfirmed) {
        this.projectService.deleteProject( this.projectId ).subscribe((res) => {
        });
        this.projectService.getAllProjects().subscribe((res) => {
          console.log(res);
          
         if(res.isSuccessful) {
          this.projects = res.data;
  
          const lowest = this.projects.reduce((lowest, current) => {
            if (current.id !== this.projectId && (lowest === null || current.id < lowest.id)) {
              return current;
            } else {
              return lowest;
            }
          }, null);
  
          if (lowest !== null) {
            this.projectService.setCurrentProject(lowest);
          }
  
          location.reload();
         }
         
        })
      }
    })
    
  }

  saveProjectDetails(){
    let storage = JSON.parse(localStorage.getItem("current-project") ?? "");
    const model = {
      Id: storage.id,
      Name: this.currentProjectName
    }
    this.projectService.updateProject(model).subscribe((res) => {
      this.projectService.setCurrentProject(res.data);
      this.updateProject();
    })
  }

  updateProject(){
    // let data = localStorage.getItem('current-project');
    // this.currentProject = data ? JSON.parse(data) : null;
    // this.projectService.updateProject({"id": this.currentProject.id, "name": this.currentProjectName}).subscribe((res) => {
    //   this.projectService.setCurrentProject(res.data);
    //   this.getAllProjectsFrom();
    //   this.ngOnInit();
    // })
    //this.sideNav.updateProject();
    //this.homePageComponent.updateProject();
  }
}
