import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { TokenService } from 'src/app/services/token.service';
import { TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { MatTable } from '@angular/material/table';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @ViewChild(MatTable) table: MatTable<Task>;
  
    constructor(
      public tokenService: TokenService,
      private dialog : MatDialog,
      private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
      public taskService : TaskService


    ) {}

    ngOnInit() {}

    openCreateIssueDialog() {
      const dialog = this.dialog.open(CreateIssueDialogComponent, {data : {table : this.table},width:'60%'});
      
      dialog.afterClosed().subscribe((response) => {
        if(response.isAdded) {
          this.taskService.createTask({
            name : response.name,
            columnId : response.columnId,
            projectId : response.projectId,
            priority : response.priority,
            userUpdatedDate : response.userUpdatedDate,
            endDate : response.endDate
          })
        }

      });
      
      
    }

}
