import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { CreateProjectComponent } from '../create-project/create-project.component';

@Component({
  selector: 'app-sidenav2',
  templateUrl: './sidenav2.component.html',
  styleUrls: ['./sidenav2.component.scss']
})

export class Sidenav2Component implements OnInit{
  projects : Project[] = [];
  selectedProject: Project;
  currentProject: Project;

  constructor(  
    public projectService: ProjectService, 
    private router: Router, 
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
      }
    });
  }

  ngOnChanges(changes : SimpleChanges) {
    console.log(changes);
    
  }

  selectProject(selectProject: Project){
    this.selectedProject = selectProject;
    this.projectService.setCurrentProject(selectProject);
  }

  public updateProject(currentProjectName: string){
    let data = localStorage.getItem('current-project');
    this.currentProject = data ? JSON.parse(data) : null;
    this.projectService.updateProject({"id": this.currentProject.id, "name": currentProjectName}).subscribe((res) => {
      this.projectService.setCurrentProject(res.data);
      this.ngOnInit();
    })
  }

  public getAllProjectsFrom(){
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
        this.ngOnInit();
        alert("done");
      }
    });
  }

  toAddProject() {
    this.router.navigate(['create-project'])
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectComponent,{height: '95.5%',width: '80%', panelClass: 'dialog'});
  }
  
}
