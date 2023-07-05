import { Component } from '@angular/core';
import { TabsComponent } from '../tabs.component';

@Component({
  selector: 'app-tabs-name-part',
  templateUrl: './tabs-name-part.component.html',
  styleUrls: ['./tabs-name-part.component.scss']
})
export class TabsNamePartComponent {
  constructor(private tabs : TabsComponent) { 
  
  }

}
