import { Component } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

interface DayObject {
  day: number;
  isToday: boolean;
  showDescription: boolean;
  isSearchedDay?: boolean;
  description?: string;  // Bu özellik isteğe bağlıdır (bu nedenle '?' kullanılır)
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
  searchDate: string = ''; // Add this property to store the search input

  today: Date = new Date();
  selectedDate: Date = new Date();
  days: DayObject[] = []; // Burada değişiklik yaptık

  // Update the weekdays array to start from Monday
  weekdays: string[] = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Pzr"];
  months: string[] = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  constructor(public tokenService: TokenService){

  }

  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateDays();
  }

  generateDays(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const previousMonthLastDate = new Date(this.currentYear, this.currentMonth, 0).getDate();

    let offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    this.days = [];

    // Önceki ayın son günlerini ekleyin
    for (let i = 0; i < offset; i++) {
        this.days.push({ 
            day: previousMonthLastDate - offset + i + 1, 
            isToday: false, 
            showDescription: false 
        });
    }

    // Geçerli ayın günlerini ekleyin
    for (let dayNumber = 1; dayNumber <= lastDate; dayNumber++) {
        const isToday = this.today.getDate() === dayNumber && this.today.getMonth() === this.currentMonth && this.today.getFullYear() === this.currentYear;
        this.days.push({ day: dayNumber, isToday: isToday, showDescription: false });
    }

    // Ayın son günlerinden sonrasını bir sonraki ayın ilk günleriyle doldurun
    const daysAdded = this.days.length;
    for (let i = daysAdded; i < 42; i++) { // 42, 6 hafta * 7 gün = 42 gün (genellikle takvimlerde en fazla 6 satır vardır)
        this.days.push({ 
            day: i - daysAdded + 1, 
            isToday: false, 
            showDescription: false 
        });
    }
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

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  toggleDescription(dayObj: DayObject): void {
    dayObj.showDescription = !dayObj.showDescription;
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
      const searchedDate = new Date(year, month, day);
      const foundDay = this.days.findIndex((dayObj) => {
        return (
          dayObj.day === day &&
          dayObj.isToday === false &&
          this.currentMonth === month &&
          this.currentYear === year
        );
      });

      if (foundDay !== -1) {
        this.searchedDay = foundDay;
      } else {
        // If the searched date is not found, clear the search result
        this.searchedDay = -1;
      }
    } else {
      // If the input is not in a valid date format, clear the search result
      this.searchedDay = -1;
    }
  }
  addPerson(): void {
    // Burada "Kişi Ekle" butonuna tıklandığında yapılması gereken işlemleri ekleyebilirsiniz.
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
}


