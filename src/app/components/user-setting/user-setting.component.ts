import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { User, UserDto } from 'src/app/interfaces/user';
import { AddPeopleToProjectComponent } from '../create-project/add-people-to-project/add-people-to-project.component';
import { AddUserToProjectComponent } from '../add-user-to-project/add-user-to-project.component';
import { ProjectService, TaskService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { ProjectDto } from 'src/app/interfaces/project';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { DeleteUserDialogComponent } from '../delete-user-dialog/delete-user-dialog.component';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],

})
export class UserSettingComponent {


  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  roleFormControl = new FormControl('');

  users: ProjectUserDto[] = [];
  selectedUser: string[] = [];
  userList: UserDto[] = [];
  currentProjectId: number;

  mail: any;


  constructor(
    public translocoService: TranslocoService,
    public dialog: MatDialog,
    public userService: UserService,
    public projectService: ProjectService,
    private taskService: TaskService,
    private tokenService: TokenService) { }


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

  deleteUser(id: string, role: string) {
    if (this.tokenService.hasRole('Admin') && (role == '4dc5874d-f3be-459a-b05f-2244512d13e3' || role == '6a2c4fe5-5b10-45b6-a1f6-7cfecc629d3f')) {
      Swal.fire({
        icon: 'error',
        title: 'You are not allowed to delete this user!',
        showConfirmButton: false
      })
      return;
    }
    else if (this.tokenService.hasRole('SuperAdmin') && (role == '4dc5874d-f3be-459a-b05f-2244512d13e3')) {
      Swal.fire({
        icon: 'error',
        title: 'This user cannot be deleted!',
        showConfirmButton: false
      })
      return;
    }
    else {
      const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
        data: { userId: id, projectId: this.projectService.getProjectLocal().id, getAllUsers: this.userList }, width: '40%'
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.GetAllProjectUsers();
      });
    }
  }
    
  

  openManageRoles(): void {
    console.log('Manage Roles clicked');
  }
}
