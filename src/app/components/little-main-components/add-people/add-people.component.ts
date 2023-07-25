import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss']
})
export class AddPeopleComponent{

 constructor(
  public tokenService: TokenService,
  public translocoService: TranslocoService
 ){

 }
}
