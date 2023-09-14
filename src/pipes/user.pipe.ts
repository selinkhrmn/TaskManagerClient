import { Pipe, PipeTransform } from '@angular/core';
import { EventType } from '@angular/router';
import { UserDto } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {
  transform(filter: string, userlist: UserDto[]): string {
    
    if (!filter || !userlist || userlist.length === 0) {
      return '';
    }

    if(filter == "unassigned"){
      return "Unassigned";
    }
    
    const user = userlist.find(t => t.id === filter);
    
    if (!user) {
      return filter;
    }
    const name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    const surname = user.surname.charAt(0).toUpperCase() + user.surname.slice(1);

    return name + ' ' + surname;
  }


  

}