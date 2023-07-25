import { Component, SimpleChanges } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { ProjectDto } from 'src/app/interfaces/project';
import { ProjectService } from 'src/app/services';
import { ColumnService } from 'src/app/services/column.service';
import { TranslocoService} from '@ngneat/transloco';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  
  columns: ColumnTask[];
  projectId: number = 1;
  project : ProjectDto ;

  constructor(
    private columnService : ColumnService, 
    public projectService: ProjectService,
    public translocoService : TranslocoService) {}
  
  ngOnInit(): void {

    this.project = this.projectService?.getProjectLocal();
    if(this.project != null){
      this.columnService.GetProjectColumnsTasks({"id": this.project.id}).subscribe((response) => {
        if(response.data != null){
          this.columns = response.data;
        }
      });
    }   
  }

  
}
