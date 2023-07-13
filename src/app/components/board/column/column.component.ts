import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TaskService } from 'src/app/services/task.service';
import { Column } from 'src/app/interfaces/column';
import { ColumnService } from 'src/app/services/column.service';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { taskDto } from 'src/app/interfaces/taskDto';
import { ProjectService } from 'src/app/services';
import { Router } from '@angular/router';
import { CreateProjectComponent } from '../../create-project/create-project.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from '../../task/task.component';
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
    private columnService: ColumnService, private projectService : ProjectService, private router : Router,public dialog: MatDialog) {

  }

  ngOnInit(): void {
    const project = this.projectService.getProjectLocal();
    //Get all task metodu backend de yazılacak ordan buraya entegre edilecek
    // this.taskService.getAllTasks().subscribe((response) => {
    //   if(response.data != null){
    //     this.tasks = response.data;
    //   }
    //   debugger;
    // });

    
    this.columnService.GetProjectColumnsTasks({"projectId": project.id}).subscribe((response) => {
      if(response.data != null){
        this.columns = response.data;
      }
      console.log(this.columns);
      
      this.todo = this.columns[0].tasks;
      this.InProgress = this.columns[1].tasks;
      this.done = this.columns[2].tasks
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

  openDialog(tId: number) { 
    this.taskService.getTask({"id" : tId}).subscribe((res)=> {
      this.tasks = res.data;
      const dialogRef = this.dialog.open(TaskComponent,{data: {task: this.tasks}, height: '80%',width: '90%', panelClass: 'dialog'});
     })
    
    

    
  } 

}
