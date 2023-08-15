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
export class CalendarComponent {
  currentMonth: number;
  currentYear: number;
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

  constructor(public tokenService: TokenService,private dialog: MatDialog
,    private cdRef: ChangeDetectorRef, private projectService: ProjectService, private taskService: TaskService, private router: Router) {}
  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateDays();

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
                  taskId: taskIdForTheDay ,// Burada ekledik
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
        const dialog = this.dialog.open(TaskComponent, {autoFocus : false, data: { task: tasks }, height: '90%', width: '90%', panelClass: 'dialog' });
        dialog.afterClosed().subscribe(() => {
          this.ngOnInit();
        })
      }
    })
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
    if(dayObj.description === "This is the description for " + dayObj.day + " " + this.months[this.currentMonth] + " " + this.currentYear) {
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

}
