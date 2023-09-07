import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { TokenService } from 'src/app/services/token.service';
import { AuthService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { ColumnsComponent } from '../board/columns/columns.component';
import { TranslocoService} from '@ngneat/transloco';
import { FileService } from 'src/app/services/file.service';
import { ShareComponent } from './share/share.component';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers:[ColumnsComponent]
})
export class NavbarComponent {

  @ViewChild(MatTable) table: MatTable<Task>;
  taskData : any;
  url : string;
  id = this.tokenService.getTokenId();

    constructor(
      public tokenService: TokenService,
      private dialog : MatDialog,
      private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
      public taskService : TaskService,
      private router: Router,
      public columnComp: ColumnsComponent,
      public authService: AuthService,
      public translocoService: TranslocoService,
      private fileService: FileService


    ) {}

    ngOnInit() {
      this.fileService.getProfilePhoto({"userId" : this.id}).subscribe((res)=> {
        this.url = res[res.length-1];
      });
    }

    hasToken(): boolean {
      return localStorage.getItem('token') !== null;
    }
  
    logOut(){
      this.authService.logOut();
     }

    routerToAdminPage() {
      this.router.navigate(['admin-page/admin-projects']);
    }
    navigateToSummary() {
      this.router.navigate(['/home/summary']); // Replace '/summary' with the actual route path of your summary component
    }
    
    routerToProfileSetting() {
      this.router.navigate(['profile-setting']);
    }

    openShareDialog(shareButton: HTMLElement) {
      const rect = shareButton.getBoundingClientRect();
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.position = {
        top: `${rect.top - 30}px`, // Örnek olarak butonun 200px üstünde açılması için, bu değeri ihtiyacınıza göre ayarlayabilirsiniz.
        left: `${rect.left - 130}px`
      };
  
      this.dialog.open(ShareComponent, dialogConfig);
    }

    openCreateIssueDialog() {
      const dialog = this.dialog.open(CreateIssueDialogComponent, { data: { table: this.table }, width: '60%' });
  
      dialog.afterClosed().subscribe((response) => {

        
  
        if (response.isAdded) {
          // this.taskService.GetAllTaskForUser(this.tokenService.getTokenId()).subscribe((tasks) => {
          //   console.log(tasks.data);
            
          // })
  
            this.taskService.createTask(response.task).subscribe((res) => {
              //window.location.reload();
              console.log(res.data);
              if (res.isSuccessful == true) {
                this.taskData = res.data;
                // this.formData = new FormData();
                //  this.formData.append('file', response.file);
      
                this.fileService.saveFile(response.file, this.taskData.id.toString()).subscribe((res) => {
                  
                  //this.formData.append('file', e.target.files[0]);
      
                });
              }
      
      
            });
          
        }
        
        
  
  
       
  
  
      });
  
  
    }

    changeLanguage(language: 'tr' | 'en') {
      this.translocoService.setActiveLang(language);
    }

}
