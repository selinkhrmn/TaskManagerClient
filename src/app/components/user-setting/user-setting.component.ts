import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent {

  

constructor(public translocoService : TranslocoService,public dialog: MatDialog){}


openDialog(): void {
  const dialogRef = this.dialog.open(RegisterPageComponent,{height: '90%',width: '70%',panelClass: 'dialog'});
}
}
