import { Component, Inject, OnInit } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnService, ProjectService } from 'src/app/services';
import { Column } from 'src/app/interfaces/column';
import { TranslocoService} from '@ngneat/transloco';

interface DialogData {
  data: string,
  currentColumnId: number
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
    private columnService: ColumnService,
    public translocoService: TranslocoService
  ) {}
  ngOnInit(): void {

      this.columnName = this.data.data;
      this.currentColumnId = this.data.currentColumnId
  
  }

  closeDialog() {
    this.dialogRef.close();
  }
  
  getProjectLocal() {
    this.currentProjectId = this.projectService.getProjectLocal().id;

  }

  UpdateColumn() {
    
    this.getProjectLocal();
    
    this.columnService
      .UpdateColumn({
        'id': this.currentColumnId,
        'name': this.columnName
      })
      .subscribe((res) => {
        
      });
  }
}
