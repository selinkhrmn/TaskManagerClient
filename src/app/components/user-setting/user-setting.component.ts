import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService} from '@ngneat/transloco';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { UserService } from 'src/app/services/user.service';
import { UserDto } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit{

  users : UserDto[] = [];

  constructor(
    public translocoService : TranslocoService,
    public dialog: MatDialog,
    public userService: UserService){}

  ngOnInit(): void {
      this.userService.getAllUsers().subscribe((res) => {
        if(res.isSuccessful == true){
          this.users = res.data;
          
        }
      })

  
  }    
  

openDialog(): void {
  const dialogRef = this.dialog.open(RegisterPageComponent,{height: '650px',width: '400px',panelClass: 'dialog'});
}


}
