import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { MatInputModule } from '@angular/material/input';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

import { AddProjectUser, ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDto } from 'src/app/interfaces/project';

export interface userChecked{
  user: UserDto;
  checked: boolean;
}

@Component({
  selector: 'app-add-users-to-project',
  templateUrl: './add-users-to-project.component.html',
  styleUrls: ['./add-users-to-project.component.scss'],
})
export class AddUsersToProjectComponent implements OnInit {
  toppings = new FormControl('');
  projects: Project[] = [];
  users: UserDto[] = [];
  projectId: number;
  checkedUsernames: string[] = [];
  checkedUserIds: string[] = [];
   addedUser : AddProjectUser = {
    users: [],
    projectId: 0
  };
  userList: any = []; // any yerine ne yapıcaz türünü
  userCheckedList: userChecked[] = [];
  selectedUsers: any[] = [];

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    if(this.projectId == null){
      this.projectId = this.projectService.getProjectLocal().id;
    }
    
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res.data;
      this.userService.GetProjectSelectedUsers(this.projectId).subscribe((resr) => {
        this.selectedUsers = resr.data;
        this.userCheckedList = this.users.map((user) => ({
          user,
          checked: this.isSelected(user.id)
        }));
      });
    });

    this.projectService.getAllProjects().subscribe((response) => {
      if (response.data != null) {
        this.projects = response.data;
      }
    });
  }

  onChangeProject(event: any) {
    this.projectId = event;
    console.log(event);
    
    this.userService.GetProjectSelectedUsers(this.projectId).subscribe((resr) => {
      this.selectedUsers = resr.data;
      this.userCheckedList = this.users.map((user) => ({
        user,
        checked: this.isSelected(user.id)
      }));
    });
  }


  toggleUser(username: string, userId: string, index: number): void {
    let userDetails: Partial<UserDto> = {};

    const isChecked = this.userList.some((user: UserDto) => user.username === username);
    if (!isChecked) {
      userDetails.id = userId;
      userDetails.username = username;
      this.userList.push(userDetails);
      this.addedUser.users = this.userList
    } 
    else {
      this.userList = this.userList.filter(
        (user: UserDto) => user.id !== userId
      );
    }
  }

  isSelected(userId: string){
    const isSelected = this.selectedUsers.some((selectedUser) => selectedUser.userId === userId);
    return isSelected;
  }
  

  AddUserToProject() {
    this.addedUser.projectId = this.projectId;
    this.userService.AddUserToProject(this.addedUser).subscribe((res) => {
    
    });
  }
  
  closeDialog() {
    const dialogRef = this.dialog.closeAll();
  }
}
