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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],

})
export class UserSettingComponent {


  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  roleFormControl = new FormControl('');

  users: ProjectUserDto[] = [];
  selectedUser: Partial<UserDto>[] = [];
  userList: UserDto[] = [];
  currentProjectId: number;

  mail: any;


  constructor(
    public translocoService: TranslocoService,
    public dialog: MatDialog,
    public userService: UserService,
    public projectService: ProjectService) { }


  openDialog() {
    this.dialog.open(RegisterPageComponent, {
      width: '30%',height: '80%'
    });
  }



  ngOnInit() {
    this.getProjectId()
    this.GetAllProjectUsers();
    this.getUserList();
  }

  getProjectId() {
    const project = this.projectService.getProjectLocal();
    this.currentProjectId = project.id
  }

  getUserList(){
    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }})
  }

  GetAllProjectUsers() {
    this.userService.GetAllProjectUsers(this.currentProjectId).subscribe((res) => {
      this.users = res.data
    })
  }
  deleteUser(user: any) {
    this.selectedUser.push({id: user.id});
    this.userService.DeleteUserFromProject({projectId: this.projectService.getProjectLocal().id, users: this.selectedUser} ).subscribe((response: any) => {
        console.log('User deleted successfully');
        this.selectedUser =  [];
        this.GetAllProjectUsers();
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
