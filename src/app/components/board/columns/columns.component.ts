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
import { TaskDto } from 'src/app/interfaces/taskDto';
import { ColumnService } from 'src/app/services/column.service';
import { ColumnTask } from 'src/app/interfaces/columnTasks';
import { TaskService } from 'src/app/services/task.service';
import { TaskComponent } from '../../task/task.component';
import { MatDialog } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { ProjectService } from 'src/app/services';
import { EditColumnComponent } from '../edit-column/edit-column.component';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { ProjectDto } from 'src/app/interfaces/project';
import { TranslocoService } from '@ngneat/transloco';
import { TokenService } from 'src/app/services/token.service';
import { TransferColumnTaskComponent } from '../../transfer-column-task/transfer-column-task.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ColumnsComponent {
  predefinedColors: string[] = [
    '#FF5733', '#33FF57', '#5733FF', '#FF336A',
    '#33B4FF', '#FFD633', '#A633FF', '#33FFD6',
    '#FF33C1', '#33FFA6', '#E433FF', '#33E2FF',
    '#B333FF', '#33FFB4', '#FFA833', '#E633FF'
  ];
  @Output() currentColumnId: number;
  tasks: Task[] = [];
  columns: ColumnTask[] = [];
  columnGet: ColumnTask;
  allTasks: TaskDto[] = [];
  todo: TaskDto[] = [];
  done: TaskDto[] = [];
  InProgress: TaskDto[] = [];
  currentProjectId: number;
  columnName: string;
  updatedColumnName: string;
  currentProject: ProjectDto;
  taskName: string;
  defaultEndDate = new Date(1970, 1, 1);
  showFiller = false;
  panelOpenState = false;
  taskObj: Partial<Task> = {};
  columnColors: string[] = [];

  assignedPerson: string[];
  columnsLength: any[] = []; // Your column data
  tallestColumnHeight: string; // Store the tallest column's height


  constructor(
    private columnService: ColumnService,
    private taskService: TaskService,
    public dialog: MatDialog,
    private projectService: ProjectService,
    public translocoService: TranslocoService,
    public tokenService: TokenService) {

  }

  ngOnInit(): void {
    debugger

    
    this.getColumnId(this.currentColumnId);
    if (this.projectService.getProjectLocal() != null) {
      this.currentProject = this.projectService.getProjectLocal();
      this.columnService.GetProjectColumnsTasks( this.projectService.getProjectLocal().id ).subscribe((response) => {
        if (response.data != null) {
          this.columns = response.data;

          this.updateBackgroundColor();
          console.log(this.columns);
          const columnHeights = this.columns.map(column => column.tasks.length * 60.8 + 142); // Assuming each task is 40px tall
          console.log(columnHeights);
          
          this.tallestColumnHeight = Math.max(...columnHeights) + 'px';
          console.log(this.tallestColumnHeight);
        }
      });
    }
    

  }
  stopPropagation(event: { stopPropagation: () => void; }) {
    event.stopPropagation();

  }


  drop(event: CdkDragDrop<TaskDto[]>, column: ColumnTask) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.taskService.updateTaskColumnId({ "id": event.container.data[event.currentIndex].id, "columnId": column.id }).subscribe((res) => {
        this.ngOnInit()
      });
    }
  }

  dropColumn(event: CdkDragDrop<any[]>) {
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
  }

  openEditDialog(columnName: string, currentColumnId: number) {
    const dialogRef = this.dialog.open(EditColumnComponent, { data: { data: columnName, currentColumnId: currentColumnId } });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openTaskDialog(tId: number) {
    this.taskService.getTaskById(tId).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.tasks = res.data;

        const dialog = this.dialog.open(TaskComponent, { autoFocus: false, data: { task: this.tasks }, height: '90%', width: '90%', panelClass: 'dialog' });
        dialog.afterClosed().subscribe((res) => {
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



  createColumn() {
    this.columnService.CreateColumn({ 'projectId': this.projectService.getProjectLocal().id, 'name': this.columnName }).subscribe((res) => {
      this.columnName = ''
      this.ngOnInit()
    })
  }

  isDeleteButtonDisabled(id: number) {
    if (this.columns.length <= 1) {
      return true;
    }
    else {
      return false;
    }

  }



  CreateTask() {
    this.taskObj.columnId = this.currentColumnId;
    this.taskObj.projectId = this.projectService.getProjectLocal().id;
    this.taskObj.assigneeId = "unassigned";
    this.taskObj.reporterId = this.tokenService.tokenUserId();
    this.taskObj.priority = 3
    //this.taskObj.endDate = this.defaultEndDate

    this.taskService.createTask(this.taskObj).subscribe((res) => {
      if (res.isSuccessful) {
        this.ngOnInit();
      }
    });
  }

  OpenDeleteDialog(columnId: number, columnName: string) {
    if (columnId != null && columnName != null) {
      const column: ColumnDto = {
        id: columnId,
        name: columnName
      }

      let selectedColumn = this.columns.find(c => c.id == columnId);
      if (selectedColumn?.tasks.length == 0) {
        // Show SweetAlert before directly deleting the column
        Swal.fire({
          icon: 'warning',
          title: 'Delete Column',
          text: 'Are you sure you want to delete this column?',
          showCancelButton: true,
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.columnService.DeleteColumn(column.id).subscribe((res) => {
              if (res.isSuccessful) {
                this.ngOnInit();
              }
            });
          }
        });
      } else {
        const dialogRef = this.dialog.open(TransferColumnTaskComponent, { data: { column: column }, width: '540px' });
        dialogRef.afterClosed().subscribe(result => {
          this.columnService.TransferColumnTasks(result.transfer).subscribe((res) => {
            if (res.isSuccessful) {
              // Show SweetAlert before deleting the column after transferring tasks
              Swal.fire({
                icon: 'warning',
                title: 'Delete Column',
                text: 'Are you sure you want to delete this column?',
                showCancelButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.columnService.DeleteColumn(column.id).subscribe((res) => {
                    if (res.isSuccessful) {
                      this.ngOnInit();
                    }
                  });
                }
              });
            }
          });
        });
      }
    }
  }

  generateRandomBackgroundColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getRandomPredefinedColor(): string {
    const randomIndex = Math.floor(Math.random() * this.predefinedColors.length);
    return this.predefinedColors[randomIndex];
  }

  updateBackgroundColor() {
    this.columnColors = [];

    const usedColors = new Set();

    this.columns.forEach(column => {
      let randomColor = this.getRandomPredefinedColor();

      while (usedColors.has(randomColor)) {
        randomColor = this.getRandomPredefinedColor();
      }

      usedColors.add(randomColor); 
      this.columnColors.push(randomColor);
    });

  }
}