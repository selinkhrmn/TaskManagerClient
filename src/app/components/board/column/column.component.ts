import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TaskService } from 'src/app/services/task.service';
import { Column } from 'src/app/interfaces/column';
@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent {

  tasks : Task[] = [];
  

  constructor(private taskService : TaskService) {

  }

  ngOnInit(): void {
    //Get all task metodu backend de yazılacak ordan buraya entegre edilecek
    // this.taskService.getAllTasks().subscribe((response) => {
    //   if(response.data != null){
    //     this.tasks = response.data;
    //   }
    //   debugger;
    // });
       
  }


  

  todo : Column[] = [
    
  ];

  done  : Column[] = [
   
  ];

  InProgress  : Column[] = [
    
  ];

  drop(event: CdkDragDrop<Column[]>) {
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
