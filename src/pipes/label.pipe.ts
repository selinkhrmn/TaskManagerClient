import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TaskUserDto } from 'src/app/interfaces/taskDto';

@Pipe({
  name: 'label'
})
export class LabelPipe implements PipeTransform {

  transform(labelValue: number): string {

    switch (labelValue) {
      case -1:
        return "Not Started";
      case 0:
        return "Pending";
      case 1:
        return "Ongoing";
      case 2:
        return "Completed";
      default:
        return "Uncertain";
    }

  }

}

/*
  "Not Started": "Not started",
    "Pending" : "Pending",
    "Ongoing": "Ongoing",
    "Completed": "Completed",

*/