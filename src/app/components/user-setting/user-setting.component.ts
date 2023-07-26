import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent {
constructor(public translocoService : TranslocoService){}
}
