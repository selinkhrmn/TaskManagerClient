import { Component, AfterViewInit, OnInit } from '@angular/core';
import { select, scaleBand, scaleLinear, axisBottom, axisLeft, scaleOrdinal } from 'd3';
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
import { LogService } from 'src/app/services/log.service';
import { LogDto, LogUserDto } from 'src/app/interfaces/logDto';
import * as d3 from 'd3';
import { PagedResult } from 'src/app/interfaces/pagedResult';
import { ResponseModel } from 'src/app/interfaces/responseModel';


type PriorityCounts = {
  Lowest: number;
  Low: number;
  Normal: number;
  High: number;
  Highest: number;
};

interface ChartDataset {
  labels: string[];
  datasets: ChartDataEntry[];
}

interface ChartDataEntry {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements AfterViewInit, OnInit {
  public chartData: ChartDataset;
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
  userLogs: any;
  totalCount: number;
  pageNumber = 1;
  pageSize = 10;
  private readonly priorityColors = ['#237DB0', '#0B5F8F', '#FFDF00', '#EB7934', '#E44C23'];
  private readonly priorityLabels = ['Lowest', 'Low', 'Normal', 'High', 'Highest'];

  constructor(
    public tokenService: TokenService,
    public projectService: ProjectService,
    public taskService: TaskService,
    public translocoService: TranslocoService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    public priorityService: PriorityService,
    public logService: LogService
  ) { }

  ngOnInit(): void {
    this.getUserLogs();
  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData(): void {
    if (this.projectService.getProjectLocal() != null) {
      let projectId = this.projectService.getProjectLocal()?.id;
      this.taskService.getAllProjectTask({ id: projectId }).subscribe((res) => {
        if (res.isSuccessful == true) {
          this.tasks = res.data;
          this.totalTasks = this.tasks.length;
          this.unplannedTasks = this.tasks.filter(t => t.dueDate == new Date(1 / 1 / 1));
          this.unassignedTasks = this.tasks.filter(t => t.assigneeId == "unassigned");
          this.fromDate.setDate(this.today.getDate() - 7)
          this.updatedTaskLength = this.taskService.filterUpdatedDate(this.tasks, new Date(this.fromDate), this.today).length;
          this.createdTaskLength = this.taskService.filterCreatedDate(this.tasks, new Date(this.fromDate), this.today).length;
          this.completedSevenDay = this.taskService.filterDoneSevenDay(this.tasks, new Date(this.fromDate), this.today).length;
          this.completedAllLength = this.tasks.filter(t => t.label == 2).length;

          this.filterLastActivities();
          this.userService.GetAllProjectUsers(projectId).subscribe((res) => {
            if (res.isSuccessful == true) {
              this.users = res.data;
              this.usersTasks();
            }
          })

          this.taskService.getAllProjectTask({ id: projectId }).subscribe((res) => {
            const priorityCounts = this.calculatePriorityCounts(this.tasks);
            this.chartData = {
              labels: this.priorityLabels,
              datasets: [{
                label: 'Task Priority',
                data: [priorityCounts.Lowest, priorityCounts.Low, priorityCounts.Normal, priorityCounts.High, priorityCounts.Highest],
                backgroundColor: this.priorityColors,
                borderColor: this.priorityColors,
                borderWidth: 1
              }]
            };
            this.createPriorityChart();
          });

        }
      })

      this.userService.getAllUsers().subscribe((res) => {
        if (res.isSuccessful == true) {
          this.userList = res.data;
        }
      })

      this.userService.getAllUsers().subscribe((res) => {
        if (res.isSuccessful == true) {
          this.userList = res.data;
        }
      });
    }
  }

  private calculatePriorityCounts(tasks: ListTask[]): PriorityCounts {
    const counts = { Lowest: 0, Low: 0, Normal: 0, High: 0, Highest: 0 };
    tasks.forEach(task => {
      if (task.priority === 1) {
        counts.Lowest++;
      } else if (task.priority === 2) {
        counts.Low++;
      } else if (task.priority === 3) {
        counts.Normal++;
      } else if (task.priority === 4) {
        counts.High++;
      } else if (task.priority === 5) {
        counts.Highest++;
      }
    });
    return counts;
  }

  private readonly priorityIds: { [key: string]: { value: number } } = {
    'Lowest': { value: 1 },
    'Low': { value: 2 },
    'Normal': { value: 3 },
    'High': { value: 4 },
    'Highest': { value: 5 },
  };

  handleClickPriority(clickedPriorityId: number) {
    console.log('Clicked priority Id:', clickedPriorityId);
    this.taskService.setSelectedFilter({ id: clickedPriorityId, name: 'Priorities' });
    this.router.navigate(['/home/list']);
  }

  createPriorityChart() {
    const svg = select<SVGSVGElement, unknown>('#priority-chart').attr('width', 400).attr('height', 300);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 450 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const xScale = scaleBand<string>()
      .domain(this.priorityLabels)
      .range([margin.left, width - margin.right])
      .padding(0.2);

    if (this.chartData) {
      const yScale = scaleLinear()
        .domain([0, Math.max(...this.chartData.datasets[0].data)])
        .range([height - margin.bottom, margin.top]);

      const colorScale = scaleOrdinal<string, string>()
        .domain(this.priorityLabels)
        .range(this.priorityColors);

      const self = this;
      svg.selectAll<SVGRectElement, string>('rect')
        .data(this.chartData.labels)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d) || 0)
        .attr('y', d => yScale(this.chartData.datasets[0].data[this.chartData.labels.indexOf(d)]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(0) - yScale(this.chartData.datasets[0].data[this.chartData.labels.indexOf(d)]))
        .attr('fill', d => colorScale(d))
        .on('click', function (event, d) {
          const clickedPriorityId = self.priorityIds[d].value;
          self.handleClickPriority(clickedPriorityId);
        })
        .on('mouseenter',function(){
          d3.select(this)
            .attr('opacity',0.7)
            .attr('cursor', 'pointer');
        })
        .on('mouseleave',function(){
          d3.select(this)
        .attr('opacity', 1)
        .attr('cursor', 'default'); 
        });

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale).ticks(5);

      svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(xAxis);
      svg.append('g').attr('transform', `translate(${margin.left},0)`).call(yAxis);
    }
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
      (task.assigneeId === tokenId || task.reporterId === tokenId || task.createdByUser === tokenId) &&
      (new Date(task.createdDate) >= twoWeeksAgo || new Date(task.updatedDate) >= twoWeeksAgo)
    );
  }

  openTaskDialog(id: number) {
    let selectedTask = this.tasks.find(t => t.id == id);
    const dialog = this.dialog.open(TaskComponent, { autoFocus: false, data: { task: selectedTask }, height: '90%', width: '90%', panelClass: 'dialog' });
    dialog.afterClosed().subscribe((res) => {
      this.ngOnInit();
    });
  }

  addUserDialog(): void {
    const dialogRef = this.dialog.open(AddUsersToProjectComponent, { height: '90%', width: '50%', panelClass: 'dialog' });
    dialogRef.afterClosed().subscribe((res) => {
      this.ngOnInit();
    });
  }

  getUserLogs() {
    this.logService.getUserLogs(
      [this.projectService.getProjectLocal()?.id],
      this.tokenService.tokenUserId(),
      this.pageNumber,
      this.pageSize
    ).subscribe((res) => {
      if (res.isSuccessful) {
        let logResponse : any = res.data;
        this.userLogs = logResponse.data;
        this.totalCount = logResponse.totalCount;
        
      }
    });
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getUserLogs(); 
    }
  }
  
  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.pageNumber++;
      this.getUserLogs(); 
    }
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
    else if (filter == 'selectAssignee') {
      const user = {
        name: 'selectAssignee',
        id: id
      }
      this.taskService.setSelectedFilter(user);
    }
    else if (filter == 'LastSevendDaysCompletedTasks') {
      const selectedFilter = {
        name: 'LastSevendDaysCompletedTasks',
        fromDate: sevenDaysAgo,
        toDate: today
      };
      this.taskService.setSelectedFilter(selectedFilter);
    }
    else if (filter == 'CompletedTasks') {
      this.taskService.setSelectedFilter(filter);
    }

    this.router.navigate(['/home/list']);
  }
}
