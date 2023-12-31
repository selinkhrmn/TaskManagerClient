import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { MatInputModule } from '@angular/material/input';
import { UserActionDto, UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

import { ProjectUserList, ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectDto } from 'src/app/interfaces/project';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

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
  dataSource = new MatTableDataSource<UserDto>(this.users);
  theInput: string = '';
  inputUserList: any = [];
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddUsersToProjectComponent>,
  ) { }

  ngOnInit() {
    if (this.projectId == null) {
      this.projectId = this.projectService.getProjectLocal().id;
    }

    this.userService.getAllUsers().subscribe((res) => {
      this.users = res.data.filter(u => u.status = true);
      this.userService.GetProjectSelectedUsers(this.projectId).subscribe((resr) => {
        this.selectedUsers = resr.data;
        this.userCheckedList = this.users.map((user) => ({
          user,
          checked: this.isSelected(user.id)
        }));
        this.inputUserList = this.userCheckedList
      });
    });

    this.projectService.getAllProjects().subscribe((response) => {
      if (response.data != null) {
        this.projects = response.data;
      }
    });
  }

  applyFilter() {
    this.inputUserList = this.userCheckedList
      .filter(user => user.user.name.includes(this.theInput));
    console.log(this.inputUserList);
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
      this.inputUserList = this.userCheckedList
    });
  }


  isSelected(userId: string): boolean {
    const isSelected = this.selectedUsers.some((selectedUser) => selectedUser.userId === userId);
    return isSelected;
  }
  
  AddUserToProject() {
    this.addedUser.projectId = this.projectId;
    const addUsers: UserActionDto[] = [];
    const removeUsers: UserActionDto[] = [];
  
    this.userCheckedList.forEach(userFromList => {
      if (userFromList.checked && !this.isSelected(userFromList.user.id)) {
        addUsers.push({'userId':userFromList.user.id, 'roleId': userFromList.user.role});
      } 
      else if (!userFromList.checked && this.isSelected(userFromList.user.id)) {
        removeUsers.push({'userId':userFromList.user.id, 'roleId': userFromList.user.role});
      }
    });

    if(removeUsers.length != 0){
      // this.userService.DeleteUserFromProject({projectId: this.projectId, users: removeUsers}).subscribe((res) => {
      //   if(res.isSuccessful == true){
      //     Swal.fire('Saved!', '', 'success');
      //   }
      // });
    }
    
    if(addUsers.length != 0){
      
      this.userService.AddUserToProject({projectId: this.projectId, users: addUsers}).subscribe((res) => {
        if(res.isSuccessful == true){
          Swal.fire('Saved!', '', 'success');
        }
        
      });
    }
   
  
    //this.userCheckedList.forEach(user => user.checked = false);
  }
  

  closeDialog() {
   this.dialogRef.close();
  }
}
