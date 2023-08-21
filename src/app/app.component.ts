import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileService } from './services/file.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private http: HttpClient, private fileService : FileService) {
    // swal.fire("good job", "","success");
  }
  

  
}
