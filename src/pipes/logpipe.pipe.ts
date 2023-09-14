import { Pipe, PipeTransform } from '@angular/core';
import { UserPipe } from './user.pipe'; // Import your user pipe
import { LabelPipe } from './label.pipe';
import { UserDto } from 'src/app/interfaces/user';
import { DatepipePipe } from './datepipe.pipe';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dynamicTransform',
})
export class DynamicTransformPipe implements PipeTransform {
  constructor(
    private userPipe: UserPipe,
    private labelPipe: LabelPipe,
    private datePipe: DatepipePipe
  ) {}

  transform(value: string, fieldName: string, userList: UserDto[]): any {
    switch (fieldName) {
      case 'Label':
        return this.labelPipe.transform(parseInt(value));
      case 'AssigneeId':
      case 'ReporterId':
        return this.userPipe.transform(value, userList);
      case 'EndDate':
      case 'UpdatedDate':
      case 'CreatedDate':
      case 'DueDate':
        // new Date(value);
        // const date = formatDate(value, 'yyyy-MM-dd', 'en-US')
        // return date;
        return value;
      default:
        return value;
    }
  }
}
