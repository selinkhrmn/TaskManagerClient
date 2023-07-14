import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Project } from 'src/app/interfaces';
import { Task } from 'src/app/interfaces/task';
import { ProjectService } from 'src/app/services';
import { TaskService } from 'src/app/services/task.service';
import { AngularEditorConfig } from '@kolkov/angular-editor/public-api';


@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent {
  task : Task[] = [];
  taskName : string;
  projects : Project[] = [];
  currentDate = new FormControl(new Date());

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '12rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial'
  };


  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) {
    this.getAllProjects();
  }


  ngOnInit() {
    // this.createTask();
    this.getAllTasks();
   
  }

  getAllTasks() {
    const project= this.projectService.getProjectLocal();
    this.taskService.getTask({"id": project.id}).subscribe(res => {
      this.task = res.data;
   console.log(this.task);
   
    });
  }

  //yeni issue
  createTask(){
    this.taskService.createTask({name: this.taskName}).subscribe((res) => {
      this.setTask(res.data);
      this.ngOnInit();
      
    });
  }

  setTask(task: any) {
    this.taskService.updateTask(task);
  }

  //bütün projeleri servis üstünden çekip proje arrayına atanıyor.
  public getAllProjects(){
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
        this.ngOnInit();
      }
    });
  }


}
