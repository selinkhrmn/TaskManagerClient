
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ListTask } from 'src/app/interfaces/listTask';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { ProjectService, TaskService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from '../../task/task.component';
@Component({
  selector: 'app-unplanned',
  templateUrl: './unplanned.component.html',
  styleUrls: ['./unplanned.component.scss']
})
export class UnplannedComponentComponent implements OnInit {
    @Output() closeEvent = new EventEmitter<void>();
    tasks: ListTask[] = [];
    constructor(
        private dialogRef: MatDialogRef<UnplannedComponentComponent>,
        private dialog: MatDialog,   // MatDialog enjekte edildi
        private taskService: TaskService,
        private projectService: ProjectService
        
    ) { }
    searchTerm: string = '';  // Arama terimi
    filteredTasks: ListTask[] = [];  // Filtrelenmiş görevler
    ngOnInit(): void {
        this.taskService.getAllProjectTask({id: this.projectService.getProjectLocal().id}).subscribe((res) => {
            if (res.isSuccessful == true) {
                this.tasks = res.data;
                this.tasks = this.tasks.filter(t => new Date(t.dueDate) <= new Date(1/1/1));
                console.log(this.tasks);
                
                // API isteği tamamlandığında filteredTasks'ı güncelle
                this.filteredTasks = this.tasks;
            }
        });
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
        this.dialogRef.close();  // Dialog penceresini doğrudan kapat
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
    
}
