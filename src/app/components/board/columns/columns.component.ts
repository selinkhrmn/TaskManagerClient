import {
  Component,
  ElementRef,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  copyArrayItem,
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
import { ProjectService } from 'src/app/services';
import { EditColumnComponent } from '../edit-column/edit-column.component';
@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnsComponent {

  tasks : Task[] = [];
  
  columns: ColumnTask[] = [];
  columnGet: ColumnTask;

  allTasks: taskDto[] = [];

  todo : taskDto[] = [];

  done  : taskDto[] = [];

  InProgress  : taskDto[] = [];

  currentProjectId : number;
  columnName : string;
  updatedColumnName : string;

  @Output() currentColumnId: number;

  showFiller = false;
  panelOpenState = false;

  constructor(private columnService : ColumnService, private taskService: TaskService,public dialog: MatDialog, private projectService : ProjectService) {
     
  }
  ngOnInit(): void {        
    const currentProject = this.projectService.getCurrentProject();

    this.columnService.GetProjectColumnsTasks({"projectId": currentProject.id}).subscribe((response) => {
      if(response.data != null){
        this.columns = response.data;
      }
      console.log(this.columns);
    });
    this.getProjectLocal()
  }

  drop(event: CdkDragDrop<taskDto[]>, column: ColumnTask) {
    console.log(this.columns);
    
    console.log(column.id);
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
     
      this.taskService.updateTaskColumnId({"id": event.container.data[0].id, "columnId": column.id}).subscribe((res) => {
        console.log(res.data);
        console.log(res.message);
      console.log(event);
      
        
        
      });
    }

    
  }

  getColumnId(columnId: number) {
    this.currentColumnId = columnId;
    console.log('Column ID:', this.currentColumnId);
  }

  openEditDialog(columnName : string) {
    console.log(columnName);
    
    const dialogRef = this.dialog.open(EditColumnComponent,{data: columnName});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  openDialog(tId: number) { 
    this.taskService.getTask({"id" : tId}).subscribe((res)=> {
      this.tasks = res.data;
      const dialogRef = this.dialog.open(TaskComponent,{data: {task: this.tasks}, height: '80%',width: '90%', panelClass: 'dialog'});
     })
  } 

  // GetAllProjectColumns() {
  //   return this.columnService.GetAllProjectColumns({'projectId':  this.currentProjectId}).subscribe((res) => {
  //     this.columnId = res.data[0].id
  //     console.log(this.columnId);
      
  //   })
  // }

  getProjectLocal() {
    const currentProjectId =  this.projectService.getProjectLocal();
    return this.currentProjectId = currentProjectId.id;
  }

  createColumn() {
    this.getProjectLocal();
    this.columnService.CreateColumn({'projectId' : this.currentProjectId, 'name': this.columnName}).subscribe((res)=> {
      
  })}

  DeleteColumn() {
    return this.columnService.DeleteColumn({'id': this.currentColumnId}).subscribe((res) => {

    })
  }

  UpdateColumn() {
    this.getProjectLocal();
    this.columnService.UpdateColumn({'projectId' : this.currentProjectId, 'name': this.updatedColumnName}).subscribe((res) => {

    })
  }
}
