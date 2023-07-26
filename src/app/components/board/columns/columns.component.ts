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
import { columnDto } from 'src/app/interfaces/columnDto';
import { ProjectDto } from 'src/app/interfaces/project';
import { TranslocoService} from '@ngneat/transloco';
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
  currentProject:  ProjectDto;

  @Output() currentColumnId: number;

  showFiller = false;
  panelOpenState = false;

  constructor(
    private columnService : ColumnService, 
    private taskService: TaskService,
    public dialog: MatDialog, 
    private projectService : ProjectService,
    public translocoService: TranslocoService) {
     
  }

  ngOnInit(): void {  
   
    this.currentProject = this.projectService.getProjectLocal();
    if(this.currentProject != null){
      this.columnService.GetProjectColumnsTasks({"id": this.currentProject.id}).subscribe((response) => {
        if(response.data != null){
          this.columns = response.data;
        }
      });
    }
  }

  drop(event: CdkDragDrop<taskDto[]>, column: ColumnTask) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
     
      this.taskService.updateTaskColumnId({"id": event.container.data[event.currentIndex].id, "columnId": column.id}).subscribe((res) => {
    
      });
    }
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    console.log(event);
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
        
      };
    }
  
  

  getColumnId(columnId: number) {
    this.currentColumnId = columnId;
    console.log('Column ID:', this.currentColumnId);
  }

  openEditDialog(columnName : string, currentColumnId: number) {
    const dialogRef = this.dialog.open(EditColumnComponent,{data: {data: columnName, currentColumnId: currentColumnId} });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit()
    });
  }
  
  openTaskDialog(tId: number) { 
    this.taskService.getTaskById({"id" : tId}).subscribe((res)=> {
      if(res.isSuccessful == true){
        this.tasks = res.data;
        const dialog = this.dialog.open(TaskComponent,{data: {task: this.tasks}, height: '80%',width: '90%', panelClass: 'dialog'});
        dialog.afterClosed().subscribe((res)=> {
          this.ngOnInit();
         })
      }
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
    this.ngOnInit()
  })}

  DeleteColumn() {
    return this.columnService.DeleteColumn({'id': this.currentColumnId}).subscribe((res) => {
      this.ngOnInit()
    })
}
}

//?
