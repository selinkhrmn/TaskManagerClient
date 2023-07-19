import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss']
})
export class AddPeopleComponent{

 constructor(
  public tokenService: TokenService
 ){

 }
}
