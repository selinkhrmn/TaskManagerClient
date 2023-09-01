import { Component } from '@angular/core';
import { TabsComponent } from '../tabs.component';
import { Router } from '@angular/router';
import { ColumnService } from 'src/app/services/column.service';
import { ProjectService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { TranslocoService} from '@ngneat/transloco';
import { RouterLinkActive } from '@angular/router';

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
    private projectService: ProjectService,
    public tokenService: TokenService,
    public translocoService: TranslocoService
  ) {}


  toSummary() {
    this.router.navigate(['summary']);
  }

  //project = this.projectService.getProjectLocal();


  toCalendar() {
    this.router.navigate(['calendar']);
  }

  //  GetProjectColumns() {
  //   this.columnService.GetAllProjectColumns({ "id": this.project.id }).subscribe(response => {
  //       // Handle the response as needed
  //     });
  //  }
}
