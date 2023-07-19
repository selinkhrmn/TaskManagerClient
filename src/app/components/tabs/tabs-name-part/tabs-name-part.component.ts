import { Component } from '@angular/core';
import { TabsComponent } from '../tabs.component';
import { Router } from '@angular/router';
import { ColumnService } from 'src/app/services/column.service';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-tabs-name-part',
  templateUrl: './tabs-name-part.component.html',
  styleUrls: ['./tabs-name-part.component.scss']
})
export class TabsNamePartComponent {
  project = this.projectService.getProjectLocal(); // Declare project here

  constructor(
    private tabs: TabsComponent,
    private router: Router,
    private columnService: ColumnService,
    private projectService: ProjectService
  ) {}

  toSummary() {
    this.router.navigate(['summary']);
  }

  toCalendar() {
    this.router.navigate(['calendar']);
  }

  GetProjectColumns() {
    this.columnService
      .GetAllProjectColumns({ projectId: this.project.id })
      .subscribe(response => {
        // Handle the response as needed
      });
  }
}
