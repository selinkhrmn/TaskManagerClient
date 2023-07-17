import { Component, SimpleChanges } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { ColumnService } from 'src/app/services/column.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  
  columns: ColumnTask[];
  projectId: number = 1;

  constructor(private columnService : ColumnService) {}
  
  ngOnInit(): void {
    this.columnService.GetProjectColumnsTasks({"projectId": this.projectId}).subscribe((response) => {
      if(response.data != null){
        this.columns = response.data;
        console.log(this.columns);
        
      }
    });
       
  }

  
}
