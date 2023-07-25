import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(public translocoService : TranslocoService) {}
}
