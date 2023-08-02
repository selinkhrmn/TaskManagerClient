import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListTask } from 'src/app/interfaces/listTask';
import { TokenService } from 'src/app/services/token.service';
import { ColumnService, ProjectService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { Project } from 'src/app/interfaces';

// TranslocoService'i import edin.
import { TranslocoService } from '@ngneat/transloco';
import { PriorityService } from 'src/app/services/priority.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { UserService } from 'src/app/services/user.service';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { MatMenuTrigger } from '@angular/material/menu';

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
  columns: string[] = [
    'name', 'columnId', 'assigneeId', 'reporterId', 'DueDate',
    'ListTask.Priority', 'UpdateDate', 'CreateDate',
  ];
  fromDate: Date; updatedFromDate: Date; createdFromDate: Date;
  toDate: Date; updatedToDate: Date; createdToDate: Date;
  priorities: string[] = [];
  activeFilters: string[] = [];
  projectUsers: ProjectUserDto[] = [];
  projectColumns: ColumnDto[] = [];
  selectedColumns: number[] = [];
  isColumnMenuOpen = false;
  customMenuClass = 'custom-menu-panel'

  constructor(
    private http: HttpClient,
    public tokenService: TokenService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private translocoService: TranslocoService,
    public priorityService: PriorityService,
    public userService: UserService,
    private columnService: ColumnService
  ) { }

  ngOnInit(): void {
    let id: number = this.projectService.getProjectLocal().id;
    this.taskService.getAllProjectTask({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        console.log(res.data);
        // this.listData = res.data;
        // this.filteredData = res.data;
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
    this.priorities = this.priorityService.getOptions();


  }

  toggleColumnMenu() {
    this.isColumnMenuOpen = !this.isColumnMenuOpen;
  }

  applyFilter(filter: string) {
    // if (this.activeFilters.includes(filter)) {
    //   this.activeFilters = this.activeFilters.filter(f => f !== filter);
    // }
    // else {
    //   this.activeFilters.push(filter);
    // }

    if (filter === 'Columns') {
      this.filterByColumns(); // Update the selected columns immediately
    } else {
      if (this.activeFilters.includes(filter)) {
        this.activeFilters = this.activeFilters.filter(f => f !== filter);
      } else {
        this.activeFilters.push(filter);
      }
    }


    this.filteredData = this.listData;

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

        this.filteredData = this.listData.filter(t => {
          const taskCreateDate = new Date(t.createDate);
          const taskUpdatedDate = new Date(t.updateDate);
          const taskDueDate = new Date(t.dueDate);
          return ((taskCreateDate >= fromDate && taskCreateDate <= toDate) ||
            (taskUpdatedDate >= fromDate && taskUpdatedDate <= toDate) ||
            (taskDueDate >= fromDate && taskDueDate <= toDate));
        });
      }
      else if (this.fromDate) {
        this.filteredData = this.listData.filter(t => {
          const taskCreateDate = new Date(t.createDate);
          const taskUpdatedDate = new Date(t.updateDate);
          const taskDueDate = new Date(t.dueDate);
          return ((taskCreateDate >= fromDate) ||
            (taskUpdatedDate >= fromDate) ||
            (taskDueDate >= fromDate));
        });
      }
    }
    if (this.activeFilters.includes('AssignedTo')) {
      //user objesi oluşturulacak, seçilen user ona verilecek buraya sadece id gerekli
      //this.filteredData = this.filteredData.filter(t => t.assigneeId == this.user.id);
    }
    if (this.activeFilters.includes('Columns')) {
      this.filteredData = this.filterByColumns();
    }
    if (this.activeFilters.includes('UpdatedDate')) {
      if (this.updatedFromDate) {
        this.filteredData = this.checkDates(this.updatedFromDate, this.updatedToDate);
      }
    }
    if (this.activeFilters.includes('CreatedDate')) {
      if (this.createdFromDate) {
        this.filteredData = this.checkDates(this.createdFromDate, this.createdToDate);
      }
    }
    if (this.activeFilters.includes('Reporter')) {
      //user objesi oluşturulacak, seçilen user ona verilecek buraya sadece id gerekli
      //this.filteredData = this.filteredData.filter(t => t.reporterId == this.user.id);
    }
    if (this.activeFilters.includes('Priority')) {

    }
  }

  filterByColumns() {
    const selectedColumnIds = this.selectedColumns;

    if (selectedColumnIds.length === 0) {
      return this.listData;
    }
    this.activeFilters = this.activeFilters.filter(filter => filter !== 'Columns');

    return this.listData.filter(item => {
      return selectedColumnIds.includes(item.columnId);
    });
  }

  checkDates(fromDate: Date, toDate: Date) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (fromDate && this.toDate) {
      this.filteredData = this.filteredData.filter(t => {
        const taskUpdatedDate = new Date(t.updateDate);
        return (taskUpdatedDate >= from && taskUpdatedDate <= to);
      });
    }
    else if (fromDate) {
      this.filteredData = this.filteredData.filter(t => {
        const taskUpdatedDate = new Date(t.updateDate);
        return (taskUpdatedDate >= fromDate);
      });
    }
    return this.filteredData
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

  // Örnek Transloco kullanım metodu:
  someMethod(): void {
    const translatedText = this.translocoService.translate('your_translation_key');
    console.log(translatedText);
  }



}
