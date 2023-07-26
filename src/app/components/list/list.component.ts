import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListTask } from 'src/app/interfaces/listTask';
import { TokenService } from 'src/app/services/token.service';
import { ProjectService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { Project } from 'src/app/interfaces';

// TranslocoService'i import edin.
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  data: ListTask[] = [];
  filteredData: ListTask[] = [];
  columns: string[] = [
    'id', 'name', 'columnId', 'assigneeId', 'reporterId', 'DueDate',
    'ListTask.Priority', 'UpdateDate', 'CreateDate',
  ];

  // Bileşenin yapıcı (constructor) fonksiyonuna TranslocoService'i enjekte edin.
  constructor(
    private http: HttpClient,
    public tokenService: TokenService,
    private taskService : TaskService,
    private projectService : ProjectService,
    private translocoService: TranslocoService // Bu satırı ekleyin.
  ) {}

  ngOnInit(): void {
    this.taskService.getAllProjectTask({"id" : this.projectService.getCurrentProject().id}).subscribe((res) => {
      if(res && res.data) {
        this.data = res.data.map(task => ({
          id: task.id,
          name: task.name,
          columnId: task.columnId.toString(),
          assigneeId: 0, 
          reporterId: 0,
          DueDate: new Date(),
          Priority: task.priority,
          UpdateDate: task.updatedDate,
          CreateDate: task.createdDate,
        }));
        this.filteredData = [...this.data];
      }
    });
  }

  loadData(): void {
    this.http.get<ListTask[]>('YOUR_BACKEND_URL_HERE').subscribe(
      (response: ListTask[]) => {
        this.data = response;
        this.filteredData = [...this.data];
      },
      (error: any) => {
        console.error('Veri yüklenirken bir hata oluştu:', error);
      }
    );
  }

  filterByName(searchText: string): void {
    console.log("filterByName fonksiyonu çağrıldı:", searchText);
    this.filteredData = this.data.filter(item =>
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
