import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ResponseModel } from 'src/app/interfaces/responseModel';
import { UserDto } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-add-people-to-project',
  templateUrl: './add-people-to-project.component.html',
  styleUrls: ['./add-people-to-project.component.scss'],
  
})
export class AddPeopleToProjectComponent {
  users: UserDto[] = [];
  newProjectName: any;

  constructor(public translocoService: TranslocoService,
    private userService : UserService) { }
  ngOnInit() 
  {
    this.getAllUsers();
    this.newProjectName = localStorage.getItem('newProject');
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(resp=>{
      if(resp.isSuccessful){
        this.users=resp.data

      }else{
        //alert error
      }
    });
  }

}

