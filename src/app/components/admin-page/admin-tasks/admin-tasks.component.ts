import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Project, ProjectDto } from 'src/app/interfaces/project';
import { Task } from 'src/app/interfaces/task';
import { User, UserDto } from 'src/app/interfaces/user';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { CreateIssueDialogComponent } from '../../create-issue-dialog/create-issue-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListTask } from 'src/app/interfaces/listTask';
import { TaskUserDto } from 'src/app/interfaces/taskDto';
import { TaskComponent } from '../../task/task.component';
import { PriorityService } from 'src/app/services/priority.service';
import { MatPaginator } from '@angular/material/paginator';
import { LabelPipe } from 'src/pipes/label.pipe';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.scss']
})
export class AdminTasksComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<Task>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentProject: ProjectDto;
  projectName: string;
  projects: Project[] = [];
  allTask: TaskUserDto[] = [];
  taskArray: TaskUserDto[] = [];
  project: ProjectDto;
  // projectId: number;
  task: Task[] = [];
  userList: UserDto[] = [];
  priorities: string[] = [];
  projectList: ProjectDto[] = [];
  selectedProject: Project | undefined;
  allProjectShow: boolean = false;
  isFilterMenuOpen: boolean = false;
  selectedPriority: number;
  selectedFilters: string[] = [];
  currentLabelFilter: string = null;


  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    public translocoService: TranslocoService,
    public userService: UserService,
    public tokenService: TokenService,
    public router: Router,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateIssueDialogComponent>,
    public priorityService: PriorityService
  ) { }

  displayedColumns: string[] = ['projectId', 'name', 'assignee', 'priority', 'label'];
  dataSource = new MatTableDataSource<TaskUserDto>(this.task);

  id: any;

  searchResult: any; // Store the search result here



  ngOnInit(): void {
    this.isFilterMenuOpen = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.fetchTasks();
  }


  fetchTasks() {
    this.priorities = this.priorityService.getOptions();
    this.projectService.getAllProjects().subscribe((res) => {
      this.projects = res.data;
      if (this.selectedProject == null) {
        this.allProjectShow = true;
      }
    })
    this.taskService.getProjectTasksAdmin().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.allTask = this.taskArray = res.data;
        console.log(this.allTask);
        
        this.userService.getAllUsers().subscribe((res) => {
          if (res.isSuccessful == true && res.data.length > 0) {
            this.userList = res.data;
            this.taskArray.forEach(task => {
              const assignee = this.userList.find(user => user.id === task.assigneeId);
              if (assignee) {
                const name = assignee.name.charAt(0).toUpperCase() + assignee.name.slice(1);
                const surname = assignee.surname.charAt(0).toUpperCase() + assignee.surname.slice(1);
                task.assigneeId = name + ' ' + surname;
              } else {
                task.assigneeId = 'Unassigned';
              }
            });
          }

        })

        this.dataSource = new MatTableDataSource<TaskUserDto>(this.taskArray);
        this.dataSource.paginator = this.paginator;
      }

    })
  }

  clearFilter() {
    this.taskArray = this.allTask;
    this.dataSource = new MatTableDataSource<TaskUserDto>(this.taskArray);
    this.dataSource.paginator = this.paginator;
  }

  selectProject(project: any): void {
    if (project == 'all') {
      this.allProjectShow = true;
      this.selectedProject = null;
      this.taskArray = this.allTask;
    }
    else if (project != null) {
      this.selectedProject = project;
      this.allProjectShow = false;
      this.taskArray = this.allTask.filter(t => t.projectId == project.id);
    }
    this.dataSource = new MatTableDataSource<TaskUserDto>(this.taskArray);
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateIssueDialog() {
    const dialog = this.dialog.open(CreateIssueDialogComponent, { data: { table: this.table }, width: '60%' });
    dialog.afterClosed().subscribe((response) => {
      if (response.isAdded) {
        this.taskService.createTask(response.task).subscribe((res) => {
          window.location.reload();
        })
      }
    });

  }

  openTaskDialog(id: number) {
    this.taskService.getTaskById(id).subscribe((res) => {
      let task = res.data;
      const dialogS = this.dialog.open(TaskComponent, { data: { task: task }, width: '60%' });
      dialogS.afterClosed().subscribe((res) => {
        this.ngOnInit();
      })
    })
  }


  activeTasksFilter() {
    this.dataSource = new MatTableDataSource<TaskUserDto>(this.taskArray.filter(t => t.label == 0));
    this.dataSource.paginator.firstPage();
  }


  toggleFilterMenu() {
    console.log(this.isFilterMenuOpen);

    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  applyFilterOptions() {
    console.log(`Applying filter: ${this.currentLabelFilter}}`);

    if (this.selectedProject != null) {
      this.taskArray = this.allTask.filter(t => t.projectId == this.selectedProject.id);
    } 
    else {
      this.taskArray = this.allTask;
    }


    if (this.currentLabelFilter == 'unseen') {
      this.taskArray = this.taskArray.filter(t => t.label == -1);
    }
    else if (this.currentLabelFilter == 'waiting') {
      this.taskArray = this.taskArray.filter(t => t.label == 0);
    }
    else if (this.currentLabelFilter == 'active') {
      this.taskArray = this.taskArray.filter(t => t.label == 1);
    }
    else if (this.currentLabelFilter == 'done') {
      this.taskArray = this.taskArray.filter(t => t.label == -2);
    }
    else if(this.currentLabelFilter == 'clear'){
      //
    }

    if (this.selectedPriority != null || this.selectedPriority != undefined ) {
      this.taskArray = this.taskArray.filter(t => t.priority == this.selectedPriority);
      this.selectedPriority = null;
    }

    this.isFilterMenuOpen = false;
    this.dataSource = new MatTableDataSource<TaskUserDto>(this.taskArray);
    this.dataSource.paginator = this.paginator;
  }
}
