import { Component, Inject } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


 interface DialogData {
  data: string
}
@Component({
  selector: 'app-edit-column',
  templateUrl: './edit-column.component.html',
  styleUrls: ['./edit-column.component.scss'],
  
})
export class EditColumnComponent {

  updatedColumnName = this.data;
  constructor(private dialogRef: MatDialogRef<ColumnsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
   
  closeDialog() {
    this.dialogRef.close();
  }
  
  
}
