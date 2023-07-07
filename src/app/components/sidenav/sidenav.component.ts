import { Component } from '@angular/core';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  showFiller = false;
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
