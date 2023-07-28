import { Component, OnInit } from '@angular/core';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { UserDto } from 'src/app/interfaces/user';
import { ProjectService } from 'src/app/services';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-to-project',
  templateUrl: './add-user-to-project.component.html',
  styleUrls: ['./add-user-to-project.component.scss']
})
export class AddUserToProjectComponent implements OnInit {
  users : UserDto[] = [];
  userid : number;
  currentProjectId : number;
  constructor(private userService: UserService, private projectService : ProjectService) {}
  ngOnInit(): void {
    this.getCurrentProject();
    // this.userService.getAllUsers().subscribe((res) => {
    //   if(res.isSuccessful == true){
    //     this.users = res.data;
        
    //   }
    // })
}

  getCurrentProject() {
    const project = this.projectService.getCurrentProject();
    this.currentProjectId = project.id;
  }

  AddUserToProject() {
   
    this.userService.AddUserToProject({}).subscribe((res) => {
  
      
    })
  }
}
