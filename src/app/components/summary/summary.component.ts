import { Component, AfterViewInit, OnInit } from '@angular/core';
import { select, scaleBand, scaleLinear, axisBottom, axisLeft, scaleOrdinal, format } from 'd3';
import { ProjectService, TaskService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { UserService } from 'src/app/services/user.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { ListTask } from 'src/app/interfaces/listTask';
import { UserDto } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { AddUsersToProjectComponent } from '../admin-page/admin-projects/add-users-to-project/add-users-to-project.component';
import { PriorityService } from 'src/app/services/priority.service';
import { TaskComponent } from '../task/task.component';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements AfterViewInit, OnInit {
  UserName: string = '';
  updatedTaskLength: number = 0;
  createdTaskLength: number = 0;
  completedSevenDay: number = 0;
  completedAllLength: number = 0;
  unplannedTasks: TaskDto[] = [];
  unassignedTasks: TaskDto[] = [];
  tasks: ListTask[] = [];
  users: ProjectUserDto[] = [];
  userTasks: { [userId: string]: number } = {};
  totalTasks: number = 0;
  userList: UserDto[] = [];
  lastActivities: ListTask[] = [];
  today: Date = new Date();
  fromDate: Date = new Date();

  constructor(
    public tokenService: TokenService,
    public projectService: ProjectService,
    public taskService: TaskService,
    public translocoService: TranslocoService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    public priorityService: PriorityService) {

  }

  ngOnInit(): void {
    let projectId = this.projectService.getProjectLocal().id;
    this.taskService.getAllProjectTask({ id: projectId }).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.tasks = res.data;
        this.totalTasks = this.tasks.length;
        this.unplannedTasks = this.tasks.filter(t => t.dueDate == new Date(1/1/1));
        this.unassignedTasks = this.tasks.filter(t => t.assigneeId == "unassigned");
        this.updatedTaskLength =  this.taskService.filterUpdatedDate(this.tasks, new Date(this.fromDate.setDate(this.today.getDate() -7)), this.today).length;
        this.createdTaskLength = this.taskService.filterCreatedDate(this.tasks, new Date(this.fromDate.setDate(this.today.getDate() -7)), this.today).length;
        this.completedSevenDay = this.taskService.filterDoneSevenDay(this.tasks, new Date(this.fromDate.setDate(this.today.getDate() -7)), this.today).length;
        this.completedAllLength = this.tasks.filter(t => t.isDone == true).length;

        this.filterLastActivities();
        this.userService.GetAllProjectUsers(projectId).subscribe((res) => {
          if (res.isSuccessful == true) {
            this.users = res.data;
            this.usersTasks();
          }
        })
      }
    })


    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }
    })

    // this.taskService.getUnplannedTask(projectId).subscribe((res) => {
    //   if (res.isSuccessful == true) {
    //     this.unplannedTasks = res.data;
    //   }
    // })

    // this.taskService.getUnassignedTask(projectId).subscribe((res) => {
    //   if (res.isSuccessful == true) {
    //     this.unassignedTasks = res.data;
    //   }
    // })

  }


  usersTasks() {
    this.userTasks = {};
    this.userTasks['unassigned'] = this.tasks.filter(task => task.assigneeId == "unassigned").length;
    this.users.forEach(user => {
      this.userTasks[user.id] = this.tasks.filter(task => task.assigneeId === user.id).length;
    });
  }

  filterLastActivities() {
    const currentDate = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(currentDate.getDate() - 14);
    let tokenId = this.tokenService.tokenUserId();
    this.lastActivities = this.tasks.filter(task =>
       (task.assigneeId === tokenId || task.reporterId === tokenId || task.createdByUser == tokenId) &&
       (new Date(task.createdDate) >= twoWeeksAgo || new Date (task.updatedDate) >= twoWeeksAgo)
    );
  }

  openTaskDialog(id: number){

    let selectedTask = this.tasks.find(t => t.id == id);
    const dialog = this.dialog.open(TaskComponent, { autoFocus: false, data: { task: selectedTask }, height: '90%', width: '90%', panelClass: 'dialog' });
    dialog.afterClosed().subscribe((res) => {
      this.ngOnInit();
    })
  }



  addUserDialog(): void {
    const dialogRef = this.dialog.open(AddUsersToProjectComponent, { height: '90%', width: '50%', panelClass: 'dialog' });
    dialogRef.afterClosed().subscribe((res) => {
      this.ngOnInit();
    })
  }


  // Veri seti
  private chartData = [
  { label: 'Highest', value: 5 },
  { label: 'High', value: 2 },
  { label: 'Medium', value: 3 },
  { label: 'Low', value: 1 },
  { label: 'Lowest', value: 0 }
];

ngAfterViewInit() {
  this.createChart();
}

  private createChart() {
  // SVG alanını seçin
  const svg = select('#myChart').append('svg')
    .attr('width', 500)
    .attr('height', 400);

  // Genel grafik boyutları
  const width = 400;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // Eksenler için ölçekleri oluşturun
  const xScale = scaleBand()
    .domain(this.chartData.map(d => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yScale = scaleLinear()
    .domain([0, 5]) // y ekseninin ölçeğini 0 ile 5 arasında ayarla
    .range([height - margin.bottom, margin.top]);

  // Renk ölçeğini oluşturun
  const colorScale = scaleOrdinal()
    .domain(this.chartData.map(d => d.label))
    .range(['#FF9999', '#FFFF99', '#9966FF', '#00CCFF', '#F08080']);

  // Grafik elemanlarını oluşturun
  svg.selectAll('rect')
    .data(this.chartData)
    .enter()
    .append('rect')
    .attr('x', (d: { label: string; value: number }) => xScale(d.label) || 0)
    .attr('y', (d: { label: string; value: number }) => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', (d: { label: string; value: number }) => yScale(0) - yScale(d.value))
    .attr('fill', (d: { label: string; value: number }) => colorScale(d.label) as string);

  // Eksenleri oluşturun
  const xAxis = axisBottom(xScale);
  const yAxis = axisLeft(yScale)
    .ticks(5) // y ekseninde 5 adet değer görüntülenir.
    .tickFormat(format('d')); // Her bir değer tam sayı olarak biçimlendirilir.

  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);
}

summaryFilter(filter: string, id?: string) {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  if (filter === 'UpdatedDate') {
    const selectedFilter = {
      name: 'UpdatedDate',
      fromDate: sevenDaysAgo,
      toDate: today
    };
    this.taskService.setSelectedFilter(selectedFilter);
  }
  else if (filter === 'CreatedDate') {
    const selectedFilter = {
      name: 'CreatedDate',
      fromDate: sevenDaysAgo,
      toDate: today
    };
    this.taskService.setSelectedFilter(selectedFilter);
  }
  else if(filter == 'selectAssignee'){
    const user = {
      name: 'selectAssignee',
      id: id
    }
    this.taskService.setSelectedFilter(user);
  }
  else if(filter == 'LastSevendDaysCompletedTasks'){
    const selectedFilter = {
      name: 'LastSevendDaysCompletedTasks',
      fromDate: sevenDaysAgo,
      toDate: today
    };
    this.taskService.setSelectedFilter(selectedFilter);
  }
  else if(filter == 'CompletedTasks'){
    this.taskService.setSelectedFilter(filter);
  }

   this.router.navigate(['/home/list']);
}
  
}