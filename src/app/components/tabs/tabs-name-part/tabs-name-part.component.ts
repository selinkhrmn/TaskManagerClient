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
  constructor(private tabs : TabsComponent,private router: Router, private columnService : ColumnService
    ,private projectService : ProjectService) { 
  
  }

  project = this.projectService.getProjectLocal()
  toSummary() {
    this.router.navigate(['summary']);
  }

  GetProjectColumns() {
    this.columnService.GetAllProjectColumns({"projectId": this.project.id})
    .subscribe(response => {
     console.log(response.data[0].name);
    })
    
        
  }
}
