import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {

  transform(roleId: string): string {

    if (!roleId) {
      return "";
    }

    if (roleId == "336e1648-5384-4d2c-b886-0281db620ccb") {
      return "User";
    }
    else if (roleId == "6a2c4fe5-5b10-45b6-a1f6-7cfecc629d3f") {
      return "Admin";
    }
    else if(roleId == "4dc5874d-f3be-459a-b05f-2244512d13e3"){
      return "Super Admin"
    }
    else{
      return "Unknown Role?";
    }
  }

}
