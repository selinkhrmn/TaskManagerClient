import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { User, UserDto } from 'src/app/interfaces/user';
import { AddPeopleToProjectComponent } from '../create-project/add-people-to-project/add-people-to-project.component';
import { AddUserToProjectComponent } from '../add-user-to-project/add-user-to-project.component';
import { ProjectService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { ProjectDto } from 'src/app/interfaces/project';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';



@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent {


  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  roleFormControl = new FormControl('');

  users: any[] = [];

  currentProjectId: number;

mail: any;

 
  constructor(
    public translocoService: TranslocoService,
    public dialog: MatDialog,
    public userService: UserService,
    public projectService: ProjectService) { }


  openDialog() {
    this.dialog.open(RegisterPageComponent, {
      width: '30%'
    });
  }



  ngOnInit() {
    this.getProjectId()
    this.GetAllProjectUsers()
  }

  getProjectId() {
    const project = this.projectService.getProjectLocal();
    this.currentProjectId = project.id
    console.log(project.id);

  }

  GetAllProjectUsers() {
    debugger
    this.userService.GetAllProjectUsers({ 'id': this.currentProjectId }).subscribe((res) => {
      debugger
      console.log(res.data);
      this.users = res.data
      
      console.log(this.users);
      console.log(this.currentProjectId);


    })
  }
deleteUser(id : any)
   {
    console.log(id);
    
    this.userService.DeleteUserFromProject(id, this.currentProjectId).subscribe((response: any) => {
        console.log('User deleted successfully');
        this.ngOnInit();
      },
      (error: any) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  openManageRoles(): void {
    console.log('Manage Roles clicked');
  }
}

  

