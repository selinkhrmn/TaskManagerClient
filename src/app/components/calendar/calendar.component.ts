import { Component } from '@angular/core';
import { ProjectService } from 'src/app/services';
import { TokenService } from 'src/app/services/token.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { TaskComponent } from '../task/task.component';
import { OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ListTask } from 'src/app/interfaces/listTask';
import notie from 'notie'
import { ToastrService } from 'ngx-toastr';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { UserDto } from 'src/app/interfaces/user';
import { ColumnService } from 'src/app/services';
import { PriorityService } from 'src/app/services/priority.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { HttpClient } from '@angular/common/http';
import { AddUsersToProjectComponent } from '../admin-page/admin-projects/add-users-to-project/add-users-to-project.component';
import { TranslocoService } from '@ngneat/transloco';


interface DayObject {
  taskId?: number; // taskId özelliğini ekleyin
  day: number;
  isToday: boolean;
  showDescription: boolean;
  isSearchedDay: boolean;
  isSearchedDayValid?: boolean;
  description?: string;

  projectNames?: string[]; // Birden fazla proje adını saklamak için bir dizi
  showAllTasks?: boolean; // Tüm görevleri göstermek için

}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('filterMenu', { static: true }) filterMenu: MatMenuTrigger;
  currentMonth: number;
  columns: string[] = [
    'name', 
  ];
  currentYear: number;
  fromDate: Date; updatedFromDate: Date; createdFromDate: Date;
  toDate: Date; updatedToDate: Date; createdToDate: Date;
  dueDateFrom: Date; dueDateTo: Date;
  customMenuClass = 'custom-menu-panel'
  activeFilters: string[] = [];
  selectedColumns: number[] = [];
  listData: ListTask[] = [];
  filteredData: ListTask[] = [];
  selectedAssignees: string[] = [];
  reporters: string[] = [];
  assignees: string[] = [];
  value = 'Clear me';
  projectColumns: ColumnDto[] = [];
  selectedReporters: string[] = [];
  selectedPriorities: number[] = [];
  priorities: string[] = [];
  projectUsers: ProjectUserDto[] = [];
  userList: UserDto[] = [];
  UserName: string = 'ACD VDD';
  searchedDay: number = -1; // Add this property to store the searched day
  searchedMonth: number = -1; // Add this property to store the searched month
  searchedYear: number = -1; // Add this property to store the searched year
  searchDate: string = ''; // Add this property to store the search input

  today: Date = new Date();
  selectedDate: Date = new Date();
  days: DayObject[] = [];

  weekdays: string[] = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Pzr"];
  months: string[] = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  constructor(public tokenService: TokenService,
    private translocoService: TranslocoService,
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private projectService: ProjectService,
    private taskService: TaskService,
    private columnService: ColumnService,
    public priorityService: PriorityService,
    public userService: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
    let id: number = this.projectService.getProjectLocal().id;
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateDays();
    this.taskService.getAllProjectTask({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        console.log(res.data);
        this.listData = res.data;
        this.filteredData = res.data;
        this.applySummaryFilters();
        this.CalendarFilters();
        this.getUserIds();

      }
    });

    this.userService.GetAllProjectUsers({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.projectUsers = res.data;

      }
    })

    this.columnService.GetAllProjectColumns({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.projectColumns = res.data;
      }
    })

    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
        console.log(this.userList);

      }
    })
    this.priorities = this.priorityService.getOptions();

  }
  applySummaryFilters() {
    const selectedFilter = this.taskService.getSelectedFilter();
    if (selectedFilter && selectedFilter.name === 'UpdatedDate') {
      this.updatedFromDate = new Date(selectedFilter.fromDate);
      this.updatedToDate = new Date(selectedFilter.toDate);
      console.log(this.updatedFromDate);

      this.applyFilter('UpdatedDate');
    }
    if (selectedFilter && selectedFilter.name === 'CreatedDate') {
      this.createdFromDate = new Date(selectedFilter.fromDate);
      this.createdToDate = new Date(selectedFilter.toDate);
      this.applyFilter('CreatedDate');
    }

  }
  CalendarFilters() {
    const selectedFilter = this.taskService.getSelectedFilter();
    if (selectedFilter && selectedFilter.name === 'DueDate') {
      this.dueDateFrom = new Date(selectedFilter.fromDate);
      this.dueDateTo = new Date(selectedFilter.toDate);
      this.dueDateTo.setHours(23, 59, 59, 999);  // Bu satırı ekleyin.
      console.log(this.dueDateFrom);

      this.applyFilter('DueDate');
    }
}


  async generateDays(): Promise<void> {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    let id: number = this.projectService.getProjectLocal().id;
    this.taskService.getAllProjectTask({ "id": id })
      .subscribe
      (response => {
        if (response && response.data) {
          const tasksForProjectData = response.data;

          this.days = [];
          for (let dayNumber = 1; dayNumber <= lastDate; dayNumber++) {
            const isToday = this.today.getDate() === dayNumber && this.today.getMonth() === this.currentMonth && this.today.getFullYear() === this.currentYear;
            const isSearchedDay = dayNumber === this.searchedDay && this.searchedDay !== -1;
            const isSearchedDayValid = isSearchedDay && this.currentMonth === this.searchedMonth && this.currentYear === this.searchedYear;

            const tasksForTheDay = tasksForProjectData.filter((task: any) => {

              const taskDate = new Date(task.dueDate);
              return taskDate.getDate() === dayNumber &&
                taskDate.getMonth() === this.currentMonth &&
                taskDate.getFullYear() === this.currentYear;
            });
            const projectNamesForTheDay = tasksForTheDay.map(task => task.name);
            const projectName = tasksForTheDay.length > 0 ? tasksForTheDay[0].name : undefined;

            const taskIdForTheDay = tasksForTheDay.length > 0 ? tasksForTheDay[0].id : undefined;
            this.days.push({
              taskId: taskIdForTheDay,// Burada ekledik
              day: dayNumber,
              isToday: isToday,
              showDescription: false,
              isSearchedDay: isSearchedDay,
              isSearchedDayValid: isSearchedDayValid,
              projectNames: projectNamesForTheDay
            });
          }
        }
      },
        error => {
          console.error('Görevleri alırken hata:', error);
        });
  }
  openTaskDialog(tId: number) {
    this.taskService.getTaskById(tId).subscribe((res) => {
      if (res.isSuccessful == true) {
        const tasks = res.data;
        const dialog = this.dialog.open(TaskComponent, { autoFocus: false, data: { task: tasks }, height: '90%', width: '90%', panelClass: 'dialog' });
        dialog.afterClosed().subscribe(() => {
          this.ngOnInit();
        })
      }
    })
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddUsersToProjectComponent, { height: '90%', width: '50%', panelClass: 'dialog' });
  }
  someMethod(): void {
    const translatedText = this.translocoService.translate('your_translation_key');
    console.log(translatedText);
  }
  showAllTasks(dayObj: DayObject): void {
    // Diğer tüm günlerin kutucuklarını gizleyin
    this.days.forEach(d => d.showAllTasks = false);

    // Seçilen gün için kutucuğu gösterin
    dayObj.showAllTasks = true;
  }
 
  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateDays();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateDays();
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateDays();
  }

  toggleDescription(dayObj: DayObject): void {
    dayObj.showDescription = !dayObj.showDescription;
  }
  toggleTaskDetails(dayObj: DayObject): void {
    // Görev detaylarını açmak veya kapatmak için dayObj.showAllTasks durumunu tersine çevirin
    dayObj.showAllTasks = !dayObj.showAllTasks;
  }

  clearDefaultDescription(dayObj: DayObject): void {
    if (dayObj.description === "This is the description for " + dayObj.day + " " + this.months[this.currentMonth] + " " + this.currentYear) {
      dayObj.description = "";
    }
  }

  searchDay(): void {
    const dateParts = this.searchDate.split('.');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      this.searchedDay = day;
      this.searchedMonth = month;
      this.searchedYear = year;
      this.currentMonth = month;
      this.currentYear = year;
      this.generateDays();
    } else {
      this.searchedDay = -1;
      this.searchedMonth = -1;
      this.searchedYear = -1;
      this.generateDays();
    }
  }

  addPerson(): void {
    console.log("Kişi Ekle butonuna tıklandı!");
  }

  getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
    return initials.toUpperCase();
  }

  isToday(date: number): boolean {
    const today = new Date();
    return (
      date === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  saveDescription(): void {
    console.log('Kaydedilen açıklama:', this.days[this.searchedDay].description);
  }

  addTask(): void {
    console.log('Yapılacaklar butonuna tıklandı');
  }

  clearDescription(): void {
    this.days[this.searchedDay].description = '';
  }

  getTodayText(dayObj: DayObject): string {
    return dayObj.isToday ? "Bugün" : "";
  }

  isSearchedDay(day: number): boolean {
    return day === this.searchedDay && this.searchedDay !== -1;
  }

  toggleFilter(filter: string, selectedDay: number) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, selectedDay);
    const toDate = new Date(selectedDate);
    toDate.setDate(toDate.getDate());


    const selectedFilter = {
      name: 'DueDate',
      fromDate: selectedDate,
      toDate: toDate,
    };

    if (filter === 'DueDate') {
      selectedFilter.name = 'DueDate';
      this.taskService.setSelectedFilter(selectedFilter);
    }

    this.router.navigate(['/home/list']);
  }
  yourButtonClickFunction() {
    console.log('Task Name butonuna tıklandı!');
    // Buraya tıklanınca yapılacak işlemleri ekleyebilirsiniz.
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
      this.toastr.info('Filter Applied!');
    }
    console.log(this.activeFilters);


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
    // else if (filter === 'CompletedTasks') {
    // }
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
      if (this.updatedFromDate && this.updatedToDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskUpdatedDate = new Date(t.updatedDate);
          return (taskUpdatedDate >= this.updatedFromDate && taskUpdatedDate <= this.updatedToDate);
        });
      }
      else if (this.updatedFromDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskUpdatedDate = new Date(t.updatedDate);
          return (taskUpdatedDate >= this.updatedFromDate);
        });
      }
    }


    if (this.activeFilters.includes('CreatedDate')) {
      if (this.createdFromDate && this.createdToDate) {
        this.createdToDate.setHours(23, 59, 59, 999);  // Bu satırı ekleyin.
        this.filteredData = this.filteredData.filter(t => {
          const taskCreatedDate = new Date(t.createdDate);
          return (taskCreatedDate >= this.createdFromDate && taskCreatedDate <= this.createdToDate);
        });
      }
      else if (this.createdFromDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskCreatedDate = new Date(t.createdDate);
          return (taskCreatedDate >= this.createdFromDate);
        });
      }
    }

    if (this.activeFilters.includes('DueDate')) {
      if (this.dueDateFrom && this.dueDateTo) {
        this.dueDateTo.setHours(23, 59, 59, 999);  // Bu satırı ekleyin.
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

  handleUsernameClick(): void {
    console.log('User name clicked!');
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
  stopPropagation(event: { stopPropagation: () => void; }) {
    event.stopPropagation();
  
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
}
