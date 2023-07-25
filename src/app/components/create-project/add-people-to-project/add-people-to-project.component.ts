import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-add-people-to-project',
  templateUrl: './add-people-to-project.component.html',
  styleUrls: ['./add-people-to-project.component.scss']
})
export class AddPeopleToProjectComponent {
    constructor(public translocoService: TranslocoService){}
}
