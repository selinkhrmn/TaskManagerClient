import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ResponseModel } from 'src/app/interfaces/responseModel';
import { UserActionDto, UserDto, UserProfilPhoto } from 'src/app/interfaces/user';
import { Observable, debounce } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ProjectUserList } from 'src/app/interfaces/projectUserDto';
import { ProjectService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { FileService } from 'src/app/services/file.service';


@Component({
  selector: 'app-add-people-to-project',
  templateUrl: './add-people-to-project.component.html',
  styleUrls: ['./add-people-to-project.component.scss'], 
})
export class AddPeopleToProjectComponent implements OnInit{
  users: UserDto[] = [];
  userId : string;
  url : any;
  newProjectName: any;
  addedList : ProjectUserList;
  selectedUsers: UserActionDto[] = [];
  projectId: number;
  usersProfiles : UserProfilPhoto[] = [];
  noImage= '../../assets/noImage.png';

  constructor(public translocoService: TranslocoService,
    private userService : UserService,
    private projectService : ProjectService,
    private dialog : MatDialog,
    private fileService : FileService) { }
  ngOnInit() 
  {
    debugger
    this.getAllUsers();
    this.newProjectName = localStorage.getItem('newProject');
    

    
    
  }


  getProfilePhoto(user : UserDto) : string{
     const a = this.usersProfiles.find(u => u.userId == user.id)
    if(a) {
      if(a.path != null) {
        return a.path;
      }
      
    }
    return this.noImage;

    
    
  }


  getAllUsers() {
    this.userService.getAllUsers().subscribe(resp=>{
      if(resp.isSuccessful){
        this.users=resp.data

      }else{
        //alert error
      }
    });

    //to get users profile
    this.fileService.GetFileForProjectUsers({"projectId" : this.projectService.getCurrentProject().id}).subscribe((res)=> {
      this.usersProfiles = res;
    });
  }

  onCheckboxChange(user: UserDto){
    const index = this.selectedUsers.findIndex(u => u.userId === user.id);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    } 
    else {
      this.selectedUsers.push({'userId':user.id, 'roleId': user.role}); 
    }

    
    
  }
  saveProjectUsers() {
    var currentProject ={
      id: 0,
      name: ''
    }
    var project = localStorage.getItem('current-project')
    currentProject = JSON.parse(project)
    this.projectId = JSON.parse(project).id;

    //burdan devam aşağısı çalışmıyor

    this.userService.AddUserToProject({projectId: currentProject.id, users: this.selectedUsers }).subscribe((res) => {
      console.log(res.data);
      if(res.isSuccessful == true) {
        Swal.fire({
          title: 'You successfully added the users into your project!',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
      if(res.isSuccessful == false) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
      }
      
    })

    this.dialog.closeAll();
    
  }

  closeDialog() {
    this.dialog.closeAll();
    location.reload();

  }
  
}
export class ButtonOverviewExample {}


