import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-add-people-page',
  templateUrl: './add-people-page.component.html',
  styleUrls: ['./add-people-page.component.scss']
})
export class AddPeoplePageComponent {

  constructor(public translocoService: TranslocoService){}
}
