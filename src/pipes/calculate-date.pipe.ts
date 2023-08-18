import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDate'
})
export class CalculateDatePipe implements PipeTransform {

  transform(value: Date): string {
    const dateParam = new Date(value);
    const today = new Date();
    
    const emptyDate = new Date('0001-01-01').setHours(0,0,0);
    if(new Date(value).getTime() < new Date(1/1/2020).getTime()){
      return "Unplanned!";
    }
    else if (dateParam < today) {
      const difference = Math.abs(today.getTime() - dateParam.getTime());
      const days = Math.floor(difference / (1000 * 3600 * 24));
      return `${days} days passed.`;
    } 
    else if (dateParam > today) {
      const difference = Math.abs(dateParam.getTime() - today.getTime());
      const days = Math.floor(difference / (1000 * 3600 * 24));
      return `${days} days remaining.`;
    }
    else {
      return "Today!";
    }
  }

}
