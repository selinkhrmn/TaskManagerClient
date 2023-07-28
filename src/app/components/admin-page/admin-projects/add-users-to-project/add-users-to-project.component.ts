import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { MatInputModule } from '@angular/material/input';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { AddProjectUser, ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-users-to-project',
  templateUrl: './add-users-to-project.component.html',
  styleUrls: ['./add-users-to-project.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatInputModule,
    MatButtonModule
  ],
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

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getAllUsers();
    this.projectService.getAllProjects().subscribe((response) => {
      if (response.data != null) {
        this.projects = response.data;
      }
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res.data;
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
    } else {
      this.userList = this.userList.filter(
        (user: UserDto) => user.id !== userId
      );
    }
    
  }

  AddUserToProject() {
    this.addedUser.projectId = this.projectId

    this.userService.AddUserToProject(this.addedUser).subscribe((res) => {
      console.log(res);
    })
  }
}
