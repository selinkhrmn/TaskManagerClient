import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-little-main-components',
  templateUrl: './little-main-components.component.html',
  styleUrls: ['./little-main-components.component.scss']
})
export class LittleMainComponentsComponent {
  constructor(public translocoService : TranslocoService) {}
}
