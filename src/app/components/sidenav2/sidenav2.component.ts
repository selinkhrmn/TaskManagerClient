import { Component } from '@angular/core';
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
export class Sidenav2Component {
  projectNames : Project[] = [];
  constructor(  
    public projectService: ProjectService, private router: Router, public dialog: MatDialog) {
this.getAllProjects()
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projectNames = response.data;
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
