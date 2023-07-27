import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  constructor() { }

  private PriorityIconMapping: { [iconAddess: string]: number } = {
    '../../assets/hosgeldiniz.png': 1,
    '../../assets/color.png': 2,
    '../../assets/meeting.png': 3,
    '../../assets/okay.png': 4,
    '../../assets/sedna.png': 5,

  };

  getIconPriority(iconAddess: string): number {
    return this.PriorityIconMapping[iconAddess] || 0; 
  }

  getOptions(){
    let options = ['../../assets/hosgeldiniz.png','../../assets/color.png' ];
    return options;
  }
}
