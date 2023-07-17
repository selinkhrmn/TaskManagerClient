import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Task } from 'src/app/interfaces/task';
import { taskDto } from 'src/app/interfaces/taskDto';
import { ColumnService } from 'src/app/services/column.service';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { TaskService } from 'src/app/services/task.service';
import { TaskComponent } from '../../task/task.component';
import { MatDialog } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnsComponent {

  tasks : Task[] = [];
  
  columns: ColumnTask[] = [];

  allTasks: taskDto[] = [];

  todo : taskDto[] = [];

  done  : taskDto[] = [];

  InProgress  : taskDto[] = [];

  projectService: any;

  constructor(private columnService : ColumnService, private taskService: TaskService,public dialog: MatDialog) {
     
  }
  ngOnInit(): void {        
    this.columnService.GetProjectColumnsTasks({"projectId": 1}).subscribe((response) => {
      if(response.data != null){
        this.columns = response.data;
      }
      console.log(this.columns[1].id);
      console.log(this.columns);
    });

  }
  drop(event: CdkDragDrop<taskDto[]>) {
    console.log(this.columns);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  
  openDialog(tId: number) { 
    this.taskService.getTask({"id" : tId}).subscribe((res)=> {
      this.tasks = res.data;
      const dialogRef = this.dialog.open(TaskComponent,{data: {task: this.tasks}, height: '80%',width: '90%', panelClass: 'dialog'});
     })
    
    

    
  } 
}
