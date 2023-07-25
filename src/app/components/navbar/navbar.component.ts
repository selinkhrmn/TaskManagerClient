import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { TokenService } from 'src/app/services/token.service';
import { AuthService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ColumnsComponent } from '../board/columns/columns.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers:[ColumnsComponent]
})
export class NavbarComponent {

  @ViewChild(MatTable) table: MatTable<Task>;
  
    constructor(
      public tokenService: TokenService,
      private dialog : MatDialog,
      private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
      public taskService : TaskService,
      private router: Router,
      public columnComp: ColumnsComponent,
      public authService: AuthService


    ) {}

    ngOnInit() {}

    hasToken(): boolean {
      return localStorage.getItem('token') !== null;
    }
  
    logOut(){
      this.authService.logOut();
     }

    openCreateIssueDialog() {
      const dialog = this.dialog.open(CreateIssueDialogComponent, {data : {table : this.table},width:'60%'});
      dialog.afterClosed().subscribe((response) => {
        if(response.isAdded) {
          let task : Partial<Task> = {
            name : response.name,
            columnId : response.columnId,
            projectId : response.projectId.id,
            priority : response.priority,
            endDate : response.endDate
          }
          this.taskService.createNewTask(task).subscribe((res:any)=>{
            console.log(res);
            this.columnComp.ngOnInit();
          })
          
        }

      });
      
      
    }

}
