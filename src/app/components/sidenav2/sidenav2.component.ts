import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { TokenService } from 'src/app/services/token.service';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-sidenav2',
  templateUrl: './sidenav2.component.html',
  styleUrls: ['./sidenav2.component.scss']
})

export class Sidenav2Component implements OnInit{
  projects : Project[] = [];
  selectedProject: Project;
  currentProject: Project;
  theProject: string;
  constructor(  
    public projectService: ProjectService, 
    private router: Router, 
    public dialog: MatDialog,
    public tokenService: TokenService,
    public translocoService : TranslocoService) { }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
        if(this.projectService.getProjectLocal() == null && this.projects.length > 0){
          this.projectService.setCurrentProject(this.projects[0]);
        }
      }
      
    });
    let project = this.projectService.getCurrentProject();          
    this.theProject = project.name;
    console.log(this.theProject);
    
  }


  selectProject(selectProject: Project){
    this.selectedProject = selectProject;
    this.projectService.setCurrentProject(selectProject);
    location.reload()
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

  reload() {
    window.location.reload();
  }

}
