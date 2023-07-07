import { Component } from '@angular/core';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  projectId: number;
  constructor(public projectService: ProjectService) {
  }

  ngOnInit(){

  }

  deleteProject() {
    this.projectService.deleteProject({id: this.projectId}).subscribe(() => {
      this.ngOnInit();
    });
  }
}
