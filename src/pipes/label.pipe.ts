import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TaskUserDto } from 'src/app/interfaces/taskDto';

@Pipe({
  name: 'label'
})
export class LabelPipe implements PipeTransform {

  transform(labelValue: number, labelList: Task[]): string {

    const taskU = labelList.find(t => t.label == labelValue);
    switch (taskU.label) {
      case 0:
        return "waiting";
      case 1:
        return "is working"
      case 2:
        return "done"
      default:
        return "not started"
    }

  }

}
