import { Component, Inject, OnInit } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnService, ProjectService } from 'src/app/services';
import { Column } from 'src/app/interfaces/column';

interface DialogData {
  data: string
}

@Component({
  selector: 'app-edit-column',
  templateUrl: './edit-column.component.html',
  styleUrls: ['./edit-column.component.scss'],
})
export class EditColumnComponent implements OnInit {
  
  columnName: string;
  updatedColumnName2: string;
  currentProjectId: number;
  currentColumnId: number;

  constructor(
    private dialogRef: MatDialogRef<ColumnsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private projectService: ProjectService,
    private columnService: ColumnService
  ) {}
  ngOnInit(): void {
  console.log(this.columnName);
  this.columnName = JSON.stringify(this.data).toString();
  this.columnName = JSON.parse(this.columnName);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getColumnId(columnId: number) {
    this.currentColumnId = columnId;
    console.log('Column ID:', this.currentColumnId);
  }
  
  getProjectLocal() {
    const currentProjectId = this.projectService.getProjectLocal();
    return (this.currentProjectId = currentProjectId.id);
  }

  UpdateColumn() {
    console.log(this.data);
    
    this.getProjectLocal();
    console.log(this.data);
    console.log(this.columnName);
    
    this.columnService
      .UpdateColumn({
        'id': this.currentProjectId,
        'name': this.columnName
      })
      .subscribe((res) => {});
  }
}
