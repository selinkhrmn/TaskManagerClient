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

import { ProjectUserList, ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDto } from 'src/app/interfaces/project';

export interface userChecked {
  user: UserDto;
  checked: boolean;
}

@Component({
  selector: 'app-add-users-to-project',
  templateUrl: './add-users-to-project.component.html',
  styleUrls: ['./add-users-to-project.component.scss'],
})
export class AddUsersToProjectComponent implements OnInit {
  projects: Project[] = [];
  users: UserDto[] = [];
  projectId: number;
  addedUser: ProjectUserList = {
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
  ) { }

  ngOnInit() {
    if (this.projectId == null) {
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


  // toggleUser(username: string, userId: string, index: number): void {
  
  
  //   const userIndex = this.userCheckedList.findIndex(user => user.user.id === userId);
  //   console.log(this.userCheckedList[userIndex].user.name);
    
  //   // if (userIndex !== -1) {
  //   //   debugger;
  //   //   this.userCheckedList[userIndex].checked = !this.userCheckedList[userIndex].checked;
  //   // }

  
  // }

  isSelected(userId: string): boolean {
    const isSelected = this.selectedUsers.some((selectedUser) => selectedUser.userId === userId);
    return isSelected;
  }
  
  AddUserToProject() {
    this.addedUser.projectId = this.projectId;

    const addUsers: Partial<UserDto>[] = [];
    const removeUsers: Partial<UserDto>[] = [];
  
    this.userCheckedList.forEach(userFromList => {
      if (userFromList.checked && !this.isSelected(userFromList.user.id)) {
        addUsers.push(userFromList.user);
      } 
      else if (!userFromList.checked && this.isSelected(userFromList.user.id)) {
        removeUsers.push(userFromList.user);
      }
    });

    if(removeUsers.length != 0){
      const removeRequest: ProjectUserList = {
        users: removeUsers,
        projectId: this.projectId
      };

      this.userService.DeleteUserFromProject(removeRequest).subscribe((res) => {

      });
    }
    
    if(addUsers.length != 0){
      const addRequest: ProjectUserList = {
        users: addUsers,
        projectId: this.projectId
      };

      this.userService.AddUserToProject(addRequest).subscribe((res) => {

      });
    }
   
  
    //this.userCheckedList.forEach(user => user.checked = false);
  }
  

  closeDialog() {
    const dialogRef = this.dialog.closeAll();
  }
}
