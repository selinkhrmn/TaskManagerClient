import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnService, ProjectService } from 'src/app/services';
import { Column } from 'src/app/interfaces/column';
import { TranslocoService } from '@ngneat/transloco';

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

  columnName: string = this.data.data;
  updatedColumnName2: string;
  currentProjectId: number;
  currentColumnId: number;

  constructor(
    private dialogRef: MatDialogRef<ColumnsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private projectService: ProjectService,
    private columnService: ColumnService,
    public translocoService: TranslocoService,
    private ngZone: NgZone
  ) { }
  ngOnInit(): void {
    console.log(this.data.data);

    this.columnName = this.data.data;
    this.currentColumnId = this.data.currentColumnId;

  }

  closeDialog() {
    this.dialogRef.close();
  }

  getProjectLocal() {
    this.currentProjectId = this.projectService.getProjectLocal().id;

  }


  UpdateColumn() {
    let column: Partial<Column> = {
      name: this.columnName,
      id: this.currentColumnId
    }
    this.columnService.UpdateColumn(column).subscribe((res) => {
      if (res.isSuccessful == true) {
        console.log(this.columnName);
        this.ngZone.run(() => {
          // Değişiklikleri Angular içinde tetikler
        });
      }
    });

  }


}
