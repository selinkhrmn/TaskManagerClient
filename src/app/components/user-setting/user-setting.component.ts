import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService} from '@ngneat/transloco';
import { RegisterPageComponent } from '../register-page/register-page.component';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent {
  constructor(public translocoService : TranslocoService,public dialog: MatDialog){}

openDialog(): void {
  const dialogRef = this.dialog.open(RegisterPageComponent,{height: '650px',width: '400px',panelClass: 'dialog'});
}
}
