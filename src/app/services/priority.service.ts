import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  constructor() { }

  private priorityIconMapping: { [iconAddress: string]: { priority: number; name: string } } = {
    '../../assets/hosgeldiniz.png': { priority: 1, name: 'Easy' },
    '../../assets/color.png': { priority: 2, name: 'Medium' },
    '../../assets/meeting.png': { priority: 3, name: 'Hard' },
    '../../assets/okay.png': { priority: 4, name: 'Normal' },
    '../../assets/sedna.png': { priority: 5, name: 'Difficult' },
  };

  getIconPriority(iconAddress: string): number {
    return this.priorityIconMapping[iconAddress].priority || 0;
  }

  getIconName(iconAddress: string): string {
    return this.priorityIconMapping[iconAddress].name || 'Unknown'; 
  }

  getOptions(){
    let options = ['../../assets/hosgeldiniz.png','../../assets/color.png' ];
    return options;
  }
}
