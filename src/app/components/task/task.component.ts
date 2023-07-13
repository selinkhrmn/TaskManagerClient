import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/task';
import { taskDto } from 'src/app/interfaces/taskDto';
import { TaskService } from 'src/app/services/task.service';

interface DialogData{
  task: Task;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})


export class TaskComponent  {
  taskName: string = this.data.task.name;
  taskId: number =this.data.task.id;
  taskProjectId: number = this.data.task.projectId
  task : Task[] ;

  constructor(
    private taskService : TaskService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
      ) {
    
  }

}
