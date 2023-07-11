import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TaskService } from 'src/app/services/task.service';
import { Column } from 'src/app/interfaces/column';
import { ColumnService } from 'src/app/services/column.service';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { taskDto } from 'src/app/interfaces/taskDto';
@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent {

  tasks : Task[] = [];
  columns: ColumnTask[] = [];

  
  todo : taskDto[] = [];

  done  : taskDto[] = [];

  InProgress  : taskDto[] = [];

  constructor(private taskService : TaskService,
    private columnService: ColumnService) {

  }

  ngOnInit(): void {
    //Get all task metodu backend de yazılacak ordan buraya entegre edilecek
    // this.taskService.getAllTasks().subscribe((response) => {
    //   if(response.data != null){
    //     this.tasks = response.data;
    //   }
    //   debugger;
    // });

    this.columnService.GetProjectColumnsTasks({"projectId": 1}).subscribe((response) => {
      if(response.data != null){
        this.columns = response.data;
      }
      this.todo = this.columns[0].tasks;
      this.InProgress = this.columns[1].tasks;
    });
       
  }

  drop(event: CdkDragDrop<taskDto[]>) {
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

  createTask(){
    //DB den çekilecek tüm taskler
    this.taskService.createTask({name : this.InProgress[0].name}).subscribe(() => {
      this.ngOnInit();
    });
    // console.log(this.projectName);
  }


}
