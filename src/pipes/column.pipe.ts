import { Pipe, PipeTransform } from '@angular/core';
import { ColumnDto } from 'src/app/interfaces/columnDto';

@Pipe({
  name: 'column'
})
export class ColumnPipe implements PipeTransform {

  transform(id: number, columnList: ColumnDto[]): string {
    if(!id || !ColumnDto) {
      return "Column name not specified";
    }

    const column = columnList.find(c=> c.id === id);

    if(!column) {
      return "Column not found";
    }
    
    return column.name;
    
  }

}
