import { Component } from '@angular/core';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { UserDto } from 'src/app/interfaces/user';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent {
  name: string = '';
  message: string = '';
  sharedData: string[] = []; // Yeni dizi
  userList: UserDto[] = [];
  users: ProjectUserDto[] = [];

  paylas() {
    this.sharedData.push(this.name); // Diziye ekleme
    this.name = ''; // Alanı temizle
    this.message = ''; // Alanı temizle
  }
}
