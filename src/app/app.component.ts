import { Component } from '@angular/core';
import { TranslocoService} from '@ngneat/transloco';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TaskManagerClient';
  
  constructor(public translocoService : TranslocoService) {

  }

  public update() {
    this.translocoService.setActiveLang('tr');
  }
}
