import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { TokenService } from 'src/app/services/token.service';
import { AuthService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ColumnsComponent } from '../board/columns/columns.component';
import { TranslocoService} from '@ngneat/transloco';



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
      public authService: AuthService,
      public translocoService: TranslocoService


    ) {}

    ngOnInit() {}

    hasToken(): boolean {
      return localStorage.getItem('token') !== null;
    }
  
    logOut(){
      this.authService.logOut();
     }

    routerToAdminPage() {
      this.router.navigate(['admin-page/admin-projects']);
    }

    openCreateIssueDialog() {
      const dialog = this.dialog.open(CreateIssueDialogComponent, {data : {table : this.table},width:'60%'});
      dialog.afterClosed().subscribe((response) => {
        console.log(response);
        
        if(response.isAdded) {
          this.taskService.createTask(response.task).subscribe((res)=>{
            
              // window.location.reload();
          })
        }
      });
      
      
    }

    changeLanguage(language: 'tr' | 'en') {
      this.translocoService.setActiveLang(language);
    }

}
