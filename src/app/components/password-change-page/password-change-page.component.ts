import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-password-change-page',
  templateUrl: './password-change-page.component.html',
  styleUrls: ['./password-change-page.component.scss']
})
export class PasswordChangePageComponent {
constructor(public translocoService: TranslocoService) {

}
}
