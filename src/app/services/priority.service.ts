import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  constructor() { }

  private priorityIconMapping: { [iconAddress: string]: { priority: number; name: string } } = {
    '../../assets/lowest.png': { priority: 1, name: 'Lowest' },
    '../../assets/low.png': { priority: 2, name: 'Low' },
    '../../assets/medium.png': { priority: 3, name: 'Medium' },
    '../../assets/high.png': { priority: 4, name: 'High' },
    '../../assets/highest.png': { priority: 5, name: 'Highest' },
  };


  getIconPriority(iconAddress: string): number {
    return this.priorityIconMapping[iconAddress].priority || 0;
  }

  getIconName(iconAddress: string): string {
    return this.priorityIconMapping[iconAddress].name || 'Unknown'; 
  }

  getOptions(){
    let options = ['../../assets/highest.png','../../assets/high.png','../../assets/medium.png','../../assets/low.png','../../assets/lowest.png' ];
    return options;
  }

  getIcon(priority: number, what: string): string | undefined {
    for (const iconAddress in this.priorityIconMapping) {
      if (this.priorityIconMapping.hasOwnProperty(iconAddress)) {
        if (this.priorityIconMapping[iconAddress].priority === priority) {
          if(what == 'name'){
            return this.priorityIconMapping[iconAddress].name;
          }
          else if(what == 'icon'){
            return iconAddress;
          }
        }
      }
    }
    return undefined; 
  }

  
}
