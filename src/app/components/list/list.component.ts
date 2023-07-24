import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListTask } from 'src/app/interfaces/listTask';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  data: ListTask[] = [];
  filteredData: ListTask[] = [];
  columns: string[] = [
    'id',
    'name',
    'columnId',
    'assigneeId',
    'reporterId',
    'DueDate',
    'ListTask.Priority',
    'UpdateDate',
    'CreateDate',
    // Add other properties from ListTask interface if you want them displayed on the table.
  ];

  constructor(
    private http: HttpClient, // Inject HttpClient here
    public tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<ListTask[]>('YOUR_BACKEND_URL_HERE').subscribe(
      (response: ListTask[]) => { // Define the response type explicitly
        this.data = response;
        this.filteredData = [...this.data]; // Başlangıçta tüm verileri arama sonuçlarına kopyalayın
      },
      (error: any) => { // Define the error type explicitly
        console.error('Veri yüklenirken bir hata oluştu:', error);
      }
    );
  }

  filterByName(searchText: string): void {
    this.filteredData = this.data.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  handleUsernameClick(): void {
    // Your logic when the user clicks on the user name goes here
    console.log('User name clicked!');
  }
  addPerson(): void {
    // Burada "Kişi Ekle" butonuna tıklandığında yapılması gereken işlemleri ekleyebilirsiniz.
    console.log("Kişi Ekle butonuna tıklandı!");
  }
}
