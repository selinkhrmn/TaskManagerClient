import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ListTask } from 'src/app/interfaces/listTask';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { ProjectService, TaskService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from '../../task/task.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-plan-dialog',
    templateUrl: './plan-dialog.component.html',
    styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent implements OnInit {
    @Output() closeEvent = new EventEmitter<void>();
    tasks: ListTask[] = [];
    constructor(
        private dialogRef: MatDialogRef<PlanDialogComponent>,
        private dialog: MatDialog,   // MatDialog enjekte edildi
        private taskService: TaskService,
        private projectService: ProjectService,
        private translocoService: TranslocoService

    ) { }
    searchTerm: string = '';  // Arama terimi
    filteredTasks: ListTask[] = [];  // Filtrelenmiş görevler
    ngOnInit(): void {
        if (this.projectService.getProjectLocal() != null) {
            this.taskService.getAllProjectTask({ id: this.projectService.getProjectLocal().id }).subscribe((res) => {
                if (res.isSuccessful == true) {
                    this.tasks = res.data;
                    this.tasks = this.tasks.filter(t => new Date(t.dueDate) <= new Date(1 / 1 / 1));
                    console.log(this.tasks);

                    // API isteği tamamlandığında filteredTasks'ı güncelle
                    this.filteredTasks = this.tasks;
                }
            });
        }
    }

    openTaskDialog(taskId: number): void {
        this.taskService.getTaskById(taskId).subscribe((res) => {
            if (res.isSuccessful) {
                const taskData = res.data;
                this.dialog.open(TaskComponent, {
                    autoFocus: false,
                    data: { task: taskData },
                    height: '90%',
                    width: '90%',
                    panelClass: 'dialog'
                });
            }
        });
    }
    closeDialog(): void {
        this.closeEvent.emit();  // Çarpı butonuna tıklanınca olayı yayınlayarak ana bileşende kapatma fonksiyonunu tetikleyeceğiz.
    }
    filterTasks(): void {
        if (!this.searchTerm) {
            this.filteredTasks = this.tasks;  // Eğer arama çubuğu boşsa tüm task'ları göster
            return;
        }

        this.filteredTasks = this.tasks.filter(task =>
            task.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
        );
    }
    someMethod(): void {
        const translatedText = this.translocoService.translate('your_translation_key');
        console.log(translatedText);
      }

}
