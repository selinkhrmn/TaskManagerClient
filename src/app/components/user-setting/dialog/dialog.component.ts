import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent  implements OnInit{
constructor () {}
personSelection: any;
ngOnInit() : void {

}


addPerson(): void {
  console.log(this.personSelection.value);
}
}