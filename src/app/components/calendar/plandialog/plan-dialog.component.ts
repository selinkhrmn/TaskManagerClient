import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ListTask } from 'src/app/interfaces/listTask';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { ProjectService, TaskService } from 'src/app/services';

@Component({
    selector: 'app-plan-dialog',
    templateUrl: './plan-dialog.component.html',
    styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent implements OnInit {
    @Output() closeEvent = new EventEmitter<void>();
    tasks: ListTask[] = [];
    constructor(private dialogRef: MatDialogRef<PlanDialogComponent>, private taskService: TaskService, private projectService: ProjectService) { }
    ngOnInit(): void {
        // this.taskService.getUnplannedTask(this.projectService.getProjectLocal().id).subscribe((response) => {
        //     if (response.isSuccessful == true) {
        //         this.tasks = response.data
        //     }
        // })
        this.taskService.getAllProjectTask({id: this.projectService.getProjectLocal().id}).subscribe((res) => {
            if (res.isSuccessful == true) {
              this.tasks = res.data;
              this.tasks = this.tasks.filter(t => new Date(t.dueDate) <= new Date(1/1/1))
              console.log(this.tasks);
            //   this.tasks.filter(t => t.dueDate == new Date(1/1/1));
            }
          });
    }

    closeDialog(): void {
        this.closeEvent.emit();  // Çarpı butonuna tıklanınca olayı yayınlayarak ana bileşende kapatma fonksiyonunu tetikleyeceğiz.
    }
}
