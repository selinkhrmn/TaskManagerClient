import { Component } from '@angular/core';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-sidenav2',
  templateUrl: './sidenav2.component.html',
  styleUrls: ['./sidenav2.component.scss']
})
export class Sidenav2Component {
  projectNames : Project[] = [];
  constructor(  public projectService: ProjectService) {
this.getAllProjects()
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projectNames = response.data;
      }
    });
  }

}
