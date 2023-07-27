import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms'; // Import FormControl and Validators

import { TranslocoService} from '@ngneat/transloco';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { UserService } from 'src/app/services/user.service';
import { UserDto } from 'src/app/interfaces/user';
import { AddPeopleToProjectComponent } from '../create-project/add-people-to-project/add-people-to-project.component';
import { AddUserToProjectComponent } from '../add-user-to-project/add-user-to-project.component';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  roleFormControl = new FormControl(''); // Create the roleFormControl
  constructor(
    public translocoService : TranslocoService,
    public dialog: MatDialog,
    public userService: UserService,
    public projectService: ProjectService){}


  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    });
  }

  users : UserDto[] = [];
  currentProjectId : number;


  ngOnInit() {
    this.getProjectId()
      this.GetAllProjectUsers()
  }    

  getProjectId() {
    const project = this.projectService.getCurrentProject();
    this.currentProjectId = project.id
    console.log(project.id);
    
  }

  GetAllProjectUsers() {
    this.userService.GetAllProjectUsers({'id' : this.currentProjectId}).subscribe((res) => {
      console.log(res);
      console.log(this.currentProjectId);
      
      
    })
  }
  

// openDialog(): void {
//   const dialogRef = this.dialog.open(RegisterPageComponent,{height: '650px',width: '400px',panelClass: 'dialog'});
// }

// openDialog1(): void {
//   const dialogRef = this.dialog.open(AddUserToProjectComponent,{height: '100%',width: '100%',panelClass: 'dialog'});

  openManageRoles() {
    // Implement the function logic here
    // For example:
    console.log('Manage Roles clicked');
  }
}

