import { Component } from '@angular/core';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent {

  constructor(private projectService : ProjectService) {}

  getProjectLocal() {
    this.projectService.getProjectLocal();
  }
}
