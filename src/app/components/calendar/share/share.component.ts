import { Component } from '@angular/core';
import { ProjectUserDto, ProjectUserList, ProjectUserListForEmail } from 'src/app/interfaces/projectUserDto';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent {
  id: any = '';
  message: string = '';
  sharedData: string[] = []; // Yeni dizi
  userList: ProjectUserList[] = [];
  justArray: UserDto[] = [];
 
  
  constructor(public userService: UserService) {}


  paylas() {
    debugger
    this.userService.getUserById(this.id).subscribe((res) => {
      this.justArray = res.data
    })
    // this.justArray.push(this.name)
    var emails:ProjectUserListForEmail = {
      message: this.message,
      users: this.justArray
    }
    
    this.userService.SendEmailToUsers(emails)
  }
}
