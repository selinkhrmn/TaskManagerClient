import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { Sidenav2Component } from '../sidenav2/sidenav2.component';

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
  constructor(
    public projectService: ProjectService,
    private sideNav: Sidenav2Component) {
  }

  ngOnInit() {
    this.projectService.selectedProject$?.subscribe((value) => {
      this.currentProject = value;
      this.currentProjectName = value.name;
    });
    this.currentProjectName = this.projectService.getCurrentProject().name;
  }

  // public getAllProjectsFrom(): void {
  //   this.sideNav.getAllProjectsFrom();
  // }

  deleteProject() {
    this.projectService.deleteProject({ id: this.projectId }).subscribe(() => {
      this.ngOnInit();
    });
  }

  updateProject(){
    // let data = localStorage.getItem('current-project');
    // this.currentProject = data ? JSON.parse(data) : null;
    // this.projectService.updateProject({"id": this.currentProject.id, "name": this.currentProjectName}).subscribe((res) => {
    //   this.projectService.setCurrentProject(res.data);
    //   this.getAllProjectsFrom();
    //   this.ngOnInit();
    // })
    this.sideNav.updateProject(this.currentProjectName);
  }
}
