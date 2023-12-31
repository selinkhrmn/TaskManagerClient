import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListTask } from 'src/app/interfaces/listTask';
import { TokenService } from 'src/app/services/token.service';
import { ColumnService, ProjectService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { Project } from 'src/app/interfaces';
import notie from 'notie'
import { ToastrService } from 'ngx-toastr';

// TranslocoService'i import edin.
import { TranslocoService } from '@ngneat/transloco';
import { PriorityService } from 'src/app/services/priority.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { UserService } from 'src/app/services/user.service';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserDto } from 'src/app/interfaces/user';
import { AddUsersToProjectComponent } from '../admin-page/admin-projects/add-users-to-project/add-users-to-project.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPipe } from 'src/pipes/user.pipe';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { UnplannedComponentComponent } from './unplanned/unplanned.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ListComponent implements OnInit {
  @ViewChild('filterMenu', { static: true }) filterMenu: MatMenuTrigger;

  listData: ListTask[] = [];
  filteredData: ListTask[] = [];
  userList: UserDto[] = [];
  columns: string[] = [
    'name', 'columnId', 'assigneeId', 'reporterId', 'DueDate',
    'ListTask.Priority', 'UpdateDate', 'CreateDate', 'isDone'
  ];
  projectId: number;
  fromDate: Date; updatedFromDate: Date; createdFromDate: Date; isDoneFromDate: Date;
  toDate: Date; updatedToDate: Date; createdToDate: Date; isDoneToDate: Date;
  dueDateFrom: Date; dueDateTo: Date;
  priorities: string[] = [];
  activeFilters: string[] = [];
  projectUsers: ProjectUserDto[] = [];
  projectColumns: ColumnDto[] = [];
  selectedColumns: number[] = [];
  isColumnMenuOpen = false;
  customMenuClass = 'custom-menu-panel'
  selectedPriorities:number[] = [];
  appliedFilter: number = 0;
  value = 'Clear me';
  reporterValue: string;
  assignees: string[] = [];
  reporters: string[] = [];
  selectedAssignees: string[] = [];
  selectedReporters: string[] = [];
  unPlannedTasks: TaskDto[] = [];

  constructor(
    private http: HttpClient,
    public tokenService: TokenService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private translocoService: TranslocoService,
    public priorityService: PriorityService,
    public userService: UserService,
    private columnService: ColumnService,
    private dialog: MatDialog,
    private toastr: ToastrService

  ) { }


  ngOnInit(): void {
    if (this.projectService.getProjectLocal() != null) {
      this.projectId = this.projectService.getProjectLocal().id;
      this.taskService.getAllProjectTask({ "id": this.projectId }).subscribe((res) => {
        if (res.isSuccessful == true) {
          this.listData = res.data;
          this.filteredData = res.data;
          this.applySummaryFilters();
          this.CalendarFilters();
          this.getUserIds();
          
        }
      });

      this.userService.GetAllProjectUsers(this.projectId).subscribe((res) => {
        if (res.isSuccessful == true) {
          this.projectUsers = res.data;

        }
      })

      this.columnService.GetAllProjectColumns({ "id": this.projectId }).subscribe((res) => {
        if (res.isSuccessful == true) {
          this.projectColumns = res.data;
        }
      })

      this.userService.getAllUsers().subscribe((res) => {
        if (res.isSuccessful == true) {
          this.userList = res.data;
        }
      })

      this.priorities = this.priorityService.getOptions();
    }
  }

  stopPropagation(event: { stopPropagation: () => void; }) {
    event.stopPropagation();

  }

  applySummaryFilters() {
    const selectedFilter = this.taskService.getSelectedFilter();
    if (selectedFilter && selectedFilter.name === 'UpdatedDate') {
      this.updatedFromDate = new Date(selectedFilter.fromDate);
      this.updatedToDate = new Date(selectedFilter.toDate);
      this.applyFilter('UpdatedDate');
    }

    else if (selectedFilter && selectedFilter.name === 'CreatedDate') {
      this.createdFromDate = new Date(selectedFilter.fromDate);
      this.createdToDate = new Date(selectedFilter.toDate);
      this.applyFilter('CreatedDate');
    }

    else if (selectedFilter && selectedFilter.name == 'selectAssignee') {
      this.selectAssignee(selectedFilter.id);
    }

    else if (selectedFilter && selectedFilter.name == 'LastSevendDaysCompletedTasks') {
      this.isDoneFromDate = new Date(selectedFilter.fromDate);
      this.isDoneToDate = new Date(selectedFilter.toDate);
      this.applyFilter('LastSevendDaysCompletedTasks');
    }
    else if (selectedFilter && selectedFilter == 'CompletedTasks') {
      this.applyFilter('CompletedTasks');
    }

    else if(selectedFilter && selectedFilter.name == 'Priorities') {
      this.selectedPriorities.push(selectedFilter.id);
      this.applyFilter('Priorities');
    }
    else if(selectedFilter && selectedFilter.name == 'Columns') {
      this.selectedColumns.push(selectedFilter.id);
      this.applyFilter('Columns');
    }

  }

  CalendarFilters() {
    const selectedFilter = this.taskService.getSelectedFilter();
    if (selectedFilter && selectedFilter.name === 'DueDate') {
      this.dueDateFrom = new Date(selectedFilter.fromDate);
      this.dueDateTo = new Date(selectedFilter.toDate);
      this.dueDateTo.setHours(23, 59, 59, 999);
      console.log(this.dueDateFrom);

      this.applyFilter('DueDate');
    }
  }




  applyFilter(filter: string) {

    this.filteredData = this.listData;
    //this.getUserIds();

    if (this.activeFilters.includes(filter)) {
      if (filter == 'AssignedToMe' || filter == 'DueDateThisWeek' || filter == 'CompletedTasks') {
        this.activeFilters = this.activeFilters.filter(f => f !== filter);
      }
    }
    else {
      this.activeFilters.push(filter);
    }


    if (this.activeFilters.includes('AssignedToMe')) {
      this.filteredData = this.filteredData.filter(t => t.assigneeId == this.tokenService.tokenUserId());
    }

    if (this.activeFilters.includes('DueDateThisWeek')) {
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6);

      this.filteredData = this.filteredData.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= startOfWeek && dueDate <= endOfWeek
      });

    }

    if (filter === 'CompletedTasks') {
      this.filteredData = this.filteredData.filter(t => t.label == 2);
    }

    if(filter === 'ActiveTasks'){
      this.filteredData = this.filteredData.filter(t => t.label == 1);
    }

    if (filter === 'LastSevendDaysCompletedTasks') {
      this.filteredData = this.taskService.filterDoneSevenDay(this.filteredData, this.isDoneFromDate, this.isDoneToDate);
    }

    if (this.activeFilters.includes('BetweenDates')) {
      const fromDate = new Date(this.fromDate);
      if (this.fromDate && this.toDate) {
        const toDate = new Date(this.toDate);
        this.filteredData = this.filteredData.filter(t => {
          const taskCreateDate = new Date(t.createdDate);
          const taskUpdatedDate = new Date(t.updatedDate);
          const taskDueDate = new Date(t.dueDate);
          return ((taskCreateDate >= fromDate && taskCreateDate <= toDate) ||
            (taskUpdatedDate >= fromDate && taskUpdatedDate <= toDate) ||
            (taskDueDate >= fromDate && taskDueDate <= toDate));
        });
      }
      else if (this.fromDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskCreateDate = new Date(t.createdDate);
          const taskUpdatedDate = new Date(t.updatedDate);
          const taskDueDate = new Date(t.dueDate);
          return ((taskCreateDate >= fromDate) ||
            (taskUpdatedDate >= fromDate) ||
            (taskDueDate >= fromDate));
        });
      }
    }

    if (this.activeFilters.includes('AssignedTo') && this.selectedAssignees.length != 0) {
      this.filteredData = this.filteredData.filter(task => this.selectedAssignees.includes(task.assigneeId));
    }

    if (this.activeFilters.includes('Columns') && this.selectedColumns.length != 0) {
      this.filteredData = this.filteredData.filter(t => this.selectedColumns.includes(t.columnId));
    }

    if (this.activeFilters.includes('UpdatedDate')) {

      this.filteredData = this.taskService.filterUpdatedDate(this.filteredData, this.updatedFromDate, this.updatedToDate);
    }


    if (this.activeFilters.includes('CreatedDate')) {
      this.filteredData = this.taskService.filterCreatedDate(this.filteredData, this.createdFromDate, this.createdToDate);

    }

    if (this.activeFilters.includes('DueDate')) {
      if (this.dueDateFrom && this.dueDateTo) {
        this.dueDateTo.setHours(23, 59, 59, 999);
        this.filteredData = this.filteredData.filter(t => {
          const taskDueDate = new Date(t.dueDate);

          return (taskDueDate >= this.dueDateFrom && taskDueDate <= this.dueDateTo);
        });
      }
      else if (this.dueDateFrom) {
        this.filteredData = this.filteredData.filter(t => {
          const taskDueDate = new Date(t.dueDate);
          return (taskDueDate >= this.dueDateFrom);
        });
      }
    }

    if (this.activeFilters.includes('Reporter') && this.selectedReporters.length != 0) {
      this.filteredData = this.filteredData.filter(task => this.selectedReporters.includes(task.reporterId));
    }


    if (this.activeFilters.includes('Priorities') && this.selectedPriorities.length != 0) {

      this.filteredData = this.filteredData.filter(t => this.selectedPriorities.includes(t.priority));
    }
    
  }

  getUserIds(): void {
    const getAssignees = new Set<string>();
    const getReporters = new Set<string>();

    this.listData.forEach(task => {
      if (!getAssignees.has(task.assigneeId)) {
        getAssignees.add(task.assigneeId);
        this.assignees.push(task.assigneeId);
      }

      if (!getReporters.has(task.reporterId)) {
        getReporters.add(task.reporterId);
        this.reporters.push(task.reporterId);
      }
    });
  }

  selectAssignee(userId: string) {
    const index = this.selectedAssignees.indexOf(userId);
    if (index === -1) {
      this.selectedAssignees.push(userId);
    } else {
      this.selectedAssignees.splice(index, 1);
    }
    this.applyFilter('AssignedTo');
  }

  selectReporter(userId: string) {
    const index = this.selectedReporters.indexOf(userId);
    if (index === -1) {
      this.selectedReporters.push(userId);
    } else {
      this.selectedReporters.splice(index, 1);
    }
    this.applyFilter('Reporter');
  }


  handlePriorityClick(priority: number) {
    if (this.selectedPriorities.includes(priority)) {
      this.selectedPriorities = this.selectedPriorities.filter(p => p !== priority);
    }
    else {
      this.selectedPriorities.push(priority);
    }
    this.applyFilter('Priorities');

  }


  handleColumnSelect(columnId: number) {
    if (this.selectedColumns.includes(columnId)) {
      this.selectedColumns = this.selectedColumns.filter(id => id !== columnId);
    }
    else {
      this.selectedColumns.push(columnId);
    }
    this.applyFilter('Columns');
  }

  cancelPriorities() {
    if (this.selectedPriorities.length != 0) {
      this.selectedPriorities = [];
    }
    this.applyFilter('Priorities');
  }

  cancelCreateDates() {
    //this.createdFromDate = undefined
    // this.createdToDate = undefined;
  }

  clearFilter() {
    this.selectedColumns = [];
    this.selectedPriorities = [];
    this.activeFilters = [];
    this.selectedAssignees = [];
    this.selectedReporters = [];
    //dates;
    this.filteredData = this.listData;
    notie.alert({ type: 'error', text: 'Filter(s) Cleared!' })

  }

  clearAssignees() {
    this.selectedAssignees = [];
  }

  clearReporters() {
    this.selectedReporters = [];
  }

  loadData(): void {
    this.http.get<ListTask[]>('YOUR_BACKEND_URL_HERE').subscribe(
      (response: ListTask[]) => {
        this.listData = response;
        this.filteredData = [...this.listData];
      },
      (error: any) => {
        console.error('Veri yüklenirken bir hata oluştu:', error);
      }
    );
  }

  filterByName(searchText: string): void {
    console.log("filterByName fonksiyonu çağrıldı:", searchText);
    this.filteredData = this.listData.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  handleUsernameClick(): void {
    console.log('User name clicked!');
  }

  addPerson(): void {
    console.log("Kişi Ekle butonuna tıklandı!");
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddUsersToProjectComponent, { height: '90%', width: '50%', panelClass: 'dialog' });
  }

  // Örnek Transloco kullanım metodu:
  someMethod(): void {
    const translatedText = this.translocoService.translate('your_translation_key');
    console.log(translatedText);
  }

  getUnplannedTasks() {
    const dialogRef = this.dialog.open(UnplannedComponentComponent, {
      width: '400px', // İsteğe bağlı: Dialogun genişliği
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog kapatıldı:', result);
    });
  }

}
