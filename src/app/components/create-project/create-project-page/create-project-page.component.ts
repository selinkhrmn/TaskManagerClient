import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-create-project-page',
  templateUrl: './create-project-page.component.html',
  styleUrls: ['./create-project-page.component.scss']
})
export class CreateProjectPageComponent {
  showFiller = false;

  constructor(public transloco : TranslocoService) {}
}
