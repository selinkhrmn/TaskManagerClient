import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { ColumnDto, TransferDto } from 'src/app/interfaces/columnDto';
import { ColumnService, ProjectService } from 'src/app/services';

interface DialogData {
  column: ColumnDto
}

@Component({
  selector: 'app-transfer-column-task',
  templateUrl: './transfer-column-task.component.html',
  styleUrls: ['./transfer-column-task.component.scss']
})
export class TransferColumnTaskComponent implements OnInit {

  columns: ColumnDto[] = [];  
  deletedColumn : ColumnDto = this.data.column;
  //deletedColumnId: number = this.data.column.id;
  transferredColumnId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private columnService: ColumnService,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<TransferColumnTaskComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data);
    
    const projectId = this.projectService.getProjectLocal().id;
    this.columnService.GetAllProjectColumns({'id': projectId}).subscribe((res) => {
      if(res.isSuccessful == true){
        this.columns = res.data;
      }
    })
  }

  delete(){
    if(this.transferredColumnId  != null){
      this.closeDialog();
    }
    else{
      alert("Yeni kolon seçilmedi!");
    }
  }

  closeDialog(){
    const transferdto: TransferDto = {
      projectId: this.projectService.getProjectLocal().id,
      columnId: this.deletedColumn.id,
      transferredColumnId: this.transferredColumnId
    }
    this.dialogRef.close({
      isTransferred: true,
      transfer : transferdto
    });
  }
}

